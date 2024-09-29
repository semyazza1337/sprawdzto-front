<template>
  <div class="min-h-screen max-h-screen bg-neutral-900">
    <ScoreView v-if="isChecked"/>
    <CheckView v-else />
  </div>
</template>

<script setup>
import CheckView from "./components/CheckView.vue";
import ScoreView from "./components/ScoreView.vue";
import { useStorageStore } from "./stores/storage";

const store = useStorageStore();

const isChecked = computed({
  get: () => store.isChecked,
  set: (value) => store.isChecked = value
});
</script>