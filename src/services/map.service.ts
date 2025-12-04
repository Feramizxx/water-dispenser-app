import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import TileWMS from 'ol/source/TileWMS'
import { fromLonLat } from 'ol/proj'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { WORKSPACE, MAP_CONFIG, MARKER_COLORS } from '../constants'
import type { DispenserFeature } from '../types'

export interface MapLayers {
	wms: TileLayer
	wfs: VectorLayer<VectorSource<DispenserFeature>>
}

/**
 * Create marker style based on indoor/outdoor status
 */
function createMarkerStyle (isIndoor: boolean): Style {
	return new Style({
		image: new CircleStyle({
			radius: 8,
			fill: new Fill({
				color: isIndoor ? MARKER_COLORS.indoor : MARKER_COLORS.outdoor,
			}),
			stroke: new Stroke({
				color: MARKER_COLORS.stroke,
				width: 2,
			}),
		}),
	})
}

/**
 * Create WMS layer for visualization
 */
function createWmsLayer (): TileLayer {
	return new TileLayer({
		source: new TileWMS({
			url: `/geoserver/${WORKSPACE}/wms`,
			params: {
				LAYERS: `${WORKSPACE}:water_dispensers`,
				TILED: true,
				VERSION: '1.1.0',
			},
			serverType: 'geoserver',
			transition: 0,
		}),
		opacity: 0.6,
	})
}

/**
 * Create WFS vector layer for interaction
 */
function createWfsLayer (vectorSource: VectorSource<DispenserFeature>): VectorLayer<VectorSource<DispenserFeature>> {
	return new VectorLayer({
		source: vectorSource,
		style: (feature) => {
			const isIndoor = Boolean(feature.get('is_indoor'))
			return createMarkerStyle(isIndoor)
		},
	})
}

/**
 * Initialize OpenLayers map
 */
export function createMap (
	target: HTMLElement,
	vectorSource: VectorSource<DispenserFeature>,
): { map: Map; layers: MapLayers } {
	const wmsLayer = createWmsLayer()
	const wfsLayer = createWfsLayer(vectorSource)

	const map = new Map({
		target,
		layers: [
			new TileLayer({
				source: new OSM(),
			}),
			wmsLayer,
			wfsLayer,
		],
		view: new View({
			center: fromLonLat(MAP_CONFIG.center),
			zoom: MAP_CONFIG.zoom,
		}),
	})

	return {
		map,
		layers: {
			wms: wmsLayer,
			wfs: wfsLayer,
		},
	}
}
