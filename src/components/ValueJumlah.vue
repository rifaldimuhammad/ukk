<script setup>
import { ref } from 'vue';
defineProps({
  value: String,
  index: Number,
});

let toggleValueJumlah = ref(false);
</script>
<template>
  <input class="btn btn-outline-dark value-jumlah-comp" v-if="toggleValueJumlah" type="number" :value="value" style="width: 100px" />
  <p v-else @click="toggleValueJumlah = true" class="value-jumlah-comp">{{ value }}</p>
</template>
<style lang="scss"></style>
