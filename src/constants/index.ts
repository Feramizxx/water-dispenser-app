export const WORKSPACE = 'waterdispensers'
export const FEATURE_TYPE = 'water_dispensers'
export const FEATURE_NS = 'http://localhost/waterdispensers'
export const TYPE_NAME = `${WORKSPACE}:${FEATURE_TYPE}`

export const MAP_CONFIG = {
	center: [-73.97, 40.76] as [number, number],
	zoom: 12,
	defaultProjection: 'EPSG:3857',
	wgsProjection: 'EPSG:4326',
}

export const MARKER_COLORS = {
	indoor: 'rgba(59,130,246,0.7)', // Blue
	outdoor: 'rgba(16,185,129,0.7)', // Green
	stroke: '#ffffff',
}
