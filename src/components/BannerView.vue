<template>
  <div class="carousel container mx-auto ">
    <div
      class="carousel-track"
      :style="{
        transform: `translateX(-${currentSlide * 100}%)`,

        transition: isTransitioning ? 'transform 0.8s ease-in-out' : 'none'

      }"
      @transitionend="handleTransitionEnd"
    >
      <!-- clone of last -->
      <div class="slide">
        <img src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357435/slide4_bvanzw.jpg" alt="Banner 4" />
      </div>

      <!-- real slides -->
      <div class="slide">
        <img src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357644/slide1_j30jjr.png" alt="Banner 1" />
      </div>
      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357632/slide2_kocqwc.jpg"
          alt="Banner 2"
        />
      </div>
      <div class="slide">
        <img src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357618/slide3_b3fh0x.jpg" alt="Banner 3" />
      </div>
      <div class="slide">
        <img src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357435/slide4_bvanzw.jpg" alt="Banner 4" />
      </div>

      <!-- clone of first -->
      <div class="slide">
        <img src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357644/slide1_j30jjr.png" alt="Banner 1" />
      </div>
    </div>

    <button class="control prev" @click="prevSlide">‹</button>
    <button class="control next" @click="nextSlide">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentSlide = ref<number>(1) // start on first *real* slide
const totalSlides = ref<number>(4) // real slides count
const isTransitioning = ref<boolean>(true) // controls smooth/instant jumps

const nextSlide = (): void => {

  // isTransitioning.value = true;
  currentSlide.value++;
};

const prevSlide = (): void => {
  // isTransitioning.value = true;
  currentSlide.value--;
};


const handleTransitionEnd = (): void => {
  // if we moved past the last clone, reset to first real
  if (currentSlide.value === totalSlides.value + 1) {

    currentSlide.value = 1;
    isTransitioning.value = false;
  }
  // if we moved before the first clone, reset to last real
  if (currentSlide.value === 0) {
    currentSlide.value = totalSlides.value;
    isTransitioning.value = false;
  }
}

onMounted(() => {
  setInterval(() => {
    nextSlide()
  }, 4000)
})
</script>

<style scoped>
.carousel {
  position: relative;
  width: 85%;
  height: 60vh;
  overflow: hidden;
  border-radius:40px;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* display: block; */
}

.control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  border: none;
  font-size: 2rem;
  padding: 5px 12px;
  cursor: pointer;
  z-index: 5;
}

.control.prev {
  left: 10px;
}

.control.next {
  right: 10px;
}
</style>
