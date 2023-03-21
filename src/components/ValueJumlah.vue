<script setup>
import { ref, onMounted, reactive, defineEmits } from 'vue';
import swal from 'sweetalert';
import { apiClient } from '../api/axios-config';
let toggleValueJumlah = ref(false);

const emit = defineEmits(['update-value']);
let props = defineProps({
  defaultValue: String,
  form: JSON,
});
let formUpdateValue = reactive({
  jumlah_menu: 1,
  harga_menu: props.form.harga_menu,
});
let updateForm = async () => {
  if (formUpdateValue.jumlah_menu <= 0) {
    swal({
      icon: 'warning',
      title: `Menu Tidak Boleh Kosong`,
    });
  } else {
    let { data } = await apiClient.post(`/keranjang/updateJumlah/${props.form.id}?_method=PUT`, formUpdateValue);
    if (data.status) {
      swal({
        icon: 'success',
        title: `Jumlah Menu Di Update`,
      });
      toggleValueJumlah.value = false;
      emit('update-value');
    }
  }
};
</script>
<template>
  <div v-if="toggleValueJumlah" class="position-relative">
    <input class="btn bg-dark text-white value-jumlah-comp" type="number" min="0" v-model="formUpdateValue.jumlah_menu" style="width: 100px" />
    <button @click="toggleValueJumlah = false" class="btn bg-white shadow-lg text-dark position-absolute bottom-0 fw-bold start-0 value-jumlah-comp-can">cancel</button>
    <button @click="updateForm" class="btn bg-white shadow-lg text-dark position-absolute bottom-0 fw-bold end-0 value-jumlah-comp-sv">save</button>
  </div>
  <p v-else @click="toggleValueJumlah = true" class="value-jumlah-comp">{{ defaultValue }}</p>
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
