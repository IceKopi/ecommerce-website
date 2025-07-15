import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomePage.vue' 
import UserLogin from '../views/UserLogin.vue'
import UserRegister from '../views/UserRegister.vue'
import ProductList from '../components/ProductList.vue'
import Cart from '../components/ShoppingCart.vue'
import OrderHistory from '../views/CustomerTransaction.vue'
import CheckoutMonitor from '../components/AdminProductManagement.vue'
import MonitorProducts from '../components/AdminProductInventory.vue'
import AddProduct from '../components/AddProduct.vue'
import AdminProductView from '../components/AdminProductView.vue'
import AdminTransactionHistory from '../components/AdminTransactionHistory.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/products', component: ProductList },
  { path: '/cart', component: Cart },
  { path: '/orders', component: OrderHistory },
  { path: '/monitor', component: CheckoutMonitor },
  { path: '/monitor-products', component: MonitorProducts },
  { path: '/add-product', component: AddProduct },
  { path: '/admin-product-view', component: AdminProductView },
  { path: '/admin-transaction-history', component: AdminTransactionHistory },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Updated Global navigation guard
router.beforeEach((to, from, next) => {
  const isStaffStored = localStorage.getItem('is_staff')
  const isLoggedIn = isStaffStored === 'true' || isStaffStored === 'false' // both mean logged in
  const isStaff = isStaffStored === 'true'

  const guestOnly = ['/login', '/register']
  const staffOnly = ['/monitor', '/monitor-products', '/add-product', '/admin-product-view', '/admin-transaction-history']
  const customerOnly = ['/products', '/cart', '/orders']

  // ✅ Not logged in: block access except public pages
  if (!isLoggedIn && !guestOnly.includes(to.path) && to.path !== '/') {
    return next('/login')
  }

  // ✅ Prevent logged-in users from going to login/register
  if (isLoggedIn && guestOnly.includes(to.path)) {
    return next(isStaff ? '/monitor' : '/products')
  }

  // ✅ Staff blocked from customer-only pages
  if (isLoggedIn && isStaff && customerOnly.includes(to.path)) {
    return next('/monitor')
  }

  // ✅ Customer blocked from staff-only pages
  if (isLoggedIn && !isStaff && staffOnly.includes(to.path)) {
    return next('/products')
  }

  // ✅ Allow all other routes
  next()
})

export default router
