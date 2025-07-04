import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    onConfirm: null,
    onClose: null
  }),
  actions: {
    open({ title, message, confirmText, cancelText, onConfirm, onClose }) {
      this.title = title;
      this.message = message;
      this.confirmText = confirmText || "확인";
      this.cancelText = cancelText || "";
      this.onConfirm = onConfirm;
      this.onClose = onClose;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      // onClose 콜백 실행
      if (this.onClose && typeof this.onClose === 'function') {
        this.onClose();
      }
      // 상태 초기화
      this.onConfirm = null;
      this.onClose = null;
    },
  },
});
