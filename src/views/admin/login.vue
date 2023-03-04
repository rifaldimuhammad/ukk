<script setup>
import '/src/assets/admin/vendor/css/core.css';
import '/src/assets/admin/vendor/fonts/boxicons.css';
import '/src/assets/admin/vendor/css/theme-default.css';
import '/src/assets/admin/css/demo.css';
import '/src/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import '/src/assets/admin/vendor/js/bootstrap.js';
import { useRouter, useRoute } from 'vue-router';
import { apiClient } from '../../api/axios-config';
import { reactive, ref } from 'vue';
import swal from 'sweetalert';
import Icons from '../../components/Icons.vue';

let toggleShowPass = ref(false);
let toggleWaitDoLogin = ref(false);
let router = useRouter();
let route = useRoute();
const formData = reactive({
  email: '',
  password: '',
});

const doLogin = async () => {
  toggleWaitDoLogin.value = true;
  const { data } = await apiClient.post('/login', formData);
  if (data.success) {
    localStorage.setItem('user_data', JSON.stringify(data.data));
    localStorage.setItem('token', data.token);
    router.push({ name: 'dashboard' });
    toggleWaitDoLogin.value = false;
  } else {
    swal({
      icon: 'warning',
      title: 'Email Atau pasword salah',
    });
    toggleWaitDoLogin.value = false;
  }
};

let i = 0;
let arrBg = reactive(['/src/assets/img/heroHome1.jpg', '/src/assets/img/burger.png', 'http://127.0.0.1:8000/cover/20230221094012software-engineer.png', 'http://127.0.0.1:8000/cover/20230221094711cashier.png']);
let bgLogin = ref('/src/assets/img/heroHome1.jpg');
setInterval(async () => {
  bgLogin.value = arrBg[i++];
  if (i == arrBg.length) {
    i = 0;
  }
}, 1000);
</script>
<template>
  <div class="container-xxl">
    <div class="position-fixed top-0 w-100 h-100 bg-login" :style="{ minHeight: '100vh', background: `url(${bgLogin})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }"></div>
    <div class="authentication-wrapper authentication-basic container-p-y d-flex justify-content-center align-items-center" style="min-height: 100vh">
      <div class="authentication-inner">
        <!-- Register -->
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center">
              <img src="/src/assets/img/burger.png" alt="/src/assets/img/burger.png" height="56" />
            </div>
            <!-- /Logo -->
            <h4 class="mb-2">Welcome to Dashboard! 👋</h4>
            <p class="mb-4">Please sign-in to your account and start the adventure</p>

            <form id="formAuthentication" class="mb-3" @submit.prevent="doLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email User</label>
                <input type="email" class="form-control" required id="email" name="email-username" placeholder="Enter your email or username" autofocus="" v-model="formData.email" />
              </div>
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                </div>
                <div class="input-group input-group-merge">
                  <input v-if="toggleShowPass" type="text" required id="password" class="form-control" name="password" v-model="formData.password" />
                  <input v-else type="password" id="password" required class="form-control" name="password" v-model="formData.password" />
                  <span v-if="toggleShowPass" @click="toggleShowPass = !toggleShowPass" class="input-group-text cursor-pointer"><i class="bx bx-hide"></i></span>
                  <span v-else @click="toggleShowPass = !toggleShowPass" class="input-group-text cursor-pointer">
                    <Icons name="eye" height="14px" fill="#566a7f" />
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember-me" />
                  <label class="form-check-label" for="remember-me"> Remember Me </label>
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
            </form>
          </div>
        </div>
        <!-- /Register -->
      </div>
    </div>
  </div>
</template>
