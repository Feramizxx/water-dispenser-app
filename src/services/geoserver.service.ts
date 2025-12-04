import { Point } from 'ol/geom'
import GeoJSON from 'ol/format/GeoJSON'
import { toLonLat } from 'ol/proj'
import { WORKSPACE, FEATURE_TYPE, TYPE_NAME, FEATURE_NS, MAP_CONFIG } from '../constants'
import type { FeatureSummary, DispenserFeature } from '../types'

const geojsonFormat = new GeoJSON()

/**
 * Escape XML special characters
 */
const escapeXml = (str: string): string => {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
}

/**
 * Fetch features from GeoServer via WFS
 */
export async function fetchFeatures (): Promise<DispenserFeature[]> {
	const params = new URLSearchParams({
		service: 'WFS',
		version: '2.0.0',
		request: 'GetFeature',
		typeName: TYPE_NAME,
		outputFormat: 'application/json',
	})

	const response = await fetch(`/geoserver/${WORKSPACE}/ows?${params.toString()}`)

	if (!response.ok) {
		throw new Error(`Failed to load features: ${response.statusText}`)
	}

	const data = await response.json()
	const features = geojsonFormat.readFeatures(data, {
		featureProjection: MAP_CONFIG.defaultProjection,
	}) as DispenserFeature[]

	return features
}

/**
 * Convert features to summary list
 */
export function featuresToSummary (features: DispenserFeature[]): FeatureSummary[] {
	return features.map((feature) => ({
		id: feature.getId() as string,
		name: feature.get('name') ?? 'Unnamed',
		isIndoor: Boolean(feature.get('is_indoor')),
		waterTypes: feature.get('water_types') ?? '',
		floor: feature.get('floor') ?? null,
	}))
}

/**
 * Create a new feature via WFS-T Insert
 */
export async function createFeature (feature: DispenserFeature): Promise<void> {
	const geom = feature.getGeometry() as Point
	const coords = toLonLat(geom.getCoordinates())

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
	xml += `<wfs:Transaction service="WFS" version="1.1.0"
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:wd="${FEATURE_NS}">\n`

	xml += '  <wfs:Insert>\n'
	xml += `    <wd:${FEATURE_TYPE}>\n`
	xml += '      <wd:geom>\n'
	xml += '        <gml:Point srsName="EPSG:4326">\n'
	xml += `          <gml:pos>${coords[0]} ${coords[1]}</gml:pos>\n`
	xml += '        </gml:Point>\n'
	xml += '      </wd:geom>\n'
	xml += `      <wd:name>${escapeXml(feature.get('name') || '')}</wd:name>\n`
	xml += `      <wd:is_indoor>${feature.get('is_indoor') ? 'true' : 'false'}</wd:is_indoor>\n`

	const floor = feature.get('floor')
	if (floor) {
		xml += `      <wd:floor>${escapeXml(String(floor))}</wd:floor>\n`
	}

	const waterTypes = feature.get('water_types')
	if (waterTypes) {
		xml += `      <wd:water_types>${escapeXml(String(waterTypes))}</wd:water_types>\n`
	}

	xml += `    </wd:${FEATURE_TYPE}>\n`
	xml += '  </wfs:Insert>\n'
	xml += '</wfs:Transaction>'

	const response = await fetch('/geoserver/wfs', {
		method: 'POST',
		headers: { 'Content-Type': 'text/xml' },
		body: xml,
	})

	if (!response.ok) {
		const text = await response.text()
		throw new Error(`Create failed: ${response.status} ${text}`)
	}
}

/**
 * Update an existing feature via WFS-T Update
 */
export async function updateFeature (feature: DispenserFeature): Promise<void> {
	const geom = feature.getGeometry()
	if (!geom) {
		throw new Error('Feature has no geometry')
	}

	const [lon, lat] = toLonLat(geom.getCoordinates())
	const fid = feature.getId()

	const xml = `
  <wfs:Transaction service="WFS" version="1.1.0"
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:wd="${FEATURE_NS}">
    
    <wfs:Update typeName="${TYPE_NAME}">
      <wfs:Property>
        <wfs:Name>geom</wfs:Name>
        <wfs:Value>
          <gml:Point srsName="EPSG:4326">
            <gml:pos>${lon} ${lat}</gml:pos>
          </gml:Point>
        </wfs:Value>
      </wfs:Property>

      <wfs:Property><wfs:Name>name</wfs:Name><wfs:Value>${escapeXml(String(feature.get('name') || ''))}</wfs:Value></wfs:Property>
      <wfs:Property><wfs:Name>is_indoor</wfs:Name><wfs:Value>${String(feature.get('is_indoor'))}</wfs:Value></wfs:Property>
      <wfs:Property><wfs:Name>floor</wfs:Name><wfs:Value>${escapeXml(String(feature.get('floor') || ''))}</wfs:Value></wfs:Property>
      <wfs:Property><wfs:Name>water_types</wfs:Name><wfs:Value>${escapeXml(String(feature.get('water_types') || ''))}</wfs:Value></wfs:Property>

      <ogc:Filter><ogc:FeatureId fid="${fid}"/></ogc:Filter>
    </wfs:Update>
  </wfs:Transaction>
  `

	const response = await fetch('/geoserver/wfs', {
		method: 'POST',
		headers: { 'Content-Type': 'text/xml' },
		body: xml,
	})

	const text = await response.text()
	if (text.includes('Exception')) {
		console.error('UPDATE ERROR:', text)
		throw new Error('Update failed')
	}

	if (!response.ok) {
		throw new Error(`Update failed: ${response.status}`)
	}
}

/**
 * Delete a feature via WFS-T Delete
 */
export async function deleteFeature (fid: string | number): Promise<void> {
	// Extract actual FID if it's in format "workspace:layer.id"
	let actualFid = fid
	if (typeof fid === 'string' && fid.includes(':')) {
		const parts = fid.split(':')
		actualFid = parts[1] ?? fid
	}

	const xml = `
  <wfs:Transaction service="WFS" version="1.1.0"
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:ogc="http://www.opengis.net/ogc">
    
    <wfs:Delete typeName="${TYPE_NAME}">
      <ogc:Filter>
        <ogc:FeatureId fid="${actualFid}"/>
      </ogc:Filter>
    </wfs:Delete>
  </wfs:Transaction>
  `

	const response = await fetch('/geoserver/wfs', {
		method: 'POST',
		headers: { 'Content-Type': 'text/xml' },
		body: xml,
	})

	const text = await response.text()
	if (text.includes('Exception')) {
		console.error('DELETE ERROR:', text)
		throw new Error('Delete failed')
	}

	if (!response.ok) {
		throw new Error(`Delete failed: ${response.status}`)
	}
}
