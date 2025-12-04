import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { fromLonLat, toLonLat } from 'ol/proj'
import type { DispenserForm, DispenserFeature } from '../types'

/**
 * Build a feature from form data
 */
export function buildFeatureFromForm (
	form: DispenserForm,
	coordinates: [number, number],
	id?: string | number,
): DispenserFeature {
	const geometry = new Point(fromLonLat(coordinates))

	const feature = new Feature<Point>({
		name: form.name,
		is_indoor: form.isIndoor,
		floor: form.isIndoor ? form.floor : '',
		water_types: form.waterTypes,
	})

	feature.setGeometryName('geom')
	feature.setGeometry(geometry)

	if (id) {
		feature.setId(id)
	}

	return feature
}

/**
 * Extract form data from a feature
 */
export function featureToForm (feature: DispenserFeature): {
	form: DispenserForm
	coordinates: [number, number]
} {
	const geometry = feature.getGeometry()
	if (!geometry) {
		throw new Error('Feature has no geometry')
	}

	const lonLat = toLonLat(geometry.getCoordinates())

	return {
		form: {
			name: feature.get('name') ?? '',
			isIndoor: Boolean(feature.get('is_indoor')),
			floor: feature.get('floor') ?? '',
			waterTypes: feature.get('water_types') ?? '',
		},
		coordinates: [lonLat[0] ?? 0, lonLat[1] ?? 0],
	}
}
