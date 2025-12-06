<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { toLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import type { DispenserFeature } from '../types'
import * as MapService from '../services/map.service'

interface MapClickEvent {
	coordinates: [number, number]
	feature: DispenserFeature | null
}

const props = defineProps<{
	vectorSource: VectorSource<DispenserFeature>
}>()

const emit = defineEmits<{
	mapClick: [event: MapClickEvent]
}>()

const mapRef = ref<HTMLElement | null>(null)
const mapInstance = ref<ReturnType<typeof MapService.createMap> | null>(null)
const showWmsLayer = ref(true)
const showWfsLayer = ref(true)

// Toggle layer visibility
function toggleWmsLayer () {
	if (mapInstance.value) {
		mapInstance.value.layers.wms.setVisible(showWmsLayer.value)
	}
}

function toggleWfsLayer () {
	if (mapInstance.value) {
		mapInstance.value.layers.wfs.setVisible(showWfsLayer.value)
	}
}

onMounted(() => {
	if (!mapRef.value) {
		return
	}

	// Initialize map
	mapInstance.value = MapService.createMap(mapRef.value, props.vectorSource)

	// Handle map clicks
	mapInstance.value.map.on('singleclick', (event) => {
		const feature = mapInstance.value?.map.forEachFeatureAtPixel(
			event.pixel,
			(feat) => feat as DispenserFeature,
		)

		const lonLat = toLonLat(event.coordinate)
		emit('mapClick', {
			coordinates: [lonLat[0] ?? 0, lonLat[1] ?? 0],
			feature: feature ?? null,
		})
	})
})

onUnmounted(() => {
	if (mapInstance.value) {
		mapInstance.value.map.setTarget(undefined)
		mapInstance.value = null
	}
})
</script>

<template>
  <div class="space-y-4">
    <section
      aria-labelledby="map-heading"
      class="h-[400px] sm:h-[500px] lg:h-[550px] overflow-hidden rounded-lg sm:rounded-xl border border-slate-200 bg-white shadow"
    >
      <h2
        id="map-heading"
        class="sr-only"
      >
        Interactive Map
      </h2>
      <div
        ref="mapRef"
        role="application"
        aria-label="Water dispenser location map. Click to add or select markers to edit."
        aria-describedby="app-description"
        tabindex="0"
        class="h-full w-full"
      />
    </section>

    <!-- Layer Toggle Controls -->
    <section
      aria-labelledby="layer-controls-heading"
      class="rounded-lg sm:rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow"
    >
      <h2
        id="layer-controls-heading"
        class="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3"
      >
        Layer Controls (See the Difference!)
      </h2>
      <div
        role="group"
        aria-label="Map layer visibility controls"
        class="flex flex-col sm:flex-row gap-3 sm:gap-6"
      >
        <label class="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
          <input
            v-model="showWmsLayer"
            type="checkbox"
            aria-label="Toggle WMS layer (server-rendered image tiles)"
            class="w-5 h-5 cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @change="toggleWmsLayer"
          >
          <div>
            <span class="text-sm font-medium text-slate-700">WMS Layer</span>
            <p
              id="wms-description"
              class="text-xs text-slate-500"
            >
              Server-rendered image tiles
            </p>
          </div>
        </label>

        <label class="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
          <input
            v-model="showWfsLayer"
            type="checkbox"
            aria-label="Toggle WFS layer (interactive vector features)"
            class="w-5 h-5 cursor-pointer accent-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            @change="toggleWfsLayer"
          >
          <div>
            <span class="text-sm font-medium text-slate-700">WFS Layer</span>
            <p
              id="wfs-description"
              class="text-xs text-slate-500"
            >
              Interactive vector features
            </p>
          </div>
        </label>
      </div>
      <div
        role="note"
        aria-label="Layer information"
        class="mt-3 text-xs text-slate-600 bg-blue-50 p-3 rounded"
      >
        <ul
          class="mt-1 ml-4 list-disc"
          aria-label="Layer descriptions"
        >
          <li><strong>WMS</strong>: Semi-transparent, shows all data as pre-rendered image</li>
          <li><strong>WFS</strong>: Crisp markers you can click and edit</li>
        </ul>
      </div>
    </section>
  </div>
</template>
