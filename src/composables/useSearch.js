import { ref } from 'vue';

export function useSearch(products) {
  const searchTerm = ref('');
  const filteredProducts = ref(products);

  const searchProducts = () => {
    if (searchTerm.value) {
      filteredProducts.value = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    } else {
      filteredProducts.value = products;
    }
  };

  return {
    searchTerm,
    filteredProducts,
    searchProducts,
  };
}