<script setup>
import { ref, reactive, onMounted } from 'vue';
import Icons from '../components/Icons.vue';
import { useRouter } from 'vue-router';
import { urlApi, apiClient } from '../api/axios-config';
let router = useRouter();
const rowCart = reactive({
  items: [],
});
const getCart = async () => {
  const { data } = await apiClient.get(`/pesanan`);
  rowCart.items = data.data;
};

const deleteCart = async (id) => {
  const { data } = await apiClient.delete(`/pesanan/${id}`);
  alert('pesanan telah di hapus');
  getCart();
};
onMounted(() => {
  getCart();                          
});
</script>
<template>
  <div class="cart">
    <div class="cart-title">
      <div class="cart-title-text">Cart</div>
      <div class="cart-title-close" @click="router.push({ name: 'home' })"><Icons name="close" /></div>
    </div>
    <div class="cart-content">
      <div v-for="item in rowCart.items" class="cart-content-item">
        <div class="cart-content-item-img">
          <img :src="urlApi + item.cover" alt="" class="cart-content-item-img-src" />
        </div>
        <div class="cart-content-item-info">
          <div class="cart-content-item-info-1">{{ item.nama }}</div>
          <div class="cart-content-item-info-2">100g</div>
          <div class="cart-content-item-info-3">
            <div class="menu-value">
              <span @click="item.jumlah_menu--"><Icons name="minus" /></span>
              <input v-model="item.jumlah_menu" type="number" max="10" name="" id="" />
              <span @click="item.jumlah_menu++"> <Icons name="add" /> </span>
            </div>
            <div class="cart-content-item-info-3-price">Rp {{ item.total_harga }}</div>
          </div>
        </div>
        <div class="cart-content-item-trash" @click="deleteCart(item.id)">
          <Icons name="trash" />
        </div>
      </div>
    </div>
    <div class="cart-info ">
      <div class="cart-info-item">
        <div class="cart-info-item-left">subtotal Produk</div>
        <div class="cart-info-item-right">100k</div>
      </div>
      <div class="cart-info-item">
        <div class="cart-info-item-left">subtotal Produk</div>
        <div class="cart-info-item-right">100k</div>
      </div>
      <div class="cart-info-item total">
        <div class="cart-info-item-left">subtotal Produk</div>
        <div class="cart-info-item-right">100k</div>
      </div>
      <div class="cart-info-btn">order</div>
    </div>
  </div>
</template>
<style lang="scss">
.cart {
  background-color: var(--color-grey-1);
  &-title {
    padding: 3rem;
    background-color: var(--color-black);
    border-radius: 0 0 3rem 3rem;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1;
    &-text {
      font-size: 2rem;
      color: white;
      font-weight: 400;
    }
    &-close {
      display: flex;
      align-items: center;
      cursor: pointer;
      & svg {
        height: 2.4rem;
        fill: white;
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 3rem;
    &-item {
      padding: 2rem;
      border-radius: 3rem;
      background-color: white;
      box-shadow: 4px 4px 2rem rgba(grey, 0.2);
      display: flex;
      gap: 2rem;
      position: relative;
      overflow: hidden;
      &-img {
        &-src {
          height: 15rem;
        }
      }
      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: -webkit-fill-available;
        &-1 {
          color: var(--color-black);
          font-weight: 600;
          text-transform: capitalize;
          font-size: 2rem;
        }
        &-2 {
          color: rgba(black, 0.5);
          font-weight: 500;
          text-transform: capitalize;
          font-size: 2rem;
        }
        &-3 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-price {
            font-size: 2rem;
            font-weight: 600;
            color: var(--color-black);
            --note-theme: red;
          }
        }
      }
      &-trash {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        height: 5rem;
        width: 5rem;
        border-radius: 0 0 0 2rem;
        background-color: red;
        display: flex;
        align-items: center;
        justify-content: center;
        & svg {
          fill: white;
          height: 2rem;
        }
      }
    }
  }
  &-info {
    padding: 3rem;
    width: 100%;
    background-color: white;
    border-radius: 1rem 1rem 0 0;
    // box-shadow: 4px 4px 2rem rgba(grey, 0.3);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-item {
      padding: 0.5rem 0;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      position: relative;

      //   &:not(:nth-child(3)) {
      //     &::after {
      //       content: '';
      //       width: 100%;
      //       height: 1px;
      //       background-color: var(--color-black);
      //       position: absolute;
      //       bottom: 0;
      //       left: 0;
      //     }
      //   }

      &-left {
        font-size: 1.6rem;
        font-weight: 600;
        color: rgba(black, 0.4);
        text-transform: capitalize;
      }
      &-right {
        font-size: 1.6rem;
        font-weight: 600;
        color: rgba(black, 0.4);
      }

      &.total {
        & .cart-info-item-left {
          color: var(--color-black);
          font-size: 1.8rem;
        }
        & .cart-info-item-right {
          color: var(--color-black);
          font-size: 1.8rem;
        }
      }
    }
    &-btn {
      background-color: var(--color-black);
      padding: 0.5rem;
      width: -webkit-fill-available;
      border-radius: 1rem;
      text-align: center;
      color: white;
      text-transform: uppercase;
    }
  }
}
</style>
