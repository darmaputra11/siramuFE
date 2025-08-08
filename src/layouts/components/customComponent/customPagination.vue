<template>
  <div class="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
    <!-- Items per page -->
    <div class="flex items-center gap-2">
      <span class="text-sm">Items per page:</span>
      <input
        type="number"
        v-model.number="localItemsPerPage"
        @change="updateItemsPerPage"
        min="1"
        class="w-16 px-2 py-1 border rounded text-sm"
      />
    </div>

    <!-- Info dan tombol -->
    <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
      <!-- Range info -->
      <div class="text-sm">
        {{ startIndex }}–{{ endIndex }} of {{ totalItems }}
      </div>

      <!-- Pagination Buttons -->
      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 border rounded text-sm"
          :disabled="modelValue === 1"
          @click="goToPage(1)"
        >
          |&lt;
        </button>
        <button
          class="px-2 py-1 border rounded text-sm"
          :disabled="modelValue === 1"
          @click="goToPage(modelValue - 1)"
        >
          &lt;
        </button>
        <button
          class="px-2 py-1 border rounded text-sm"
          :disabled="modelValue === totalPages"
          @click="goToPage(modelValue + 1)"
        >
          &gt;
        </button>
        <button
          class="px-2 py-1 border rounded text-sm"
          :disabled="modelValue === totalPages"
          @click="goToPage(totalPages)"
        >
          &gt;|
        </button>
      </div>
    </div>
  </div>
</template>




<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
)

const localItemsPerPage = ref(props.itemsPerPage)

watch(
  () => props.itemsPerPage,
  (newVal) => {
    localItemsPerPage.value = newVal
  }
)

const startIndex = computed(() =>
  props.totalItems === 0 ? 0 : (props.modelValue - 1) * props.itemsPerPage + 1
)

const endIndex = computed(() =>
  Math.min(props.modelValue * props.itemsPerPage, props.totalItems)
)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:modelValue', page)
  }
}

const updateItemsPerPage = () => {
  emit('update:itemsPerPage', localItemsPerPage.value)
  emit('update:modelValue', 1)
}
</script>
