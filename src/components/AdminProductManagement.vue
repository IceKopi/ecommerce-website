<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="elegant-heading">Product Management</h1>
          <button class="btn-elegant text-white" data-bs-toggle="collapse" data-bs-target="#addProductForm">
            <i class="bi bi-plus-circle text-white me-2"></i>New Product
          </button>
        </div>

        <div class="collapse mb-5" id="addProductForm">
          <div class="elegant-card card-body border-0 shadow-sm">
            <h5 class="elegant-subheading mb-3">Add New Product</h5>
            <form @submit.prevent="addProduct" enctype="multipart/form-data">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="elegant-label">Product Name</label>
                  <input v-model="newProduct.name" class="elegant-input form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="elegant-label">Price (₱)</label>
                  <input v-model.number="newProduct.price" type="number" min="0" step="0.01" class="elegant-input form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="elegant-label">Stock</label>
                  <input v-model.number="newProduct.stock" type="number" min="0" class="elegant-input form-control" required />
                </div>
                <div class="col-12">
                  <label class="elegant-label">Description</label>
                  <textarea v-model="newProduct.description" class="elegant-input form-control" rows="3" required></textarea>
                </div>
                <div class="col-12">
                  <label class="elegant-label">Product Image</label>
                  <input type="file" @change="handleImage" class="elegant-input form-control" accept="image/*" />
                </div>
                <div class="col-12 text-end">
                  <button type="button" class="btn-elegant-secondary me-2" data-bs-toggle="collapse" data-bs-target="#addProductForm">Cancel</button>
                  <button type="submit" class="btn-elegant">
                    <i class="bi bi-plus-circle me-2"></i>Add Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="elegant-card border-0 shadow-sm mb-5">
          <div class="card-body p-4">
            <h5 class="elegant-subheading mb-3">Dashboard Overview</h5>
            <div class="row g-3">
              <div class="col-md-4">
                <div class="dashboard-stat text-center p-3 bg-gradient h-100">
                  <i class="bi bi-box-seam dashboard-icon"></i>
                  <h2 class="dashboard-value mt-2">{{ products.length }}</h2>
                  <p class="dashboard-label mb-0">Total Products</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="dashboard-stat text-center p-3 bg-gradient h-100">
                  <i class="bi bi-currency-dollar dashboard-icon"></i>
                  <h2 class="dashboard-value mt-2">₱{{ totalInventoryValue.toLocaleString() }}</h2>
                  <p class="dashboard-label mb-0">Inventory Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="elegant-subheading">Product Catalog</h4>
            <div class="elegant-view-toggle">
              <button @click="currentView = 'grid'" class="btn-view-toggle" :class="{ active: currentView === 'grid' }">
                <i class="bi bi-grid-3x3-gap"></i>
              </button>
              <button @click="currentView = 'table'" class="btn-view-toggle" :class="{ active: currentView === 'table' }">
                <i class="bi bi-list-ul"></i>
              </button>
            </div>
          </div>

          <div class="elegant-card border-0 shadow-sm mb-4">
            <div class="card-body p-3">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control elegant-input border-start-0" placeholder="Search..." v-model="searchQuery" />
              </div>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center py-5">
            <i class="bi bi-box text-secondary display-1"></i>
            <p class="elegant-text mt-3">No products found.</p>
          </div>

          <div v-else-if="currentView === 'grid'" class="row g-4">
            <div v-for="product in filteredProducts" :key="product.id" class="col-md-6 col-lg-4">
              <div class="elegant-card card h-100 border-0 shadow-sm">
                <img v-if="product.image" :src="fullImageUrl(product.image)" :alt="product.name" class="product-image-admin card-img-top" />
                <div class="card-body">
                  <h5 class="product-title">{{ product.name }}</h5>
                  <p class="product-price">₱{{ product.price.toLocaleString() }}</p>
                  <p class="product-description">{{ product.description }}</p>
                </div>
                <div class="card-footer bg-white border-0 d-flex justify-content-between">
                  <button class="btn-elegant-secondary btn-sm" @click="openEditModal(product)"><i class="bi bi-pencil me-1"></i>Edit</button>
                  <button class="btn-elegant-danger btn-sm" @click="confirmDelete(product)"><i class="bi bi-trash me-1"></i>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit and Delete Modals go here -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      filteredProducts: [],
      newProduct: { name: '', description: '', price: 0, stock: 0 },
      selectedImage: null,
      editProduct: {},
      selectedEditImage: null,
      productToDelete: null,
      currentView: 'grid',
      searchQuery: ''
    }
  },
  computed: {
    totalInventoryValue() {
      return this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    }
  },
  methods: {
    loadProducts() {
      const stored = localStorage.getItem('products');
      this.products = stored ? JSON.parse(stored) : [];
      this.filteredProducts = [...this.products];
    },
    saveProducts() {
      localStorage.setItem('products', JSON.stringify(this.products));
    },
    handleImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    },
    addProduct() {
      const product = { ...this.newProduct, id: Date.now(), image: this.selectedImage || '' };
      this.products.push(product);
      this.saveProducts();
      this.newProduct = { name: '', description: '', price: 0, stock: 0 };
      this.selectedImage = null;
      this.filteredProducts = [...this.products];
    },
    fullImageUrl(data) {
      return data;
    },
    confirmDelete(product) {
      if (confirm(`Delete ${product.name}?`)) {
        this.products = this.products.filter(p => p.id !== product.id);
        this.saveProducts();
        this.filteredProducts = [...this.products];
      }
    },
    openEditModal(product) {
      this.editProduct = { ...product };
    },
    submitEdit() {
      const index = this.products.findIndex(p => p.id === this.editProduct.id);
      if (index !== -1) {
        if (this.selectedEditImage) {
          const reader = new FileReader();
          reader.onload = () => {
            this.editProduct.image = reader.result;
            this.products.splice(index, 1, this.editProduct);
            this.saveProducts();
            this.filteredProducts = [...this.products];
          };
          reader.readAsDataURL(this.selectedEditImage);
        } else {
          this.products.splice(index, 1, this.editProduct);
          this.saveProducts();
          this.filteredProducts = [...this.products];
        }
      }
    }
  },
  watch: {
    searchQuery() {
      const query = this.searchQuery.trim().toLowerCase();
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.price.toString().includes(query)
      );
    },
    products: {
      handler() {
        this.saveProducts();
      },
      deep: true
    }
  },
  mounted() {
    this.loadProducts();
  }
}
</script>


<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

/* Base Styles */
:root {
    --color-primary: #453a2d;
    --color-secondary: #5a4d3e;
    --color-accent: #c8a97e;
    --color-accent-light: #dbc6a6;
    --color-accent-danger: #c45440;
    --color-light: #f9f7f4;
    --color-white: #ffffff;
    --color-text: #453a2d;
    --color-text-light: #7d7164;
    --border-radius: 8px;
    --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    --transition: all 0.3s ease;
}

/* Typography */
.elegant-heading {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    color: var(--color-primary);
    font-size: 2.5rem;
    letter-spacing: -0.5px;
}

.elegant-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-accent);
    display: inline-block;
    background-color: rgba(200, 169, 126, 0.1);
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 50%;
}

.elegant-subheading {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    color: var(--color-secondary);
    font-size: 1.5rem;
    letter-spacing: -0.3px;
}

.elegant-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    color: var(--color-primary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.elegant-text {
    font-family: 'Montserrat', sans-serif;
    color: var(--color-text-light);
    font-weight: 400;
    line-height: 1.6;
}

.elegant-text-sm {
    font-family: 'Montserrat', sans-serif;
    color: var(--color-text-light);
    font-size: 0.85rem;
    font-weight: 400;
}

/* Buttons */
.btn-elegant {
    background-color: var(--color-accent);
    border: none;
    color: var(--color-primary);
    padding: 0.5rem 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    border-radius: var(--border-radius);
    letter-spacing: 0.5px;
    transition: var(--transition);
}

.btn-elegant:hover,
.btn-elegant:focus {
    background-color: #b59669;
    color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(200, 169, 126, 0.3);
}

.btn-elegant-secondary {
    background-color: transparent;
    border: 1px solid var(--color-text-light);
    color: var(--color-text);
    padding: 0.5rem 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    border-radius: var(--border-radius);
    transition: var(--transition);
}

.btn-elegant-secondary:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background-color: rgba(200, 169, 126, 0.05);
}

.btn-elegant-danger {
    background-color: transparent;
    border: 1px solid var(--color-accent-danger);
    color: var(--color-accent-danger);
    padding: 0.5rem 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    border-radius: var(--border-radius);
    transition: var(--transition);
}

.btn-elegant-danger:hover {
    background-color: var(--color-accent-danger);
    color: rgb(125, 116, 45);
}

/* Cards & UI Elements */
.elegant-card {
    border-radius: var(--border-radius);
    overflow: hidden;
    background-color: var(--color-white);
    border: 1px burlywood;
}

.elegant-badge {
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--color-accent);
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.elegant-modal {
    border-radius: var(--border-radius);
    overflow: hidden;
}

.elegant-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    color: var(--color-primary);
    font-size: 1.5rem;
}

.elegant-input {
    border: 1px solid #e0e0e0;
    border-radius: var(--border-radius);
    padding: 0.75rem 1rem;
    font-family: 'Montserrat', sans-serif;
    transition: var(--transition);
}

.elegant-input:focus {
    border-color: var(--color-accent-light);
    box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.1);
}

.elegant-thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--border-radius);
    border: 1px solid #e0e0e0;
}

/* Product Cards */
.product-image-container {
    height: 220px;
    overflow: hidden;
    background-color: var(--color-light);
}

.product-image-admin {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.product-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--color-light);
}

.product-image-placeholder i {
    font-size: 4rem;
    opacity: 0.3;
    color: var(--color-accent);
}

.product-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    color: var(--color-primary);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.product-price {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    color: var(--color-accent);
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
}

.product-description {
    font-family: 'Montserrat', sans-serif;
    color: var(--color-text-light);
    font-size: 0.9rem;
    line-height: 1.6;
}

/* Transitions & Animations */
.hover-shadow:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow) !important;
    transition: var(--transition);
}

.hover-shadow:hover .product-image {
    transform: scale(1.05);
}

.transition {
    transition: var(--transition);
}

/* Add Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

/* View Toggle Styles */
.elegant-view-toggle {
    display: inline-flex;
    background-color: var(--color-light);
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid #e0e0e0;
}

.btn-view-toggle {
    background: transparent;
    border: none;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    color: var(--color-text-light);
    transition: var(--transition);
}

.btn-view-toggle.active {
    background-color: var(--color-accent);
    color: var(--color-white);
}

.btn-view-toggle:hover:not(.active) {
    background-color: rgba(200, 169, 126, 0.1);
    color: var(--color-accent);
}

/* Table View Styles */
.elegant-table {
    margin-bottom: 0;
}

.elegant-th {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    color: var(--color-primary);
    padding: 1rem;
    border-bottom: 2px solid var(--color-accent-light);
}

.elegant-td {
    font-family: 'Montserrat', sans-serif;
    color: var(--color-text);
    padding: 1rem;
    vertical-align: middle;
    border-color: #f0f0f0;
}

.elegant-tr:hover {
    background-color: var(--color-light);
}

.table-image-container {
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: var(--border-radius);
    background-color: var(--color-light);
    display: flex;
    align-items: center;
    justify-content: center;
}

.table-product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.table-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    opacity: 0.5;
}

.table-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 300px;
}
</style>