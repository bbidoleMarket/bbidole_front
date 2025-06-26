<template>
  <Header :class="flex" />
  <main :class="flex - grow">
    <router-view />
  </main>
  <Footer />
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import router from "../router";
</script>
