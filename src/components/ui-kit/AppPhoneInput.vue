<script setup lang="ts">
import { formatPhone } from '../../composables/formatPhone'
import AppInput from './AppInput.vue'

const model = defineModel<string>({ required: true })
</script>

<template>
  <AppInput
    v-model="model"
    :format="formatPhone"
    type="tel"
    autocomplete="tel"
    inputmode="tel"
    placeholder="+7 (999) 999-99-99"
  />
</template>
