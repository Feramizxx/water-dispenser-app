<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VectorSource from 'ol/source/Vector'
import 'ol/ol.css'

// Components
import AppHeader from './components/AppHeader.vue'
import MapView from './components/MapView.vue'
import DispenserList from './components/DispenserList.vue'
import DispenserForm from './components/DispenserForm.vue'

// Services
import * as GeoServerService from './services/geoserver.service'
import * as FeatureService from './services/feature.service'

// Types & Constants
import { INITIAL_FORM } from './types'
import type { DispenserForm as DispenserFormData, FeatureSummary, DispenserFeature } from './types'

// State
const vectorSource = new VectorSource<DispenserFeature>()
const featureList = ref<FeatureSummary[]>([])
const form = ref<DispenserFormData>({ ...INITIAL_FORM })
const selectedFeature = ref<DispenserFeature | null>(null)
const clickedCoord = ref<[number, number] | null>(null)
const loading = ref(false)
const status = ref<string | null>(null)

// Fetch and update features from GeoServer
async function loadFeatures () {
	const features = await GeoServerService.fetchFeatures()
	vectorSource.clear()
	vectorSource.addFeatures(features)
	featureList.value = GeoServerService.featuresToSummary(features)
}

// CRUD Operations
async function handleCreate () {
	if (!clickedCoord.value) {
		status.value = 'Please click on the map to set coordinates.'
		return
	}

	try {
		loading.value = true
		const feature = FeatureService.buildFeatureFromForm(form.value, clickedCoord.value)
		await GeoServerService.createFeature(feature)
		await loadFeatures()

		form.value = { ...INITIAL_FORM }
		clickedCoord.value = null
		status.value = 'Dispenser added.'
	} catch (error) {
		status.value = error instanceof Error ? error.message : 'Failed to add dispenser.'
	} finally {
		loading.value = false
	}
}

async function handleUpdate () {
	if (!selectedFeature.value || !clickedCoord.value) {
		status.value = 'Select a feature first.'
		return
	}

	try {
		loading.value = true
		const feature = FeatureService.buildFeatureFromForm(
			form.value,
			clickedCoord.value,
			selectedFeature.value.getId(),
		)
		await GeoServerService.updateFeature(feature)
		await loadFeatures()
		status.value = 'Updated successfully.'
	} catch (error) {
		status.value = error instanceof Error ? error.message : 'Failed to update.'
	} finally {
		loading.value = false
	}
}

async function handleDelete () {
	if (!selectedFeature.value) {
		status.value = 'Select a feature first.'
		return
	}

	const fid = selectedFeature.value.getId()
	if (!fid) {
		status.value = 'Selected feature has no valid ID.'
		return
	}

	try {
		loading.value = true
		await GeoServerService.deleteFeature(fid)
		await loadFeatures()

		selectedFeature.value = null
		form.value = { ...INITIAL_FORM }
		clickedCoord.value = null
		status.value = 'Deleted successfully.'
	} catch (error) {
		status.value = error instanceof Error ? error.message : 'Failed to delete.'
	} finally {
		loading.value = false
	}
}

// Feature Selection
function selectFeatureFromList (item: FeatureSummary) {
	const feature = vectorSource.getFeatureById(item.id)
	if (!feature) {
		return
	}

	selectedFeature.value = feature
	const { form: formData, coordinates } = FeatureService.featureToForm(feature)
	form.value = formData
	clickedCoord.value = coordinates
	status.value = `Selected ${item.name}`
}

// Map Click Handler
function handleMapClick (event: { coordinates: [number, number]; feature: DispenserFeature | null }) {
	if (event.feature) {
		// Feature selected
		selectedFeature.value = event.feature
		const { form: formData, coordinates } = FeatureService.featureToForm(event.feature)
		form.value = formData
		clickedCoord.value = coordinates
		status.value = `Selected ${event.feature.get('name') ?? event.feature.getId()}`
	} else {
		// Empty space clicked - set coordinates
		clickedCoord.value = event.coordinates
		selectedFeature.value = null
		status.value = `Picked coordinates ${event.coordinates.map((n) => n.toFixed(5)).join(', ')}`
	}
}

// Lifecycle
onMounted(() => {
	// Load initial data
	loadFeatures().catch((err) => {
		status.value = err instanceof Error ? err.message : 'Failed to load features'
	})
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <!-- Skip to main content link for keyboard users -->
    <!-- <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
    >
      Skip to main content
    </a> -->

    <div class="mx-auto max-w-6xl space-y-6">
      <AppHeader />

      <main
        id="main-content"
        class="grid gap-6 lg:grid-cols-[2fr,1fr]"
      >
        <MapView
          :vector-source="vectorSource"
          @map-click="handleMapClick"
        />

        <div class="space-y-6">
          <DispenserForm
            v-model:form="form"
            :clicked-coord="clickedCoord"
            :selected-feature="selectedFeature"
            :loading="loading"
            :status="status"
            @create="handleCreate"
            @update="handleUpdate"
            @delete="handleDelete"
          />

          <DispenserList
            :dispensers="featureList"
            @select="selectFeatureFromList"
            @refresh="() => loadFeatures().catch((err) => (status = err.message))"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Screen reader only - hides content visually but keeps it accessible */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

/* Make sr-only content visible when focused (for skip link) */
.sr-only.focus\:not-sr-only:focus {
	position: static;
	width: auto;
	height: auto;
	padding: inherit;
	margin: inherit;
	overflow: visible;
	clip: auto;
	white-space: normal;
}

/* Enhanced focus styles for better keyboard navigation */
*:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Ensure interactive elements have visible focus indicators */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
	border-radius: 4px;
}
</style>
