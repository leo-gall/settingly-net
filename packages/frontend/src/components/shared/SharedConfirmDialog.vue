<template>
  <SharedDialog :open="open" :title="title" @close="onCancel">
    <p class="my-4">
      {{ message }}
    </p>

    <div class="flex flex-row justify-end gap-2 mt-2">
      <button class="button-ghost" @click="onCancel">Cancel</button>
      <button class="button" @click="onConfirm">Confirm</button>
    </div>
  </SharedDialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import SharedDialog from './SharedDialog.vue'

defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>
