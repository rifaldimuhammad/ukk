<script setup>
import { reactive, ref, onMounted } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';
import ProfileTop from '../../components/ProfileTop.vue';
import swal from 'sweetalert';
import Icons from '../../components/Icons.vue';
let toggleModalAddUser = ref(false);
let toggleLoadUser = ref(false);
let togglePass = ref(true);
let rowUser = reactive({
  items: [],
});

let user = JSON.parse(localStorage.getItem('user_data'));

let formAddUser = reactive({
  id_user: '',
  name: '',
  email: '',
  password: '',
  level: '',
  cover: '',
});
if (user !== null) {
  formAddUser.id_user = user.id;
}
let onCoverAddUserChange = (e) => {
  formAddUser.cover = e.target.files[0];
  getImg(e, urlImg);
};
const getUser = async () => {
  toggleLoadUser.value = true;
  const { data } = await apiClient.get('/user');
  rowUser.items = data.data;
  setTimeout(() => {
    toggleLoadUser.value = false;
  }, 500);
};
const addUser = async () => {
  const fields = new FormData();
  fields.append('id_user', formAddUser.id_user);
  fields.append('name', formAddUser.name);
  fields.append('email', formAddUser.email);
  fields.append('password', formAddUser.password);
  fields.append('level', formAddUser.level);
  fields.append('cover', formAddUser.cover);
  if (formAddUser.cover == null || formAddUser.cover == '') {
    swal({
      icon: 'warning',
      title: 'Gambar User Wajib Di isi',
    });
  } else {
    let { data } = await apiClient.post('/user', fields);
    if (data.status) {
      swal({
        icon: 'success',
        title: `User ${formAddUser.name} berhasil di tambahkan`,
      });
      toggleModalAddUser.value = false;
      getUser();
    } else {
      swal({
        icon: 'warning',
        title: `Email Sudah Terdaftar`,
      });
    }
  }
};
const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/user/${id}`);
  swal({
    icon: 'success',
    title: 'User Berhasil Di hapus',
    dangerMode: true,
  });
  getUser();
};

let urlImg = ref('/src/assets/img/emptyImage.svg');
let getImg = (e, urlVar) => {
  const files = e.target.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener('load', function () {
      urlVar.value = this.result;
    });
  }
};
onMounted(() => {
  getUser();
});
</script>
<template>
  <ProfileTop />
  <div class="d-flex justify-content-between my-4 mb-0 pm-0">
    <h4 class="fw-bold mb-4"><span class="text-muted fw-light">Account Settings /</span> Account</h4>
    <button @click="toggleModalAddUser = true" class="mb-4 btn btn-primary">Tambah User</button>
  </div>
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
          <tr v-if="toggleLoadUser" class="position-relative">
            <td style="position: absolute; top: 50%; left: 50%; transform: translate(-50%)">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading... </span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(item, index) in rowUser.items" :key="index">
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
                  <button class="dropdown-item" @click="deleteUser(item.id)"><i class="bx bx-trash me-1"></i> Delete</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="toggleModalAddUser" class="modal fade show" style="display: block; background-color: var(--bs-gray-dark)">
    <div class="modal-dialog modal-dialog-centered">
      <form @submit.prevent="addUser" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalCenterTitle">Tambahkan User</h5>
          <button @click="toggleModalAddUser = false" type="button" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <div class="d-flex align-items-start align-items-sm-center gap-4">
              <img :src="urlImg" alt="user-avatar" class="d-block rounded" height="100" width="100" />
              <div class="button-wrapper">
                <label for="uploadUpdate" class="btn btn-primary me-2 mb-4" tabindex="0"
                  ><span class="d-none d-sm-block">Upload photo</span><i class="bx bx-upload d-block d-sm-none"></i
                  ><input type="file" v-on:change="onCoverAddUserChange" id="uploadUpdate" name="cover" class="account-file-input" hidden="" accept="image/png, image/jpeg"
                /></label>
                <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col mb-3"><label class="form-label">Nama User</label><input v-model="formAddUser.name" required="" type="text" name="name" class="form-control" placeholder="Nama Menu" /></div>
          </div>
          <div class="row g-2">
            <div class="col mb-0"><label class="form-label">Email User</label><input v-model="formAddUser.email" required="" type="email" name="email" class="form-control" /></div>
            <div class="col mb-0">
              <label class="form-label">Level User</label
              ><select v-model="formAddUser.level" class="form-select" name="level" required="">
                <option selected value="">-- Pilih Level --</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="kasir">Kasir</option>
              </select>
            </div>
          </div>
          <div class="col mb-3">
            <label class="form-label d-flex">password </label>
            <div class="form-control d-flex justify-content-between align-items-center">
              <input v-model="formAddUser.password" class="border-0 outline-0 w-100" required="" :type="togglePass ? 'password' : 'text'" name="password" />
              <div @click="togglePass = !togglePass" class="d-flex cursor-pointer">
                <Icons v-if="togglePass" name="eye" height="16px" fill="#697a8d" />
                <i v-else class="bx bx-hide"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer"><button type="reset" class="btn btn-outline-secondary" data-bs-dismiss="modal">Reset</button><button type="submit" class="btn btn-primary">Save changes</button></div>
      </form>
    </div>
  </div>
</template>
