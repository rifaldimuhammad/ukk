<script setup>
import { ref } from 'vue';
defineProps({
  value: String,
  index: Number,
});

let toggleValueJumlah = ref(false);
</script>
<template>
  <div v-if="toggleValueJumlah" class="position-relative">
    <input class="btn bg-dark text-white value-jumlah-comp" type="number" :value="value" style="width: 100px" />
    <button class="btn bg-white shadow-lg text-dark position-absolute bottom-0 fw-bold start-0 value-jumlah-comp-can">cancel</button>
    <button class="btn bg-white shadow-lg text-dark position-absolute bottom-0 fw-bold end-0 value-jumlah-comp-sv">save</button>
  </div>
  <p v-else @click="toggleValueJumlah = true" class="value-jumlah-comp">{{ value }}</p>
</template>
<style lang="scss">
.value-jumlah-comp {
  &-can {
    transition: all 0.3s;
    transform: translate(-60%, 20%);
    &:hover {
      transform: translate(-60%, 10%);
    }
  }
  &-sv {
    transform: translate(50%, 20%);
    &:hover {
      transform: translate(50%, 10%);
    }
  }
}
</style>
