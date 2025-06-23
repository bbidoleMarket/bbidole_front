<template>
  <BaseLayout>
    <HomePage />
  </BaseLayout>

  <BaseModal />
</template>

<script setup>
import BaseLayout from "./layouts/BaseLayout.vue";
import HomePage from './pages/HomePage.vue';
import BaseModal from "./components/base/BaseModal.vue";
</script>
