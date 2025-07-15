import { reactive } from 'vue'

// Create a reactive auth state object that can be shared across components
export const auth = reactive({
  // Determine if the user is logged in by checking for the presence of the 'access' token in localStorage
  isLoggedIn: !!localStorage.getItem('access'),

  // Determine if the user is a staff member based on the 'is_staff' flag stored in localStorage
  isStaff: localStorage.getItem('is_staff') === 'true',
})