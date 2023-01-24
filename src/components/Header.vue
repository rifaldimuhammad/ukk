<script setup>
import Icons from './Icons.vue';
import { useRouter } from 'vue-router';
let router = useRouter();

defineProps({
  totalCart: Number,
});
</script>
<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="header-wrapper-top">
        <div class="header-wrapper-top-title" @click="router.push({ name: 'home' })">food order</div>
        <div class="header-wrapper-top-cart" @click="router.push({ name: 'cart' })">
          <Icons name="cart" />
          <p>{{ totalCart }}</p>
        </div>
      </div>
      <div class="header-wrapper-bot">
        <div class="header-wrapper-bot-search">
          <Icons name="search" />
          <input type="text" name="" id="" placeholder="Search.." />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.header {
  margin-bottom: 3rem;
  &-wrapper {
    padding: 3rem;
    background-color: var(--color-black);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border-radius: 0 0 3rem 3rem;
    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-title {
        color: white;
        font-size: 3.2rem;
        text-transform: capitalize;
        font-weight: 600;
      }
      &-cart {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        background-color: var(--color-green);
        & svg {
          height: 2rem;
          fill: var(--color-black);
        }
        & p {
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--color-black);
        }
      }
    }
    &-bot {
      &-search {
        padding: 1rem 2rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        gap: 1em;
        background: var(--color-grey-3);
        box-shadow: 0 60px 44px -49px var(--color-black);
        & svg {
          height: 2rem;
          width: 2rem;
          fill: rgba(white, 0.2);
        }
        & input {
          width: 100%;
          font-size: 1.6rem;
          border: none;
          outline: none;
          background: var(--color-grey-3);
          color: white;
        }
      }
    }
  }
}
</style>
