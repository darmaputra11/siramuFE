<!-- src/components/FilterBulan.vue -->
<template>
  <v-text-field
    v-model="selectedMonth"
    label="Filter Bulan"
    type="month"
    outlined
    dense
    clearable
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const selectedMonth = ref(props.modelValue || '')

// Update ke parent saat berubah
watch(selectedMonth, (val) => {
  emit('update:modelValue', val)
})
</script>
