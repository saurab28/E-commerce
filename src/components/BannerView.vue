<template>
  <div class="carousel">
    <div
      class="carousel-track"
      :style="{
        transform: `translateX(-${currentSlide * 100}%)`,
        transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none'
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

<script lang="ts">
export default {
  name: "BannerView",
  data() {
    return {
      currentSlide: 1,          // start on first *real* slide
      totalSlides: 4,           // real slides count
      isTransitioning: true     // controls smooth/instant jumps
    };
  },
  methods: {
    nextSlide() {
      this.isTransitioning = true;
      this.currentSlide++;
    },
    prevSlide() {
      this.isTransitioning = true;
      this.currentSlide--;
    },
    handleTransitionEnd() {
      // if we moved past the last clone, reset to first real
      if (this.currentSlide === this.totalSlides + 1) {
        this.isTransitioning = false;
        this.currentSlide = 1;
      }
      // if we moved before the first clone, reset to last real
      if (this.currentSlide === 0) {
        this.isTransitioning = false;
        this.currentSlide = this.totalSlides;
      }
    }
  },
  mounted() {
    setInterval(() => {
      this.nextSlide();
    }, 4000);
  }
};
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
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
  display: block;
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
