<script setup>
import { urlApi } from '../api/axios-config';
defineProps({
  name: String,
  estimasi: String,
  price: String,
  img: String,
});
</script>
<template>
  <div class="menu-wrapper">
    <div class="menu-wrapper-img">
      <div class="menu-wrapper-img-src asset-bg" :style="{ background: `url(${urlApi + img})` }"></div>
    </div>
    <div class="menu-wrapper-info">
      <div class="menu-wrapper-info-title">Food Order~ <br />{{ name }}</div>
      <div class="menu-wrapper-info-price">Rp {{ price }}</div>
    </div>
  </div>
</template>
<style lang="scss">
.menu {
  cursor: pointer;
  &-wrapper {
    padding: 2rem;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    border-radius: 1rem;
    background-color: white;
    box-shadow: 0 60px 44px -49px rgba(grey, 0.2);

    &-img {
      width: 100%;
      height: 30rem;
      border-radius: 3rem;
      padding: 2rem;
      &-src {
        height: 100%;
        width: 100%;
        transition: all 0.3s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    &-info {
      height: 50%;
      display: flex;
      gap: 2rem;
      justify-content: space-between;
      align-items: center;
      &-title {
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-black);
        text-transform: capitalize;
        line-height: 1.2;
      }
      &-price {
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-black);
        white-space: nowrap;
      }
    }
  }
}
</style>
