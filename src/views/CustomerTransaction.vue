<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h3 class="mb-4 fw-light text-center display-6">
          <i class="bi bi-bag-check"></i> My Order History
        </h3>

        <!-- Date Filter -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-5">
                <label for="startDate" class="form-label text-brown">From Date</label>
                <input type="date" class="form-control" id="startDate" v-model="filters.startDate" @change="applyFilters">
              </div>
              <div class="col-md-5">
                <label for="endDate" class="form-label text-brown">To Date</label>
                <input type="date" class="form-control" id="endDate" v-model="filters.endDate" @change="applyFilters">
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-light w-100" @click="resetFilters">Reset</button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Orders Message -->
        <div class="card shadow-sm border-0 mb-4" v-if="filteredOrders.length === 0">
          <div class="card-body text-center p-5 text-muted">
            <i class="bi bi-bag-x fs-1"></i>
            <p class="mt-3">No orders found.</p>
            <button class="btn btn-light mt-2" @click="$router.push('/products')">Start Shopping</button>
          </div>
        </div>

        <!-- Order Cards -->
        <div v-for="(order, index) in filteredOrders" :key="index" class="card mb-3 shadow-sm border-0">
          <div class="card-header bg-transparent pt-3">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="fw-normal text-brown mb-0">Order #{{ index + 1 }}</h6>
              <span class="badge bg-soft-brown text-brown">{{ formatDate(order.date) }}</span>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="items-list mb-3">
              <div v-for="(item, i) in order.items" :key="i" class="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <div>
                  <span class="fw-medium">{{ item.product_name }}</span>
                  <span class="text-muted ms-2">× {{ item.quantity }}</span>
                </div>
                <span class="text-brown">₱{{ parseFloat(item.price).toFixed(2) }}</span>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold">Total: <span class="text-brown">₱{{ calculateTotal(order.items).toFixed(2) }}</span></span>
              <button class="btn btn-outline-brown px-4" @click="openOrderDetailModal(order, index)">
                <i class="bi bi-info-circle me-1"></i> View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div class="modal fade" id="orderDetailModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-light text-brown">Order #{{ selectedOrderIndex + 1 }} Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedOrder">
            <div class="p-4">
              <div class="text-center mb-4">
                <h4 class="fw-light text-uppercase mb-2">ORDER DETAILS</h4>
                <p class="mb-1 small">Order #{{ selectedOrderIndex + 1 }}</p>
                <p class="small text-muted">{{ formatDate(selectedOrder.date) }}</p>
                <div class="separator my-3 mx-auto"></div>
              </div>
              <h5 class="fw-light mb-3">Items</h5>
              <table class="table">
                <thead class="table-light">
                  <tr class="text-brown">
                    <th class="fw-medium">Item</th>
                    <th class="fw-medium">Qty</th>
                    <th class="text-end fw-medium">Price</th>
                    <th class="text-end fw-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in selectedOrder.items" :key="i">
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td class="text-end">₱{{ parseFloat(item.price).toFixed(2) }}</td>
                    <td class="text-end">₱{{ (item.price * item.quantity).toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end border-0">Subtotal</td>
                    <td class="text-end border-0 fw-bold">₱{{ calculateTotal(selectedOrder.items).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global bootstrap */
export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      selectedOrder: null,
      selectedOrderIndex: -1,
      filters: {
        startDate: null,
        endDate: null
      }
    }
  },
  mounted() {
    const stored = localStorage.getItem('orderHistory')
    this.orders = stored ? JSON.parse(stored) : []
    this.filteredOrders = [...this.orders]
  },
  methods: {
    openOrderDetailModal(order, index) {
      this.selectedOrder = order
      this.selectedOrderIndex = index
      const modalEl = document.getElementById('orderDetailModal')
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl)
        modal.show()
      }
    },
    calculateTotal(items) {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    },
    applyFilters() {
      const start = this.filters.startDate ? new Date(this.filters.startDate) : null
      const end = this.filters.endDate ? new Date(this.filters.endDate) : null
      if (end) end.setHours(23, 59, 59, 999)

      this.filteredOrders = this.orders.filter(order => {
        const orderDate = new Date(order.date)
        return (!start || orderDate >= start) && (!end || orderDate <= end)
      })
    },
    resetFilters() {
      this.filters.startDate = null
      this.filters.endDate = null
      this.filteredOrders = [...this.orders]
    }
  }
}
</script>

<style scoped>
.text-brown {
  color: #5D4037;
}
.bg-soft-brown {
  background-color: #F1E8E2;
}
.btn-outline-brown {
  color: #7D5A50;
  border-color: #7D5A50;
}
.btn-outline-brown:hover {
  background-color: #7D5A50;
  color: white;
}
.separator {
  height: 1px;
  width: 80%;
  background-color: #ddd;
}
</style>
