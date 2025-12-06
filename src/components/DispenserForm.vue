<script setup lang="ts">
import type { DispenserForm } from '../types'

const props = defineProps<{
	form: DispenserForm
	clickedCoord: [number, number] | null
	selectedFeature: unknown | null
	loading: boolean
	status: string | null
}>()

const emit = defineEmits<{
	'update:form': [form: DispenserForm]
	create: []
	update: []
	delete: []
}>()

function updateForm (updates: Partial<DispenserForm>) {
	emit('update:form', { ...props.form, ...updates })
}

function handleCreate () {
	emit('create')
}

function handleUpdate () {
	emit('update')
}

function handleDelete () {
	emit('delete')
}
</script>

<template>
  <section
    aria-labelledby="form-heading"
    class="rounded-lg sm:rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow"
  >
    <h2
      id="form-heading"
      class="text-lg sm:text-xl font-semibold text-slate-900"
    >
      Dispenser form
    </h2>
    <form
      aria-label="Water dispenser information form"
      class="mt-4 space-y-3"
      @submit.prevent="handleCreate"
    >
      <div>
        <label
          for="dispenser-name"
          class="block text-sm font-medium text-slate-600"
        >
          Name <span
            aria-label="required"
            class="text-red-600"
          >*</span>
        </label>
        <input
          id="dispenser-name"
          :value="form.name"
          type="text"
          required
          aria-required="true"
          aria-describedby="name-hint"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Building A Entrance"
          @input="updateForm({ name: ($event.target as HTMLInputElement).value })"
        >
        <p
          id="name-hint"
          class="mt-1 text-xs text-slate-500 sr-only"
        >
          Enter a descriptive name for the water dispenser
        </p>
      </div>

      <div>
        <label class="flex items-center gap-2 text-sm font-medium text-slate-600">
          <input
            id="is-indoor"
            :checked="form.isIndoor"
            type="checkbox"
            aria-describedby="indoor-hint"
            class="w-4 h-4 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @change="updateForm({ isIndoor: ($event.target as HTMLInputElement).checked })"
          >
          Indoor location
        </label>
        <p
          id="indoor-hint"
          class="mt-1 text-xs text-slate-500 sr-only"
        >
          Check if the dispenser is located indoors
        </p>
      </div>

      <div v-if="form.isIndoor">
        <label
          for="floor-number"
          class="block text-sm font-medium text-slate-600"
        >
          Floor
        </label>
        <input
          id="floor-number"
          :value="form.floor"
          type="text"
          aria-describedby="floor-hint"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 2, Ground, Basement"
          @input="updateForm({ floor: ($event.target as HTMLInputElement).value })"
        >
        <p
          id="floor-hint"
          class="mt-1 text-xs text-slate-500 sr-only"
        >
          Enter the floor number or name
        </p>
      </div>

      <div>
        <label
          for="water-types"
          class="block text-sm font-medium text-slate-600"
        >
          Water types (comma separated)
        </label>
        <input
          id="water-types"
          :value="form.waterTypes"
          type="text"
          aria-describedby="water-types-hint"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., still, sparkling, hot"
          @input="updateForm({ waterTypes: ($event.target as HTMLInputElement).value })"
        >
        <p
          id="water-types-hint"
          class="mt-1 text-xs text-slate-500"
        >
          Enter water types separated by commas
        </p>
      </div>
      <div
        aria-live="polite"
        aria-atomic="true"
        class="text-sm text-slate-600"
      >
        <span class="font-medium">Coordinate:</span>
        <span
          v-if="clickedCoord"
          class="font-semibold"
          aria-label="Selected coordinates"
        >
          {{ clickedCoord[0].toFixed(5) }}, {{ clickedCoord[1].toFixed(5) }}
        </span>
        <span
          v-else
          class="italic"
        >click the map</span>
      </div>

      <div
        role="group"
        aria-label="Dispenser actions"
        class="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
      >
        <button
          type="submit"
          aria-label="Add new water dispenser"
          :disabled="loading || !clickedCoord"
          :aria-busy="loading"
          class="w-full sm:w-auto rounded-md bg-blue-600 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 transition"
        >
          <span v-if="loading">Adding...</span>
          <span v-else>Add dispenser</span>
        </button>
        <button
          type="button"
          aria-label="Update selected water dispenser"
          :disabled="loading || !selectedFeature"
          :aria-busy="loading"
          class="w-full sm:w-auto rounded-md bg-amber-500 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 hover:bg-amber-600 transition"
          @click="handleUpdate"
        >
          <span v-if="loading">Updating...</span>
          <span v-else>Update selected</span>
        </button>
        <button
          type="button"
          aria-label="Delete selected water dispenser"
          :disabled="loading || !selectedFeature"
          :aria-busy="loading"
          class="w-full sm:w-auto rounded-md bg-rose-600 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 hover:bg-rose-700 transition"
          @click="handleDelete"
        >
          <span v-if="loading">Deleting...</span>
          <span v-else>Delete selected</span>
        </button>
      </div>
    </form>

    <!-- Live region for status messages (screen reader announcement) -->
    <div
      v-if="status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="mt-3 text-sm text-slate-600 p-2 bg-blue-50 rounded"
    >
      {{ status }}
    </div>
  </section>
</template>
