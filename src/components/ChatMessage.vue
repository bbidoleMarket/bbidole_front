<template>
  <div
    class="max-w-[50%] rounded-[12px] break-words p-2 font-noto mx-4 mt-4 text-sm lg:text-lg"
    :class="
      message.sender === 'me' ? 'ml-auto bg-[#B0DEDE]' : 'mr-auto bg-[#EAF9EA]'
    "
  >
    {{ message.content }}
  </div>
  <p
    class="text-xs text-[#555] mb-4"
    :class="message.sender === 'me' ? 'mr-6 ml-auto' : 'mr-auto ml-6'"
  >
    {{ message.sendAt }}
  </p>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => [],
  },
});
</script>
