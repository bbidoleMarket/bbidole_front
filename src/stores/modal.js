import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    title: "",
    message: "",
  }),
  actions: {
    open({ title, message }) {
      this.title = title;
      this.message = message;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
});
