/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                jua: ["Jua", "sans-serif"], // 제목, 버튼 등
                noto: ["Noto Serif KR", "serif"], // 본문, 설명 등
                hahmlet: ["Hahmlet", "serif"], // 물품, 이름, 가격
            },
        },
        screens: {
            sm: "393px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
  plugins: [],
};
