<script setup>
import '/src/assets/admin/vendor/css/core.css';
import '/src/assets/admin/vendor/fonts/boxicons.css';
import '/src/assets/admin/vendor/css/theme-default.css';
import '/src/assets/admin/css/demo.css';
import '/src/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import '/src/assets/admin/vendor/js/bootstrap.js';
import { useRouter, useRoute } from 'vue-router';
import { apiClient } from '../api/axios-config';
import { reactive, ref } from 'vue';
import swal from 'sweetalert';
import Icons from '../components/Icons.vue';


let toggleShowPass = ref(false);
let toggleWaitDoLogin = ref(false);
let toLogin = ref(true);
let toRegister = ref(false);
let router = useRouter();
let route = useRoute();
const formData = reactive({
  email: '',
  password: '',
});

let formRegister = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

let register = async () => {
  const field = new FormData();
  field.append('name', formRegister.name);
  field.append('email', formRegister.email);
  field.append('password', formRegister.password);
  let { data } = await apiClient.post('/register', field);
  if (data.status) {
    swal({
      icon: 'success',
      title: 'Berhasil',
      text: 'Berhasil Register , SIlahkan Login',
    });
    toLogin.value = true;
    toRegister.value = false;
  } else {
    swal({
      icon: 'warning',
      title: 'Perhatikan',
      text: 'Email Sudah Terdaftar',
    });
  }
};

const doLogin = async () => {
  toggleWaitDoLogin.value = true;
  const { data } = await apiClient.post('/login', formData);
  if (data.success) {
    localStorage.setItem('user_data', JSON.stringify(data.data));
    localStorage.setItem('token', data.token);
    router.push({ name: 'dashboard' });
    toggleWaitDoLogin.value = false;
  } else {

    if(data.statusUser == false){
      swal({
      icon: 'warning',
      title: 'User di nonaktifkan',
    });
    toggleWaitDoLogin.value = false;
    }else{

      swal({
        icon: 'warning',
        title: 'Email Atau pasword salah',
      });
      toggleWaitDoLogin.value = false;
    }
  }
};

</script>
<template>
  <div class="">
    <div class="position-fixed top-0 w-100 h-100 bg-login" :style="{ minHeight: '100vh', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }"></div>
    <div class="authentication-wrapper authentication-basic d-flex justify-content-center align-items-center gap-5" style="min-height: 100vh">
      <div @click="router.push({name:'landing'})" class="position-fixed top-0 start-0 m-5 d-flex gap-2 align-items-center cursor-pointer" style="z-index: 1;">
        <Icons name="burger" fill="#fff" height="36" />
        <h6 class="m-0 text-white font-landing">Kasir Restaurant</h6>
      </div>
      <div class="w-100 h-100 bg-asset" style="background: url('/src/assets/img/login.jpg'); min-height: 100vh;"></div>
      <!-- Login -->
      <div class="authentication-inner w-100 d-flex justify-content-center" >
        <div v-if="toLogin" class="">
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-2">
              <img src="/src/assets/img/burger.png" alt="/src/assets/img/burger.png" height="56" />
            </div>
            <!-- /Logo -->
            <h4 class="mb-2">Welcome to Restourant 👋</h4>
            <p class="mb-4">Please sign-in to your account and start the adventure</p>

            <form id="formAuthentication" class="mb-3" @submit.prevent="doLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email User</label>
                <input type="email" class="form-control" required id="email"  placeholder="Enter your email or username" autofocus="" v-model="formData.email" />
              </div>
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                </div>
                <div class="input-group input-group-merge">
                  <input v-if="toggleShowPass" type="text" required  class="form-control"  v-model="formData.password" />
                  <input v-else type="password"  required class="form-control"  v-model="formData.password" />

                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember-me" />
                  <label class="form-check-label" @click="toggleShowPass = !toggleShowPass" for="remember-me"> Show Password </label>
                </div>
              </div>
              <div class="mb-3">
                <button v-if="toggleWaitDoLogin" class="btn btn-primary d-flex justify-content-center w-100" type="button">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
                <button v-else class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
              </div>
              <p class="text-center d-flex align-items-center">
                <span>New on our platform?</span>
                <div @click="toLogin = false, toRegister = true" class="text-primary cursor-pointer">
                  <span>Create an account</span>
                </div>
              </p>
            </form>
          </div>
        </div>
        <!-- /Register -->
        <div v-if="toRegister" class="" >
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center">
              <img src="/src/assets/img/burger.png" alt="/src/assets/img/burger.png" height="56" />
            </div>
            <!-- /Logo -->
            <h4 class="mb-2">Register👋</h4>
            <p class="mb-4">Daftarkan Anda</p>
            <form id="formAuthentication" class="mb-3" @submit.prevent="register">
              <div class="mb-3">
                <label for="email" class="form-label">Nama User</label>
                <input type="text" class="form-control" required   placeholder="Nama" autofocus="" v-model="formRegister.name" />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email User</label>
                <input type="email" class="form-control" required  placeholder="Enter your email or username" autofocus="" v-model="formRegister.email" />
              </div>
              <div class="d-flex gap-3">

              
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                </div>
                <div class="input-group input-group-merge">
                  <input v-if="toggleShowPass" type="text" required  class="form-control"  v-model="formRegister.password" />
                  <input v-else type="password"  required class="form-control"  v-model="formRegister.password" />
                </div>
              </div>
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password Confirm</label>
                </div>
                <div class="input-group input-group-merge">
                  <input v-if="toggleShowPass" type="text" required  :class="formRegister.password != formRegister.passwordConfirm ? 'border-danger' : 'border-success'" class="form-control"  v-model="formRegister.passwordConfirm" />
                  <input v-else type="password"  required class="form-control"  :class="formRegister.password != formRegister.passwordConfirm ? 'border-danger' : 'border-success'" v-model="formRegister.passwordConfirm" />
                </div>
                <p v-if="formRegister.password != formRegister.passwordConfirm " class="text-danger m-0">Password Harus sama</p>
              </div>
            </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember-me" />
                  <label class="form-check-label" @click="toggleShowPass = !toggleShowPass" for="remember-me"> Show Password </label>
                </div>
              </div>
              <div class="mb-3">
                <button v-if="toggleWaitDoLogin" class="btn btn-primary d-flex justify-content-center w-100" type="button">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
                <button v-else class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
              </div>
              <p class="text-center d-flex align-items-center gap-2 m-0">
                <span>Sudah Punya akun?</span>
                <div @click="toLogin = true, toRegister = false" class="text-primary cursor-pointer">
                  <span>Login</span>
                </div>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
