import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 응답을 처리하는 함수
const transformResponse = (response) => {
  // 응답 구조: { status, success, message, data: { content, totalElements 등 } }
  return response.data;
};

export async function getPostList({ keyword, onlySelling, page, size, sort = 'latest' }) {
  const params = {
    onlySelling: onlySelling,
    page: page,
    size: size,
    sort:sort
  };

  if (keyword) {
    params.keyword = keyword;
  }

  try {
    const response = await apiClient.get('/posts', { params });
    return transformResponse(response);
  } catch (error) {
    console.error('API 오류:', error);
    throw error;
  }
}

export async function searchPosts({ keyword, onlySelling, page, size }) {
  const params = {
    keyword: keyword,
    onlySelling: onlySelling,
    page: page,
    size: size
  };

  try {
    const response = await apiClient.get('/posts/search', { params });
    return transformResponse(response);
  } catch (error) {
    console.error('API 오류:', error);
    throw error;
  }
}

export async function createPost(postData) {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('price', postData.price);
    formData.append('description', postData.description);
    formData.append('image', postData.image);
    
    const response = await axios.post('http://localhost:8080/api/createpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiMiIsImlhdCI6MTc1MDkwNDM0NywiZXhwIjoxNzUwOTA3OTQ3fQ.ez9zO0mRxkudZuwCGvCMjXW8hgQ0V5I-tqlF3btXr7fhnhHNmom43LP_js8MWe9gumoIODEbkyKFJ-RGk4DbcQ' // 토큰을 로컬 스토리지에서 가져옴
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('상품 등록 실패:', error);
    return {
      success: false,
      message: error.response?.data?.message || '상품 등록에 실패했습니다',
      error
    };
  }
}