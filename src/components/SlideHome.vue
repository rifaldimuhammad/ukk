<template>
  <swiper
    :spaceBetween="30"
    :centeredSlides="true"
    :autoplay="{
      delay: 2500,
      disableOnInteraction: false,
    }"
    :pagination="{
      clickable: true,
    }"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide>
      <div class="slide-home-img" style="background: url('/src/assets/img/heroHome1.jpg')"></div>
    </swiper-slide>
    <swiper-slide>
      <div class="slide-home-img" style="background: url('/src/assets/img/heroHome1.jpg')"></div>
    </swiper-slide>
    <swiper-slide>
      <div class="slide-home-img" style="background: url('/src/assets/img/heroHome1.jpg')"></div>
    </swiper-slide>
  </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper';
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Autoplay, Pagination],
    };
  },
};
</script>
<style lang="scss">
.swiper {
  height: 30rem;
  .slide-home-img {
    height: 100%;
    width: 100%;
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
}
</style>
