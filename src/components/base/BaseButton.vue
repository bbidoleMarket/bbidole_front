<template>
    <button
        v-bind="$attrs"
        @click="onClick"
        :class="[
            'font-jua bg-[#43A8A5] hover:bg-[#319B9A] p-[8px] rounded-[12px]',
            $attrs.class,
            props.black ? 'text-[#2E383A]' : 'text-white',
        ]"
    >
        <slot>기본 버튼</slot>
    </button>
</template>

<script setup>
const emit = defineEmits(["click"]);
const props = defineProps({
    black: {
        type: Boolean,
        default: false,
    },
});

const onClick = (event) => {
    emit("click", event);
};
</script>
