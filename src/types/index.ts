import type Feature from 'ol/Feature'
import type { Point } from 'ol/geom'

export interface DispenserForm {
	name: string
	isIndoor: boolean
	floor: string
	waterTypes: string
}

export interface FeatureSummary {
	id: string
	name: string
	isIndoor: boolean
	waterTypes: string
	floor: string | null
}

export type DispenserFeature = Feature<Point>

export const INITIAL_FORM: DispenserForm = {
	name: '',
	isIndoor: true,
	floor: '',
	waterTypes: 'still,sparkling',
}
