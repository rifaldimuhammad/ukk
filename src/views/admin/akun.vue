<script setup>
import { advancePositionWithMutation } from '@vue/compiler-core';
import ProfileTop from '../../components/ProfileTop.vue';

import { reactive, onMounted, ref } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';
let togglePassword = ref(false);
let rowUser = reactive({
  items: [],
});

let updateUser = reactive({
  name: '',
  email: '',
  level: '',
  cover: '',
  password: '',
});
const getUser = async () => {
  const { data } = await apiClient.get(`/user/1`);
  rowUser.items = data.data;
  (updateUser.name = rowUser.items.name), (updateUser.email = rowUser.items.email), (updateUser.level = rowUser.items.level), (updateUser.cover = rowUser.items.cover), (updateUser.password = rowUser.items.password);
  urlImg.value = urlApi + rowUser.items.cover;
};
let onCoverChangeUser = (e) => {
  let path = (updateUser.cover = e.target.files[0]);
  getImg(e);
};

let urlImg = ref('');
let getImg = (e) => {
  const files = e.target.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener('load', function () {
      urlImg.value = this.result;
    });
  }
};
onMounted(() => {
  getUser();
});
</script>
<template>
  <ProfileTop />
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account Settings /</span> Account</h4>
    <div class="row">
      <div class="col-md-12">
        <ul class="nav nav-pills flex-column flex-md-row mb-3">
          <li class="nav-item">
            <button class="nav-link active"><i class="bx bx-user me-1"></i> Account</button>
          </li>
        </ul>
        <form class="card mb-4">
          <h5 class="card-header">Profile Details</h5>
          <!-- Account -->
          <div class="card-body">
            <div class="d-flex align-items-start align-items-sm-center gap-4">
              <img :src="urlImg" :alt="rowUser.items.cover" class="d-block rounded" height="100" width="100" id="uploadedAvatar" />
              <div class="button-wrapper">
                <label for="upload" class="btn btn-primary me-2 mb-4" tabindex="0">
                  <span class="d-none d-sm-block">Upload new photo</span>
                  <i class="bx bx-upload d-block d-sm-none"></i>
                  <input type="file" id="upload" class="account-file-input" hidden="" v-on:change="onCoverChangeUser" accept="image/png, image/jpeg" />
                </label>
                <button type="reset" class="btn btn-outline-secondary account-image-reset mb-4">
                  <i class="bx bx-reset d-block d-sm-none"></i>
                  <span class="d-none d-sm-block">Reset</span>
                </button>

                <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>
          </div>
          <hr class="my-0" />
          <div class="card-body">
            <form id="formAccountSettings" method="POST" onsubmit="return false">
              <div class="row">
                <div class="mb-3">
                  <label for="firstName" class="form-label">Nama User</label>
                  <input class="form-control" v-model="updateUser.name" type="text" id="firstName" name="firstName" />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input class="form-control" v-model="updateUser.email" type="text" id="email" name="email" placeholder="john.doe@example.com" />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">password</label>
                  <div class="form-control d-flex align-items-center">
                    <input class="border-0 w-100" style="outline: none" v-model="updateUser.password" :type="togglePassword ? 'text' : 'password'" id="email" name="email" placeholder="john.doe@example.com" />
                    <h5 class="cursor-pointer" @click="togglePassword = !togglePassword">{{ togglePassword ? 'hide' : 'show' }}</h5>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-primary me-2">Save changes</button>
                <button type="reset" class="btn btn-outline-secondary">Cancel</button>
              </div>
            </form>
          </div>
          <!-- /Account -->
        </form>
        <div class="card">
          <h5 class="card-header">Delete Account</h5>
          <div class="card-body">
            <div class="mb-3 col-12 mb-0">
              <div class="alert alert-warning">
                <h6 class="alert-heading fw-bold mb-1">Are you sure you want to delete your account?</h6>
              </div>
            </div>
            <form id="formAccountDeactivation" onsubmit="return false">
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" name="accountActivation" id="accountActivation" />
                <label class="form-check-label" for="accountActivation">I confirm my account deactivation</label>
              </div>
              <button type="submit" class="btn btn-danger deactivate-account">Delete User</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
