<template>
  <ChatItem
    v-for="chat in chats"
    :key="chat.id"
    :chat="chat"
    @click="onChatClick(chat)"
  />
</template>

<script setup>
import ChatItem from "../components/ChatItem.vue";
import { onMounted } from "vue";
const chats = [
  {
    id: 1,
    title: "채팅방 1",
    seller: "user1",
    buyer: "user2",
  },
  {
    id: 2,
    title: "채팅방 2",
    seller: "user2",
    buyer: "user1",
  },
];
</script>
