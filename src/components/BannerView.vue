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
        <img src="../assets/slide4.jpg" alt="Banner 4" />
      </div>

      <!-- real slides -->
      <div class="slide">
        <img src="../assets/slide1.jpg" alt="Banner 1" />
      </div>
      <div class="slide">
        <img src="https://images.pexels.com/photos/4113665/pexels-photo-4113665.jpeg" alt="Banner 2" />
      </div>
      <div class="slide">
        <img src="../assets/slide3.jpg" alt="Banner 3" />
      </div>
      <div class="slide">
        <img src="../assets/slide4.jpg" alt="Banner 4" />
      </div>

      <!-- clone of first -->
      <div class="slide">
        <img src="../assets/slide1.jpg" alt="Banner 1" />
      </div>
    </div>

    <button class="control prev" @click="prevSlide">‹</button>
    <button class="control next" @click="nextSlide">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const currentSlide = ref<number>(1);      // start on first *real* slide
const totalSlides = ref<number>(4);       // real slides count
const isTransitioning = ref<boolean>(true); // controls smooth/instant jumps

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
};

onMounted(() => {
  setInterval(() => {
    nextSlide();
  }, 4000);
});
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
  font-size: 32px;
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

@media (max-width: 1024px) {
  .carousel {
    height: 300px;
  }
  .control {
    font-size: 28px;
    padding: 4px 10px;
  }
}

@media (max-width: 768px) {
  .carousel {
    height: 240px;
  }
  .control {
    font-size: 24px;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .carousel {
    height: 180px;
  }
  .control {
    font-size: 20px;
    padding: 2px 6px;
  }
}
</style>

