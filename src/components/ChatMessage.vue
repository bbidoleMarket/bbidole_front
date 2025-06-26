<template>
  <div
    class="max-w-[50%] rounded-[12px] break-words p-2 font-noto mx-4 mt-4 text-xs lg:text-lg"
    :class="
      message.senderId === Number(message.othersId)
        ? 'mr-auto bg-[#EAF9EA]'
        : 'ml-auto bg-[#B0DEDE]'
    "
  >
    {{ message.content }}
  </div>
  <p
    class="text-xs text-[#555] mb-4"
    :class="
      message.senderId === Number(message.othersId)
        ? 'mr-auto ml-6'
        : 'mr-6 ml-auto'
    "
  >
    {{ formatDateTime(message.sendAt) }}
  </p>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => [],
  },
  othersId: [Number, String],
});

function formatDateTime(dateTime) {
  return dateTime.toString().slice(0, 16).replace("T", " ");
}
</script>
