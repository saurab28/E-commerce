<template>
  <div class="carousel container mx-auto">
    <div
      class="carousel-track"
      :style="{
        transform: `translateX(-${currentSlide * 100}%)`,

        transition: isTransitioning ? 'transform 0.8s ease-in-out' : 'none',
      }"
      @transitionend="handleTransitionEnd"
    >
      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357435/slide4_bvanzw.jpg"
          alt="Banner 4"
        />
      </div>

      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357644/slide1_j30jjr.png"
          alt="Banner 1"
        />
      </div>
      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357632/slide2_kocqwc.jpg"
          alt="Banner 2"
        />
      </div>
      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357618/slide3_b3fh0x.jpg"
          alt="Banner 3"
        />
      </div>
      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357435/slide4_bvanzw.jpg"
          alt="Banner 4"
        />
      </div>

      <div class="slide">
        <img
          src="https://res.cloudinary.com/dzstm89mb/image/upload/v1758357644/slide1_j30jjr.png"
          alt="Banner 1"
        />
      </div>
    </div>

    <button class="control prev" @click="prevSlide">‹</button>
    <button class="control next" @click="nextSlide">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentSlide = ref<number>(1)
const totalSlides = ref<number>(4)
const isTransitioning = ref<boolean>(true)

const nextSlide = (): void => {
  isTransitioning.value = true
  currentSlide.value++
}

const prevSlide = (): void => {
  isTransitioning.value = true
  currentSlide.value--
}

const handleTransitionEnd = (): void => {
  if (currentSlide.value === totalSlides.value + 1) {
    isTransitioning.value = false
    currentSlide.value = 1

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isTransitioning.value = true
      })
    })
  }

  if (currentSlide.value === 0) {
    isTransitioning.value = false
    currentSlide.value = totalSlides.value

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isTransitioning.value = true
      })
    })
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

  width: 80%;
  height: 60vh;
  overflow: hidden;
  border-radius: 40px;
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
