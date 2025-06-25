<template>
  <Header />
  <main class="bg-[#fffff6]">
    <router-view />
  </main>
  <Footer />
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import router from "../router";
</script>
