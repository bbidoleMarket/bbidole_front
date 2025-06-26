<template>
  <div v-bind="$attrs" :class="[$attrs.class, 'min-h screen flex flex-col min-h-screen']">
    <Header v-if="!route.meta.hideLayout" />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer v-if="!route.meta.hideLayout" />
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
