<template>
  <Header />
  <main class="pb-[70px]">
    <slot></slot>
  </main>
  <Footer />
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import router from "../router";
</script>
