<script setup>
import { reactive, onMounted } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';
import ProfileTop from '../../components/ProfileTop.vue';

let rowUser = reactive({
  items: [],
});
const getUser = async () => {
  const { data } = await apiClient.get('/user');
  rowUser.items = data.data;
};
const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/user/${id}`);
  getUser();
};
onMounted(() => {
  getUser();
});
</script>
<template>
  <ProfileTop />
  <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account Settings /</span> Account</h4>
  <div class="card">
    <h5 class="card-header">Light Table head</h5>
    <div class="table-responsive text-nowrap">
      <table class="table">
        <thead class="table-light">
          <tr>
            <th>Id</th>
            <th>Nama User</th>
            <th>Email User</th>
            <th>Level</th>
            <th>Pasword</th>
            <th>cover</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody class="table-border-bottom-0">
          <tr v-for="(item, index) in rowUser.items" :key="index">
            <td>
              <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{{ item.id }}</strong>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>
              <p v-if="item.level != null">
                {{ item.level }}
              </p>
              <p v-else class="text-danger">Belum Di Atur Oleh Admin</p>
            </td>
            <td>*****</td>
            <td>
              <img v-if="item.cover == null" src="/src/assets/img/emptyImage.svg" class="img-fluid" style="width: 50px; padding: 5px" />
              <img v-else :src="urlApi + item.cover" class="img-fluid" :alt="urlApi + item.cover" style="width: 50px; padding: 5px" />
            </td>
            <td><span class="badge bg-label-primary me-1">Active</span></td>
            <td>
              <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                  <button class="dropdown-item"><i class="bx bx-edit-alt me-1"></i> Edit</button>
                  <button class="dropdown-item" @click="deleteUser(item.id)"><i class="bx bx-trash me-1"></i> Delete</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
