/* global bootstrap */
<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <h3 class="mb-4 fw-light text-center display-6">
            <i class="bi bi-receipt"></i> Transaction History
          </h3>
          
          <!-- Date Filter -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-5">
                  <div class="form-group">
                    <label for="startDate" class="form-label text-brown">From Date</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="startDate" 
                      v-model="filters.startDate" 
                      @change="applyFilters"
                    >
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="form-group">
                    <label for="endDate" class="form-label text-brown">To Date</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="endDate" 
                      v-model="filters.endDate" 
                      @change="applyFilters"
                    >
                  </div>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button 
                    class="btn btn-light w-100" 
                    @click="resetFilters"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card shadow-sm border-0 mb-4" v-if="filteredOrders.length === 0">
            <div class="card-body text-center p-5 text-muted">
              <i class="bi bi-inbox fs-1"></i>
              <p class="mt-3">No transactions found.</p>
            </div>
          </div>
          
          <div v-for="order in filteredOrders" :key="order.id" class="card mb-3 shadow-sm border-0">
            <div class="card-header bg-transparent border-bottom-0 pt-3">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="fw-normal text-brown mb-0">
                  Order #{{ order.id }}
                </h6>
                <div>
                  <span class="badge bg-soft-brown text-brown me-2">
                    {{ formatDate(order.date_ordered) }}
                  </span>
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="confirmDelete(order)"
                    title="Delete Transaction"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body pt-0">
              <p class="mb-3 fw-light"><span class="fw-semibold text-brown">Customer:</span> {{ order.customer_name }}</p>
              <div class="items-list mb-3">
                <div v-for="item in order.items" :key="item.id" class="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                  <div>
                    <span class="fw-medium">{{ item.product_name || 'Unknown Product' }}</span>
                    <span class="text-muted ms-2">× {{ item.quantity || 0 }}</span>
                  </div>
                  <span class="text-brown">₱{{ (item.price || 0).toFixed(2) }}</span>
                </div>
              </div>
              <div class="text-end">
                <button class="btn btn-outline-brown px-4" @click="openReceiptModal(order)">
                  <i class="bi bi-receipt me-1"></i> View Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Receipt Modal -->
      <div class="modal fade" id="receiptModal" tabindex="-1" aria-labelledby="receiptModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-light text-brown" id="receiptModalLabel">
                Receipt for Order #{{ selectedOrder?.id }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedOrder">
              <div class="receipt-container p-4">
                <div class="text-center mb-4">
                  <h4 class="fw-light text-uppercase mb-2">RECEIPT</h4>
                  <p class="mb-1 small">Order #{{ selectedOrder.id }}</p>
                  <p class="small text-muted">{{ formatDate(selectedOrder.date_ordered) }}</p>
                  <div class="separator my-3 mx-auto"></div>
                </div>
                
                <div class="customer-details mb-4 text-center">
                  <p class="mb-1"><span class="fw-light">Customer:</span> {{ selectedOrder.customer_name }}</p>
                </div>
                
                <table class="table table-borderless receipt-table">
                  <thead class="table-light">
                    <tr class="text-brown">
                      <th class="fw-medium">Item</th>
                      <th class="fw-medium">Qty</th>
                      <th class="text-end fw-medium">Price</th>
                      <th class="text-end fw-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedOrder.items" :key="item.id">
                      <td>{{ item.product_name || 'Unknown Product' }}</td>
                      <td>{{ item.quantity || 0 }}</td>
                      <td class="text-end">₱{{ (item.price || 0).toFixed(2) }}</td>
                      <td class="text-end">₱{{ ((item.price || 0) * (item.quantity || 0)).toFixed(2) }}</td>
                    </tr>
                    <tr class="border-top">
                      <td colspan="3" class="text-end"><strong>Total</strong></td>
                      <td class="text-end"><strong class="text-brown">₱{{ calculateTotal(selectedOrder.items).toFixed(2) }}</strong></td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="text-center mt-4">
                  <div class="separator my-3 mx-auto"></div>
                  <p class="fw-light fst-italic">Thank you for your purchase!</p>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-light text-danger" id="deleteModalLabel">
                Confirm Delete
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete Order #{{ orderToDelete?.id }}?</p>
              <p class="small text-muted">This action cannot be undone.</p>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="deleteOrder" :disabled="isDeleting">
                <span v-if="isDeleting">
                  <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Deleting...
                </span>
                <span v-else>
                  <i class="bi bi-trash me-1"></i> Delete
                </span>
              </button>
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
      orderToDelete: null,
      receiptModal: null,
      deleteModal: null,
      isDeleting: false,
      filters: {
        startDate: null,
        endDate: null
      }
    }
  },
  methods: {
    fetchAllOrders() {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      this.orders = savedOrders
      this.filteredOrders = [...savedOrders]
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(date)
    },
    openReceiptModal(order) {
      this.selectedOrder = order
      this.receiptModal.show()
    },
    confirmDelete(order) {
      this.orderToDelete = order
      this.deleteModal.show()
    },
    deleteOrder() {
      if (!this.orderToDelete) return
      this.isDeleting = true
      setTimeout(() => {
        this.orders = this.orders.filter(o => o.id !== this.orderToDelete.id)
        this.filteredOrders = this.filteredOrders.filter(o => o.id !== this.orderToDelete.id)
        localStorage.setItem('orders', JSON.stringify(this.orders))
        this.deleteModal.hide()
        this.orderToDelete = null
        this.isDeleting = false
        alert('Transaction deleted successfully')
      }, 500)
    },
    applyFilters() {
      if (!this.filters.startDate && !this.filters.endDate) {
        this.filteredOrders = [...this.orders]
        return
      }
      const start = this.filters.startDate ? new Date(this.filters.startDate) : null
      const end = this.filters.endDate ? new Date(this.filters.endDate) : null
      if (end) end.setHours(23, 59, 59, 999)
      this.filteredOrders = this.orders.filter(order => {
        const d = new Date(order.date_ordered)
        return (!start || d >= start) && (!end || d <= end)
      })
    },
    resetFilters() {
      this.filters.startDate = null
      this.filters.endDate = null
      this.filteredOrders = [...this.orders]
    },
    calculateTotal(items) {
      return items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    },
    initializeModal() {
      this.receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'))
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))
    }
  },
  mounted() {
    const isStaff = localStorage.getItem('is_staff') === 'true'
    if (!isStaff) {
      alert('Access denied')
      this.$router.push('/login')
      return
    }
    this.fetchAllOrders()
    this.$nextTick(() => this.initializeModal())
  }
}
</script>

  
  <style scoped>
  /* Brown and neutral color palette */
  :root {
    --primary-brown: #8B6E4E;
    --light-brown: #A68C69;
    --dark-brown: #6F563D;
    --soft-brown: #F2EAE1;
    --light-beige: #F9F6F2;
    --dark-beige: #E6DFD5;
  }
  
  .text-brown {
    color: var(--primary-brown);
  }
  
  .bg-brown {
    background-color: var(--primary-brown);
  }
  
  .bg-soft-brown {
    background-color: var(--soft-brown);
  }
  
  .btn-brown {
    background-color: var(--primary-brown);
    color: white;
    border: none;
    transition: all 0.3s ease;
  }
  
  .btn-brown:hover {
    background-color: var(--dark-brown);
    color: white;
  }
  
  .btn-outline-brown {
    color: var(--primary-brown);
    border-color: var(--primary-brown);
    background-color: transparent;
    transition: all 0.3s ease;
  }
  
  .btn-outline-brown:hover {
    background-color: var(--primary-brown);
    color: white;
  }
  
  /* Typography Enhancements */
  h3, h4, h5, h6 {
    font-family: 'Playfair Display', Georgia, serif;
  }
  
  body {
    font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
  }
  
  /* Receipt Styling */
  .receipt-container {
    font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
    border: 1px solid var(--dark-beige);
    border-radius: 8px;
    background-color: var(--light-beige);
  }
  
  .receipt-table th, .receipt-table td {
    padding: 0.75rem;
  }
  
  .separator {
    height: 1px;
    width: 70%;
    background-color: var(--dark-beige);
  }
  
  .card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: var(--light-beige);
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 110, 78, 0.1) !important;
  }
  
  /* Print Styles */
  @media print {
    body * {
      visibility: hidden;
    }
    .receipt-container, .receipt-container * {
      visibility: visible;
    }
    .receipt-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background-color: white !important;
    }
  }
  </style>