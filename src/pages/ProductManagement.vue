<template>
  <div class="min-h-screen bg-[#FCFCF2] flex">
    <aside class="w-64 bg-white/90 border-r p-6 shadow-sm flex flex-col">
      <div class="font-extrabold text-2xl mb-8 flex items-center gap-2">
        <span class="text-4xl">🐶</span>
        <span>삐돌이 마켓</span>
        <span class="text-xs text-gray-400 ml-1">(관리자)</span>
      </div>
      <nav class="space-y-4 font-semibold text-lg flex-1">
        <router-link to="/admin">
          <button class="text-left w-full hover:text-[#47C9AF] mb-4">
            대시보드
          </button>
        </router-link>
        <router-link to="/admin/user">
          <button class="text-left w-full hover:text-[#47C9AF] mb-4">
            회원 관리
          </button>
        </router-link>
        <router-link to="/admin/product">
          <button class="text-left w-full hover:text-[#47C9AF] mb-4">
            상품 관리
          </button>
        </router-link>
        <router-link to="/admin/report/user">
          <button class="text-left w-full hover:text-[#47C9AF] mb-4">
            사용자 신고
          </button>
        </router-link>
        <router-link to="/admin/report/post">
          <button class="text-left w-full hover:text-[#47C9AF] mb-4">
            게시글 신고
          </button>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-12">
      <header class="flex justify-between items-center mb-8">
        <div class="text-2xl font-bold">상품 관리</div>
        <input
          v-model="search"
          placeholder="상품명, 판매자, ID 검색"
          class="border rounded-xl px-4 py-2 w-72 shadow"
        />
      </header>

      <div class="bg-white rounded-2xl shadow p-8">
        <table class="w-full text-center">
          <thead>
            <tr class="border-b text-gray-600">
              <th class="py-2">ID</th>
              <th>상품명</th>
              <th>판매자</th>
              <th>등록일</th>
              <th>가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-2">{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.name }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>{{ item.price.toLocaleString() }}원</td>
              <td>
                <span v-if="item.isSold" class="text-green-500 font-semibold"
                  >판매중</span
                >
                <span v-else class="text-gray-400">거래완료</span>
              </td>
              <td>
                <button
                  class="text-xs px-2 py-1 rounded bg-[#47C9AF] text-white hover:bg-[#33a395] mr-2"
                  @click="productDetail(item)"
                >
                  상세
                </button>
                <button
                  class="text-xs px-2 py-1 rounded bg-red-400 text-white hover:bg-red-600"
                  @click="deleteProduct(item)"
                >
                  삭제
                </button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="7" class="py-4 text-gray-400">
                검색 결과가 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminApi } from "../api/admin";
import { formatDate } from "../utils/formatters";
import { useModalStore } from "../stores/modal";
import { useRouter } from "vue-router";

// 더미 데이터
const items = ref([]);
const adminApi = useAdminApi();
const modal = useModalStore();
const router = useRouter();

onMounted(async () => {
  items.value = await adminApi.findAllProduct();
});

const search = ref("");

const filteredItems = computed(() =>
  items.value.filter(
    (i) =>
      i.name.includes(search.value) ||
      i.seller.includes(search.value) ||
      String(i.id).includes(search.value)
  )
);

async function deleteProduct(item) {
  try {
    await adminApi.deleteProduct(item.id);

    // 로그인 성공 모달
    modal.open({
      title: "제품 삭제 성공",
      message: "해당 제품을 삭제했습니다.",
    });

    setTimeout(async () => {
      items.value = await adminApi.findAllProduct();
    }, 1000);
  } catch (error) {
    modal.open({
      title: "제품 삭제 실패",
      message: error.message,
    });
  }
}

function productDetail(item) {
  router.push(`/post/${item.id}`);
}
</script>
