<template>
  <div v-bind="$attrs" :class="[$attrs.class, 'flex flex-col min-h-screen']">
    <Header />
    <main class="flex-grow pb-[70px]">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import router from "../router";
</script>
