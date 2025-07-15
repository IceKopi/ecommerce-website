<template>
  <div class="container mt-3">
    <h2 class="mb-4 text-brown-dark">My Shopping Cart</h2>

    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-brown-medium" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div
      v-else-if="!cartItems || cartItems.length === 0"
      class="text-center py-5 bg-beige rounded"
    >
      <i class="fas fa-shopping-cart fa-3x text-brown-light mb-3"></i>
      <h5 class="text-brown-medium">Your cart is empty</h5>
      <p class="text-brown-light">
        Add items from our collection to start shopping
      </p>
      <a href="/products" class="btn btn-outline-brown mt-2">Browse Products</a>
    </div>

    <div v-else>
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-beige py-3">
          <h5 class="mb-0 text-brown-dark">
            Cart Items ({{ cartItems.length }})
          </h5>
        </div>
        <ul class="list-group list-group-flush">
          <li
            v-for="item in cartItems"
            :key="item.id"
            class="list-group-item d-flex justify-content-between align-items-center py-3"
          >
            <div class="d-flex align-items-center">
              <div class="me-3">
                <button
                  @click="decreaseQuantity(item)"
                  class="btn btn-sm btn-outline-brown me-1"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="mx-2 text-brown-dark">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  class="btn btn-sm btn-outline-brown ms-1"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div>
                <h6 class="mb-0 text-brown-dark">
                  {{ item.product_name || item.name }}
                </h6>
                <small class="text-brown-light"
                  >₱{{ formatPrice(item.price) }} each</small
                >
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span class="text-brown-dark me-3 fw-bold"
                >₱{{ formatPrice(item.price * item.quantity) }}</span
              >
              <button
                @click="removeItem(item)"
                class="btn btn-sm btn-outline-danger"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>
        <div class="card-footer bg-beige py-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-brown-dark">Total:</h5>
            <h5 class="mb-0 text-brown-dark">₱{{ formatPrice(cartTotal) }}</h5>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <button @click="clearCart" class="btn btn-outline-brown">
          <i class="fas fa-trash me-2"></i>
          Clear Cart
        </button>
        <button @click="checkout" class="btn btn-white">
          <i class="fas fa-shopping-bag me-2"></i>
          Complete Purchase
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      isLoading: true,
    };
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0);
    },
  },
  mounted() {
    this.loadLocalCart();
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    loadLocalCart() {
      try {
        const stored = localStorage.getItem("cart");
        this.cartItems = stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error("Error loading cart from localStorage:", err);
        this.cartItems = [];
      } finally {
        this.isLoading = false;
      }
    },
    saveLocalCart() {
      try {
        localStorage.setItem("cart", JSON.stringify(this.cartItems));
      } catch (err) {
        console.error("Error saving cart to localStorage:", err);
      }
    },
    increaseQuantity(item) {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      const stockItem = products.find((p) => p.id === item.product);
      if (stockItem && item.quantity < stockItem.stock) {
        item.quantity += 1;
        this.saveLocalCart();
      } else {
        alert("You've reached the maximum available stock for this item.");
      }
    },
    decreaseQuantity(item) {
      if (item.quantity <= 1) {
        this.removeItem(item);
      } else {
        item.quantity -= 1;
        this.saveLocalCart();
      }
    },
    removeItem(item) {
      this.cartItems = this.cartItems.filter(
        (i) => i.product !== item.product && i.id !== item.id
      );
      this.saveLocalCart();
    },
    clearCart() {
      if (confirm("Are you sure you want to clear your cart?")) {
        this.cartItems = [];
        localStorage.removeItem("cart");
      }
    },
    checkout() {
      if (!this.cartItems.length) return;

      const order = {
        id: Date.now(),
        date: new Date(),
        items: this.cartItems,
      };

      // Load previous orders
      const prevOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];

      // Add new order to top
      prevOrders.unshift(order);

      // Save updated order history
      localStorage.setItem("orderHistory", JSON.stringify(prevOrders));

      // Clear cart
      this.cartItems = [];
      localStorage.removeItem("cart");

      alert("✅ Your order has been placed successfully!");

      // Optional: redirect to order view
      this.$router.push("/orders"); // Only if using Vue Router
    },
  },
};
</script>

<style scoped>
:root {
  --brown-dark: #5d4037;
  --brown-medium: #7d5a50;
  --brown-light: #a98274;
  --beige: #f5f5dc;
  --cream: #fffbeb;
  --accent: #8d6e63;
  --neutral-dark: #4e342e;
  --neutral-light: #d7ccc8;
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

.bg-beige {
  background-color: var(--beige);
}

.btn-brown {
  background-color: var(--brown-medium);
  color: white;
  border: none;
  transition: all 0.3s;
}

.btn-white {
  background-color: var(--brown-medium);
  color: rgb(30, 28, 28);
  border: 1px var(--brown-dark);
  transition: all 0.3s;
}

.btn-brown:hover:not(:disabled) {
  background-color: var(--brown-dark);
}

.btn-outline-brown {
  color: var(--brown-medium);
  border-color: var(--brown-medium);
  background-color: transparent;
  transition: all 0.3s;
}

.btn-outline-brown:hover:not(:disabled) {
  background-color: var(--brown-medium);
  color: rgb(92, 82, 82);
}

.card {
  border-radius: 8px;
  overflow: hidden;
}

.list-group-item {
  border-left: none;
  border-right: none;
}
</style>
