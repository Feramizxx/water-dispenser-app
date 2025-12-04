<script setup lang="ts">
import type { FeatureSummary } from '../types'

defineProps<{
	dispensers: FeatureSummary[]
}>()

const emit = defineEmits<{
	select: [dispenser: FeatureSummary]
	refresh: []
}>()

function handleSelect (dispenser: FeatureSummary) {
	emit('select', dispenser)
}

function handleRefresh () {
	emit('refresh')
}
</script>

<template>
  <section
    aria-labelledby="dispensers-list-heading"
    class="rounded-lg sm:rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow"
  >
    <div class="flex items-center justify-between">
      <h2
        id="dispensers-list-heading"
        class="text-lg sm:text-xl font-semibold text-slate-900"
      >
        Existing dispensers
        <span
          class="ml-2 text-sm font-normal text-slate-500"
          aria-label="Total dispensers"
        >({{ dispensers.length }})</span>
      </h2>
      <button
        type="button"
        aria-label="Refresh dispenser list"
        class="min-h-[32px] text-sm font-medium text-blue-600 hover:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-1.5"
        @click="handleRefresh"
      >
        Refresh
      </button>
    </div>
    <div
      v-if="dispensers.length === 0"
      class="mt-3 sm:mt-4 max-h-48 sm:max-h-60 space-y-2 sm:space-y-3 overflow-y-auto text-xs sm:text-sm"
    >
      <p
        role="status"
        class="text-slate-500 text-center py-4"
      >
        No dispensers yet. Click on the map to add one.
      </p>
    </div>
    <ul
      v-else
      aria-label="List of water dispensers"
      class="mt-3 sm:mt-4 max-h-48 sm:max-h-60 space-y-2 sm:space-y-3 overflow-y-auto text-xs sm:text-sm list-none"
    >
      <li
        v-for="item in dispensers"
        :key="item.id"
      >
        <button
          type="button"
          :aria-label="`Select ${item.name}, ${item.isIndoor ? 'Indoor, floor ' + (item.floor || 'unknown') : 'Outdoor'}, ${item.waterTypes || 'types unknown'}`"
          class="w-full min-h-[44px] rounded-lg border border-slate-200 p-3 sm:p-4 text-left hover:border-blue-300 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          @click="handleSelect(item)"
        >
          <p class="font-semibold text-slate-800">
            {{ item.name }}
          </p>
          <p class="text-slate-600">
            <span :aria-label="item.isIndoor ? 'Indoor location' : 'Outdoor location'">
              {{ item.isIndoor ? `Indoor · floor ${item.floor || '?'}` : 'Outdoor' }}
            </span>
            · {{ item.waterTypes || 'types unknown' }}
          </p>
        </button>
      </li>
    </ul>
  </section>
</template>
