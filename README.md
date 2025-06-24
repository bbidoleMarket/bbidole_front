# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## 시작하기

```bash
npm install                 # 라이브러리 설치
npm run dev                 # 실행
# or
yarn install
yarn dev
```

## 폴더 구조

```bash
my-vue-app/
├── node_modules/           # npm 패키지
├── public/                 # 정적 파일(파비콘, index.html 등)
├── src/                    # 소스 코드
│   ├── assets/             # 이미지, 폰트, 전역 스타일 등 정적 자원
│   ├── components/         # 컴포넌트
│   │   ├── base/           # 공통 컴포넌트(버튼, 인풋, 모달 등)
│   ├── layouts/            # 공통 레이아웃(헤더, 푸터, 사이드바 등)
│   ├── pages/              # 라우터에 매핑되는 페이지 컴포넌트
│   ├── router/             # 라우터 설정(index.js)
│   ├── stores/             # 상태관리(Pinia, Vuex 등)
│   ├── api/                # API 연동 함수, axios 인스턴스 등
│   ├── utils/              # 공통 함수, 헬퍼, 상수 등
│   ├── middlewares/        # 라우터 네비게이션 가드 등 미들웨어
│   ├── App.vue             # 루트 컴포넌트
│   └── main.js             # 진입점(앱 부트스트랩)
├── tests/                  # 테스트 코드(e2e, unit)
├── .env                    # 환경 변수 파일
├── .gitignore
├── package.json
└── vite.config.js          # 빌드/개발 서버 설정
```

## 주요 기술

- Vue 3
- Vite
- Tailwind CSS
- Pinia(전역 상태 관리)
