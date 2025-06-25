<template>
    <router-view />
    <BaseLayout v-if="!route.meta.hideLayout" />
    <BaseModal />
</template>

<script setup>
import BaseLayout from "./layouts/BaseLayout.vue";
import HomePage from "./pages/HomePage.vue";
import BaseModal from "./components/base/BaseModal.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
