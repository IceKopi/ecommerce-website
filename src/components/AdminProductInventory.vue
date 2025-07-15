<template>
  <div class="container mt-4">
    <h3>Product Inventory</h3>

    <div v-if="paginated.length === 0">No products found.</div>
    <div v-for="product in paginated" :key="product.id" class="card mb-3">
      <div class="card-body">
        <h5>{{ product.name }}</h5>
        <p>{{ product.description }}</p>
        <p>₱{{ product.price }} — Stock: {{ product.stock }}</p>
        <img
          v-if="product.image"
          :src="product.image"
          alt="Product image"
          class="img-thumbnail mb-2"
          style="max-height: 120px;"
        />

        <button class="btn btn-sm btn-primary me-2" @click="openEditModal(product)">Edit</button>
        <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">Delete</button>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1">
      <ul class="pagination justify-content-center mt-3">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
        </li>
        <li
          v-for="n in totalPages"
          :key="n"
          class="page-item"
          :class="{ active: currentPage === n }"
        >
          <a class="page-link" href="#" @click.prevent="currentPage = n">{{ n }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
        </li>
      </ul>
    </nav>

    <!-- Edit Modal -->
    <div class="modal fade" ref="editModal" id="editModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submitEdit">
            <div class="modal-header">
              <h5 class="modal-title">Edit Product</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <input v-model="editProduct.name" class="form-control mb-2" placeholder="Name" required />
              <input v-model="editProduct.description" class="form-control mb-2" placeholder="Description" required />
              <input type="number" v-model.number="editProduct.price" class="form-control mb-2" placeholder="Price" required />
              <input type="number" v-model.number="editProduct.stock" class="form-control mb-2" placeholder="Stock" required />
              <input type="file" @change="handleEditImage" class="form-control mb-2" accept="image/*" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
              <button type="submit" class="btn btn-success">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="mt-5">
      <h4>📄 All Transactions</h4>
      <div v-if="orders.length === 0">No transactions found.</div>
      <div v-for="order in orders" :key="order.id" class="card mb-2">
        <div class="card-body">
          <h6>Order #{{ order.id }} — {{ order.date_ordered }}</h6>
          <p><strong>User:</strong> {{ order.user }}</p>
          <ul>
            <li v-for="item in order.items" :key="item.id">
              {{ item.product }} — Qty: {{ item.quantity }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap'

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      perPage: 5,
      editProduct: { id: null, name: '', description: '', price: 0, stock: 0, image: null },
      editImage: null,
      modalInstance: null,
      orders: []
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.perPage)
    },
    paginated() {
      const start = (this.currentPage - 1) * this.perPage
      return this.products.slice(start, start + this.perPage)
    }
  },
  methods: {
    fetchProducts() {
      const stored = localStorage.getItem('products')
      this.products = stored ? JSON.parse(stored) : []
    },
    deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.products = this.products.filter(p => p.id !== id)
        localStorage.setItem('products', JSON.stringify(this.products))
      }
    },
    openEditModal(product) {
      this.editProduct = { ...product }
      this.editImage = null
      this.modalInstance = new bootstrap.Modal(this.$refs.editModal)
      this.modalInstance.show()
    },
    closeEditModal() {
      if (this.modalInstance) this.modalInstance.hide()
    },
    handleEditImage(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.editProduct.image = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    submitEdit() {
      const index = this.products.findIndex(p => p.id === this.editProduct.id)
      if (index !== -1) {
        this.products.splice(index, 1, { ...this.editProduct })
        localStorage.setItem('products', JSON.stringify(this.products))
        alert('✅ Product updated!')
        this.closeEditModal()
      }
    },
    fetchAllOrders() {
      const stored = localStorage.getItem('orders')
      this.orders = stored ? JSON.parse(stored) : []
    }
  },
  mounted() {
    // Optional access check (remove if not using login)
    const token = localStorage.getItem('access')
    const isStaff = localStorage.getItem('is_staff') === 'true'
    if (!token || !isStaff) {
      alert('⛔ Access denied. Staff only.')
      this.$router.push('/login')
      return
    }

    this.fetchProducts()
    this.fetchAllOrders()
  }
}
</script>
