<template>
  <div class="container py-5 main-container">
    <!-- Header Section -->
    <div class="row mb-5">
      <div class="col-12">
        <div
          class="d-flex justify-content-between align-items-center w-100 flex-wrap"
        >
          <div class="header-content mb-3 mb-md-0">
            <h1 class="brand-title mb-2">Maisanova Collection</h1>
            <p class="brand-subtitle">Handcrafted treasures for your home</p>
          </div>

          <div class="d-flex align-items-center gap-3 flex-wrap">
            <!-- Search Bar -->
            <div class="search-container position-relative">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control search-input pl-5 pr-4 rounded-pill border-0 shadow-sm"
                placeholder="Search our collection..."
                @input="handleSearch"
              />
              <span class="position-absolute search-icon">
                <i class="fas fa-search text-brown-light"></i>
              </span>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="btn btn-sm position-absolute clear-search-btn"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <!-- Sort Dropdown -->
            <div class="dropdown">
              <button
                class="btn btn-outline-brown dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-sort mr-2"></i>Sort
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" @click="sortBy('name')">Name A-Z</a>
                </li>
                <li>
                  <a class="dropdown-item" @click="sortBy('price-low')"
                    >Price: Low to High</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" @click="sortBy('price-high')"
                    >Price: High to Low</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" @click="sortBy('stock')"
                    >Stock Available</a
                  >
                </li>
              </ul>
            </div>

            <!-- Filter Toggle -->
            <button
              class="btn btn-outline-brown"
              @click="showFilters = !showFilters"
            >
              <i class="fas fa-filter mr-2"></i>Filters
            </button>
          </div>
        </div>

        <!-- Filters Panel -->
        <div
          v-if="showFilters"
          class="filters-panel mt-4 p-4 bg-light rounded shadow-sm"
        >
          <div class="row">
            <div class="col-md-4">
              <label class="form-label">Price Range</label>
              <div class="d-flex gap-2">
                <input
                  v-model="priceFilter.min"
                  type="number"
                  class="form-control"
                  placeholder="Min"
                />
                <input
                  v-model="priceFilter.max"
                  type="number"
                  class="form-control"
                  placeholder="Max"
                />
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Stock Status</label>
              <select v-model="stockFilter" class="form-select">
                <option value="">All Items</option>
                <option value="in-stock">In Stock Only</option>
                <option value="low-stock">Low Stock (Less than 5)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button @click="clearFilters" class="btn btn-outline-secondary">
                <i class="fas fa-times mr-2"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div
          class="results-info mt-4 d-flex justify-content-between align-items-center"
        >
          <p class="text-brown-medium mb-0">
            Showing {{ filteredProducts.length }} of
            {{ products.length }} products
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-brown-medium" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredProducts.length === 0"
      class="empty-state text-center py-5"
    >
      <i class="fas fa-search fa-3x text-brown-light mb-3"></i>
      <h3 class="text-brown-medium">No products found</h3>
      <p class="text-brown-light">Try adjusting your search or filters</p>
      <button @click="clearAll" class="btn btn-brown">
        <i class="fas fa-refresh mr-2"></i>Clear All Filters
      </button>
    </div>

    <!-- Product Grid/List -->
    <div v-else :class="viewMode === 'grid' ? 'row' : 'list-view'">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        :class="viewMode === 'grid' ? 'col-lg-4 col-md-6 mb-4' : 'mb-3'"
      >
        <div
          :class="
            viewMode === 'grid'
              ? 'card product-card h-100'
              : 'card product-card-list'
          "
        >
          <div
            class="product-image-container"
            :class="viewMode === 'list' ? 'list-image' : ''"
          >
            <img
              v-if="product.image"
              :src="product.image"
              :class="
                viewMode === 'grid'
                  ? 'card-img-top product-image-list'
                  : 'product-image-list-mode'
              "
              :alt="product.name"
              @error="handleImageError"
            />
            <div v-else class="no-image-placeholder">
              <i class="fas fa-image text-brown-light"></i>
            </div>

            <!-- Badges -->
            <div class="product-badges">
              <div v-if="product.stock === 0" class="badge-out-of-stock">
                Out of Stock
              </div>
              <div v-else-if="isLowStock(product)" class="badge-low-stock">
                Low Stock
              </div>
              <div v-if="isNewProduct(product)" class="badge-new">New</div>
            </div>
          </div>

          <div class="card-body d-flex flex-column bg-beige">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title font-weight-bold text-brown-dark mb-0">
                {{ product.name }}
              </h5>
              <div class="product-rating">
                <i class="fas fa-star text-warning"></i>
                <span class="text-brown-medium small">{{
                  product.rating || 4.5
                }}</span>
              </div>
            </div>

            <p class="card-text text-brown-medium product-description">
              {{ product.description }}
            </p>

            <div class="mt-auto">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <div class="price-info">
                  <span class="product-price text-brown-dark"
                    >₱{{ product.price.toLocaleString() }}</span
                  >
                  <span
                    v-if="product.originalPrice"
                    class="original-price text-muted ms-2"
                  >
                    ₱{{ product.originalPrice.toLocaleString() }}
                  </span>
                </div>
                <span class="stock-indicator" :class="getStockClass(product)">
                  {{ getStockText(product) }}
                </span>
              </div>

              <button
                class="btn btn-add-to-cart-list w-100 border-0 shadow-sm"
                @click="addToCart(product)"
                :disabled="product.stock === 0"
                :class="getButtonClass(product)"
              >
                <i :class="getButtonIcon(product)" class="me-2"></i>
                {{ getButtonText(product) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Summary (Sticky) -->
    <div v-if="cart.length > 0" class="cart-summary-sticky">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong class="text-brown-dark">{{ getTotalItems() }} items</strong>
          <span class="text-brown-medium ms-2"
            >₱{{ getTotalPrice().toLocaleString() }}</span
          >
        </div>
        <button class="btn btn-brown" @click="viewCart">
          <i class="fas fa-shopping-cart mr-2"></i>View Cart
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast-notification" :class="toastType">
      <i :class="toastIcon" class="mr-2"></i>
      {{ toastMessage }}
      <button class="btn-close" @click="hideToast">&times;</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      cart: [],
      products: [],
      loading: false,
      viewMode: "grid",
      showFilters: false,
      priceFilter: { min: "", max: "" },
      stockFilter: "",
      sortOption: "name",
      selectedQuantities: {},
      showToast: false,
      toastMessage: "",
      toastType: "success",
      toastIcon: "fas fa-check-circle",
    };
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products];

      // Search filter
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      // Price filter
      if (this.priceFilter.min) {
        filtered = filtered.filter(
          (p) => p.price >= parseInt(this.priceFilter.min)
        );
      }
      if (this.priceFilter.max) {
        filtered = filtered.filter(
          (p) => p.price <= parseInt(this.priceFilter.max)
        );
      }

      // Stock filter
      if (this.stockFilter) {
        switch (this.stockFilter) {
          case "in-stock":
            filtered = filtered.filter((p) => p.stock > 0);
            break;
          case "low-stock":
            filtered = filtered.filter((p) => p.stock > 0 && p.stock < 5);
            break;
          case "out-of-stock":
            filtered = filtered.filter((p) => p.stock === 0);
            break;
        }
      }

      // Sort
      switch (this.sortOption) {
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "stock":
          filtered.sort((a, b) => b.stock - a.stock);
          break;
      }

      return filtered;
    },
  },
  methods: {
    handleSearch() {
      // Add debounce for better performance
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        // Search is already handled by computed property
      }, 300);
    },
    clearSearch() {
      this.searchQuery = "";
    },
    sortBy(option) {
      this.sortOption = option;
    },
    clearFilters() {
      this.priceFilter = { min: "", max: "" };
      this.stockFilter = "";
    },
    clearAll() {
      this.searchQuery = "";
      this.clearFilters();
      this.sortOption = "name";
    },
    getSelectedQuantity(product) {
      return this.selectedQuantities[product.id] || 1;
    },
    increaseQuantity(product) {
      const current = this.getSelectedQuantity(product);
      if (current < product.stock) {
        this.selectedQuantities[product.id] = current + 1;
      }
    },
    decreaseQuantity(product) {
      const current = this.getSelectedQuantity(product);
      if (current > 1) {
        this.selectedQuantities[product.id] = current - 1;
      }
    },
    updateQuantity(product, event) {
      const value = parseInt(event.target.value);
      if (value >= 1 && value <= product.stock) {
        this.selectedQuantities[product.id] = value;
      }
    },
    getStockClass(product) {
      if (product.stock === 0) return "text-danger";
      if (product.stock < 5) return "text-warning";
      return "text-success";
    },
    getStockText(product) {
      if (product.stock === 0) return "Out of Stock";
      if (product.stock < 5) return `Only ${product.stock} left`;
      return `${product.stock} in stock`;
    },
    getButtonClass(product) {
      if (product.stock === 0) return "btn-disabled";
      return "btn-brown-active";
    },
    getButtonIcon(product) {
      if (product.stock === 0) return "fas fa-ban";
      return "fas fa-shopping-cart";
    },
    getButtonText(product) {
      if (product.stock === 0) return "Out of Stock";
      const cartItem = this.cart.find((item) => item.product === product.id);
      if (cartItem) return "Add to Cart";
      return "Add to Cart";
    },
    isNewProduct(product) {
      // Mock logic - in real app, check product creation date
      return product.id % 3 === 0;
    },
    isLowStock(product) {
      return product.stock > 0 && product.stock < 5;
    },
    quickView(product) {
      this.showToast = true;
      this.toastMessage = `Quick view for ${product.name}`;
      this.toastType = "info";
      this.toastIcon = "fas fa-info-circle";
      setTimeout(() => this.hideToast(), 3000);
    },
    addToWishlist(product) {
      this.showToast = true;
      this.toastMessage = `${product.name} added to wishlist!`;
      this.toastType = "success";
      this.toastIcon = "fas fa-heart";
      setTimeout(() => this.hideToast(), 3000);
    },
    handleImageError(event) {
      event.target.style.display = "none";
      event.target.nextElementSibling.style.display = "flex";
    },
    loadCart() {
      try {
        const stored = localStorage.getItem("cart");
        this.cart = stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error("Error loading cart:", err);
        this.cart = [];
      }
    },
    loadProducts() {
      this.loading = true;
      const defaultProducts = [
        {
          id: 1,
          name: "Handwoven Basket",
          description:
            "Eco-friendly and durable basket perfect for organizing your home essentials.",
          price: 499,
          originalPrice: 599,
          stock: 5,
          rating: 4.8,
          image: "https://via.placeholder.com/300x200?text=Basket",
        },
        {
          id: 2,
          name: "Wooden Spoon Set",
          description:
            "A premium set of 5 handcrafted wooden spoons made from sustainable bamboo.",
          price: 299,
          stock: 2,
          rating: 4.6,
          image: "https://via.placeholder.com/300x200?text=Spoon+Set",
        },
        {
          id: 3,
          name: "Canvas Tote Bag",
          description:
            "Stylish and reusable tote bag made of 100% organic cotton.",
          price: 350,
          stock: 0,
          rating: 4.9,
          image: "https://via.placeholder.com/300x200?text=Tote+Bag",
        },
        {
          id: 4,
          name: "Ceramic Mug",
          description:
            "Handcrafted ceramic mug with unique glazing, perfect for your morning coffee.",
          price: 199,
          stock: 15,
          rating: 4.7,
          image: "https://via.placeholder.com/300x200?text=Ceramic+Mug",
        },
        {
          id: 5,
          name: "Macrame Wall Hanging",
          description:
            "Beautiful handmade macrame wall art to add bohemian charm to your space.",
          price: 799,
          stock: 3,
          rating: 4.9,
          image: "https://via.placeholder.com/300x200?text=Macrame",
        },
        {
          id: 6,
          name: "Bamboo Cutting Board",
          description:
            "Durable and antibacterial bamboo cutting board with juice groove.",
          price: 459,
          stock: 8,
          rating: 4.5,
          image: "https://via.placeholder.com/300x200?text=Cutting+Board",
        },
      ];

      setTimeout(() => {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          try {
            this.products = JSON.parse(storedProducts);
          } catch {
            this.products = defaultProducts;
          }
        } else {
          this.products = defaultProducts;
        }
        this.loading = false;
      }, 500);
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    saveProducts() {
      localStorage.setItem("products", JSON.stringify(this.products));
    },
    addToCart(product) {
      const quantity = this.getSelectedQuantity(product);
      const existing = this.cart.find((item) => item.product === product.id);

      if (existing) {
        existing.quantity = quantity;
        this.showToast = true;
        this.toastMessage = `${product.name} quantity updated to ${quantity}!`;
        this.toastType = "success";
        this.toastIcon = "fas fa-check-circle";
      } else {
        this.cart.push({
          id: product.id,
          product: product.id,
          product_name: product.name,
          price: product.price,
          quantity: quantity,
        });
        this.showToast = true;
        this.toastMessage = `${product.name} added to cart!`;
        this.toastType = "success";
        this.toastIcon = "fas fa-check-circle";
      }

      this.saveCart();
      setTimeout(() => this.hideToast(), 3000);
    },
    getTotalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    getTotalPrice() {
      return this.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    viewCart() {
      this.showToast = true;
      this.toastMessage = "Redirecting to cart...";
      this.toastType = "info";
      this.toastIcon = "fas fa-shopping-cart";
      setTimeout(() => this.hideToast(), 2000);
    },
    hideToast() {
      this.showToast = false;
    },
  },
  created() {
    this.loadCart();
    this.loadProducts();
  },
};
</script>

<style scoped>
/* Enhanced Brown Neutral Color Palette */
:root {
  --brown-dark: #4a3b2a;
  --brown-medium: #6b4e3d;
  --brown-light: #8b6f56;
  --beige: #f5f1e8;
  --cream: #fffbf5;
  --accent: #d4a574;
  --neutral-dark: #2c1810;
  --neutral-light: #e5ddd5;
  --success: #28a745;
  --warning: #ffc107;
  --danger: #dc3545;
  --info: #17a2b8;
}

.main-container {
  background: linear-gradient(135deg, var(--cream) 0%, var(--beige) 100%);
  min-height: 100vh;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--brown-dark);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
  color: var(--brown-medium);
  font-style: italic;
  margin: 0;
}

.search-container {
  width: 320px;
  position: relative;
}

.search-input {
  background: white;
  border: 2px solid var(--neutral-light);
  transition: all 0.3s ease;
  padding-left: 45px;
  padding-right: 50px;
  height: 45px;
}

.search-input:focus {
  border-color: var(--brown-medium);
  box-shadow: 0 0 0 0.2rem rgba(107, 78, 61, 0.25);
}

.search-icon {
  top: 13px;
  left: 15px;
  z-index: 10;
}

.clear-search-btn {
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: var(--brown-light);
  padding: 5px;
  z-index: 10;
}

.btn-outline-brown {
  color: var(--brown-medium);
  border-color: var(--brown-medium);
}

.btn-outline-brown:hover {
  background-color: var(--brown-medium);
  color: white;
}
.btn-brown {
  background-color: #8B6F47;
  border-color: #8B6F47;
  color: white;
  transition: all 0.3s ease;
}

.btn-brown:hover {
  background-color: #5C4326;
  border-color: #5C4326;
}

.filters-panel {
  background: white;
  border: 1px solid var(--neutral-light);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-info {
  padding: 15px 0;
  border-bottom: 1px solid var(--neutral-light);
}

.view-toggle .btn {
  width: 40px;
  height: 35px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.product-card-list {
  border: none;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  height: 180px;
}

.product-image-container {
  height: 250px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(45deg, #f8f4f0, #f0ebe5);
}

.list-image {
  height: 100%;
  width: 200px;
  min-width: 200px;
}

.product-image-list {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image-list-mode {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.product-card:hover .product-image-list {
  transform: scale(1.05);
}

.no-image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--brown-light);
}

.product-badges {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.badge-out-of-stock,
.badge-low-stock,
.badge-new {
  display: block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: white;
  text-align: center;
}

.badge-out-of-stock {
  background-color: var(--danger);
}

.badge-low-stock {
  background-color: var(--warning);
}

.badge-new {
  background-color: var(--success);
}

.quick-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.btn-quick-action {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  color: var(--brown-medium);
  transition: all 0.3s ease;
}

.btn-quick-action:hover {
  background: var(--brown-medium);
  color: white;
  transform: scale(1.1);
}

.bg-beige {
  background-color: var(--beige);
}

.product-description {
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  min-height: 65px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.price-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--brown-dark);
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
}

.quantity-selector {
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 8px;
}

.quantity-input {
  width: 60px;
  text-align: center;
}
.btn-add-to-cart-list {
  background: linear-gradient(135deg, #8B6F47, #5C4326);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-add-to-cart-list:hover:not(:disabled) {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, #5C4326 80%, #D2B48C), /* softer tan highlight */
    color-mix(in srgb, #5C4326 85%, #3E2C1A)  /* deeper shadow brown */
  );
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
}


.btn-add-to-cart-list:disabled {
  background: var(--neutral-light);
  color: var(--brown-light);
  cursor: not-allowed;
}

.btn-add-to-cart-list:active {
  transform: translateY(0);
}

.cart-summary-sticky {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid var(--brown-medium);
  border-radius: 15px;
  padding: 15px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}


/* Hide on large screens (desktops) */
@media (min-width: 1200px) {
  .cart-summary-sticky {
    display: none;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: #5C4326;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1100;
  animation: slideInRight 0.3s ease;
  display: flex;
  align-items: center;
  max-width: 350px;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-notification.success {
  background-color: var(--success);
}

.toast-notification.info {
  background-color: var(--info);
}

.toast-notification.warning {
  background-color: var(--warning);
}

.toast-notification.error {
  background-color: var(--danger);
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: auto;
  padding: 0 0 0 10px;
  cursor: pointer;
  opacity: 0.7;
}

.btn-close:hover {
  opacity: 1;
}

.empty-state {
  background: white;
  border-radius: 15px;
  padding: 40px;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.list-view .product-card-list .card-body {
  flex: 1;
  padding: 20px;
}

.text-brown {
  color: var(--brown-medium);
}

.text-brown-dark {
  color: var(--brown-dark);
}

.text-brown-medium {
  color: var(--brown-medium);
}

.text-brown-light {
  color: var(--brown-light);
}

.stock-indicator {
  font-size: 0.85rem;
  font-weight: 500;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: var(--beige);
  color: var(--brown-dark);
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2rem;
  }

  .search-container {
    width: 100%;
    max-width: 300px;
  }

  .header-content {
    width: 100%;
    text-align: center;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: center;
  }

  .filters-panel .row {
    flex-direction: column;
  }

  .filters-panel .col-md-4 {
    margin-bottom: 15px;
  }

  .cart-summary-sticky {
    left: 20px;
    right: 20px;
    bottom: 10px;
  }

  .toast-notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}

@media (max-width: 576px) {
  .product-card-list {
    flex-direction: column;
    height: auto;
  }

  .list-image {
    width: 100%;
    height: 200px;
    min-width: auto;
  }

  .view-toggle {
    display: none;
  }
}

/* Loading Animation */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Smooth Transitions */
* {
  transition: color 0.3s ease, background-color 0.3s ease,
    border-color 0.3s ease;
}

/* Focus States for Accessibility */
.btn:focus,
.form-control:focus,
.form-select:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(107, 78, 61, 0.25);
}

/* Hover Effects */
.card:hover {
  cursor: pointer;
}

.product-card-list:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Enhanced Button Styles */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.875rem;
}

/* Form Improvements */
.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid var(--neutral-light);
  padding: 10px 15px;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--brown-medium);
  box-shadow: 0 0 0 0.2rem rgba(107, 78, 61, 0.25);
}

/* Badge Improvements */
.badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
}

/* Card Improvements */
.card {
  border: none;
  transition: all 0.3s ease;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

/* Utility Classes */
.text-success {
  color: var(--success) !important;
}
.text-warning {
  color: var(--warning) !important;
}
.text-danger {
  color: var(--danger) !important;
}
.text-info {
  color: var(--info) !important;
}

/* Animation for new items */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeInUp 0.3s ease;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--beige);
}

::-webkit-scrollbar-thumb {
  background: var(--brown-light);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--brown-medium);
}
</style>
