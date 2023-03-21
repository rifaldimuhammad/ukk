<script setup>
import { reactive, onMounted, ref } from 'vue';
import { apiClient } from '../api/axios-config';
import ProfileTop from '../components/ProfileTop.vue';
import Icons from '../components/Icons.vue';
import { RouterLink, useRoute } from 'vue-router';
import swal from 'sweetalert';
let route = useRoute();
let toggleWaitAktifitas = ref(false);
let rowAktifitas = reactive({
  items: [],
});
let rowUser = reactive({
  items: [],
});

let getAktifitas = async () => {
  toggleWaitAktifitas.value = true;
  let { data } = await apiClient.get(`/aktifitas`);
  rowAktifitas.items = data.data;
  toggleWaitAktifitas.value = false;
};
let getAktifitasShow = async (id) => {
  toggleWaitAktifitas.value = true;
  let { data } = await apiClient.get(`/aktifitas/${id}`);
  rowAktifitas.items = data.data;
  toggleWaitAktifitas.value = false;
};
let deleteAktifitas = async (id) => {
  swal({
    icon: 'warning',
    title: 'Hapus?',
    text: 'Yakin Menghapus aktifitas ini?',
    dangerMode: true,
    buttons: ['Batal', 'Hapus'],
  }).then(async (willDelete) => {
    if (willDelete) {
      let { data } = await apiClient.delete(`/aktifitas/${id}`);
      if (data.status) {
        swal({
          icon: 'success',
          title: 'Berhasil',
          text: 'Berhasil Menghapus Aktifitas',
        });
        getAktifitas();
      }
    }
  });
};
let getUser = async () => {
  let { data } = await apiClient.get('/user');
  rowUser.items = data.data;
};

onMounted(() => {
  getUser();
  getAktifitas();
});
</script>
<template>
  <ProfileTop />
  <div class="mt-4">
    <div class="d-flex gap-3">
      <RouterLink @click="getAktifitas()" class="btn shadow-sm" :to="{ name: 'dashboardAktifitas' }" :class="route.name == 'dashboardAktifitas' && 'btn-primary'">Semua Aktifitas</RouterLink>
      <RouterLink class="btn shadow-sm" v-for="(item, index) in rowUser.items" :key="index" @click="getAktifitasShow(item.id)" :to="{ name: 'dashboardAktifitasUser', params: { user: item.id } }" active-class="btn-primary"
        >{{ item.name }}
      </RouterLink>
    </div>
    <table class="mt-4 table table-dark">
      <thead class="">
        <tr>
          <th>No</th>
          <th>id user</th>
          <th>Nama User</th>
          <th>Aktifitas</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="toggleWaitAktifitas" class="placeholder-glow w-100">
          <td><div class="spinner-border"></div></td>
          <td><div class="spinner-border"></div></td>
          <td><div class="spinner-border"></div></td>
          <td><div class="spinner-border"></div></td>
          <td><div class="spinner-border"></div></td>
        </tr>
        <tr v-if="toggleWaitAktifitas == false && rowAktifitas.items.length == 0" class="position-relative">
          <div class="alert alert-danger position-absolute start-50 top-0" style="background-color: #ffc5bb; transform: translate(-50%, 50%)">Aktifitas Kosong</div>
        </tr>
        <tr v-if="toggleWaitAktifitas == false && rowAktifitas.items.length != 0" v-for="(item, index) in rowAktifitas.items" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.id_user }}</td>
          <td>{{ item.nama_user }}</td>
          <td>{{ item.nama_aktifitas }}</td>
          <td>
            <button class="btn btn-danger" @click="deleteAktifitas(item.id)">
              <Icons name="trash" fill="#fff" height="16px" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
