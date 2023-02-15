<script setup>
import { onMounted, reactive } from 'vue';
import { apiClient } from '../api/axios-config';

let props = defineProps({
  date: String,
  time: String,
  noMeja: String,
  waktu: String,
});
let timer = reactive({
  value: '',
});
var countDownDate = new Date(`${props.date} ${props.time}`).getTime() + parseInt(`${props.waktu}0000`);
let x = setInterval(function () {
  console.log(props.waktu);
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  timer.value = hours + 'h ' + minutes + 'm ' + seconds + 's ';
  if (distance < 0) {
    clearInterval(x);
    apiClient.post(`/meja/${props.noMeja}?_method=PUT`, props.noMeja);
    timer.value = 'wees Moleee';
  }
}, 1000);
</script>
<template>
  <button class="btn">
    <span class="badge bg-label-warning me-1">Timer : {{ timer.value }}</span>
  </button>
</template>
<style lang="scss">
tr,
td {
  text-align: center;
}
</style>
