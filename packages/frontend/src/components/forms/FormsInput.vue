<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-gray-900 text-sm font-medium p-2 border disabled:bg-gray-200 disabled:hover:cursor-not-allowed"
      :required="required"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: '',
  },
  label: {
    type: String,
    default: 'Label',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 10),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
