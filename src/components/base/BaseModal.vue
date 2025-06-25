<template>
    <div
        v-if="modal.isOpen"
        class="fixed inset-0 z-50 bg-[#222] bg-opacity-50 flex items-center justify-center"
    >
        <div
            class="bg-[#77D1CC] bg-opacity-60 rounded-[12px] shadow-md w-full max-w-sm sm:max-w-md h-auto min-h-[220px] text-center"
        >
            <h2
                class="m-0 text-base sm:text-lg bg-[#FFFCEF] rounded-[12px] text-[#2E383A] font-bold p-3 sm:p-4"
            >
                {{ modal.title }}
            </h2>
            <p
                class="mt-4 sm:mt-6 text-[#2E383A] p-2 sm:p-4 text-sm sm:text-base whitespace-pre-line"
            >
                {{ modal.message }}
            </p>
            <div class="modal-content">
                <BaseButton
                    variant="brand"
                    size="md"
                    class="flex-center shadow-md"
                    @click="modal.close"
                >
                    확인
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from "../../stores/modal";
import BaseButton from "./BaseButton.vue";
const modal = useModalStore();
</script>
