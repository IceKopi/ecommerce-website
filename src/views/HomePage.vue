<template>
  <div class="ecommerce-homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container container-transparent py-4 py-md-5">
        <div class="row align-items-center">
          <div class="col-lg-6 col-md-7 text-start text-md-start hero-content">
            <span class="badge bg-secondary mb-3 py-2 px-3">Exclusive Collection</span>
            <h1 class="display-4 fw-bold mb-3 hero-title">Welcome to Maisonova</h1>
            <p class="lead mb-4 fs-5">Starting from <span class="text-dark fw-bold">P129.00</span></p>
            <div class="d-flex flex-wrap gap-3">
              <button class="btn btn-dark px-4 py-2 py-md-3 fs-5">Shop Now</button>
              <button class="btn btn-outline-dark px-4 py-2 py-md-3 fs-5">View Collection</button>
            </div>
          </div>
          <div class="col-lg-6 col-md-5 mt-4 mt-md-0 text-center">
            <img :src="logo" alt="Wall Clock" class="img-fluid hero-image rounded" />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="categories-section py-5 bg-light">
      <div class="container">
        <div class="section-header mb-5 text-center">
          <h2 class="section-title fw-bold mb-3">Shop by Category</h2>
          <p class="section-subtitle text-muted">Discover our curated collections</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4 col-6" v-for="(category, index) in categories" :key="index">
            <div class="category-card card h-100 border-0 shadow-sm">
              <div class="card-img-top overflow-hidden">
                <img :src="category.image" class="img-fluid w-100" :alt="category.name" style="height: 200px; object-fit: cover;">
              </div>
              <div class="card-body text-center">
                <h5 class="card-title mb-0">{{ category.name }}</h5>
                <a href="#" class="stretched-link"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="products-section py-5">
      <div class="container">
        <div class="section-header mb-5 text-center">
          <h2 class="section-title fw-bold mb-3">Featured Products</h2>
          <p class="section-subtitle text-muted">Our most popular items</p>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-4 col-6" v-for="(product, index) in featuredProducts" :key="index">
            <div class="product-card card h-100 border-0 shadow-sm">
              <div class="badge bg-danger position-absolute mt-2 ms-2">Sale</div>
              <div class="card-img-top overflow-hidden position-relative">
                <img :src="product.image" class="img-fluid w-100" :alt="product.name" style="height: 200px; object-fit: cover;">
                <div class="product-actions position-absolute w-100 bottom-0 start-0 p-2 d-flex justify-content-center gap-2 bg-white bg-opacity-75">
                  <button class="btn btn-sm btn-outline-dark rounded-circle"><i class="bi bi-heart"></i></button>
                  <button class="btn btn-sm btn-outline-dark rounded-circle"><i class="bi bi-eye"></i></button>
                  <button class="btn btn-sm btn-dark rounded-circle"><i class="bi bi-cart"></i></button>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">{{ product.category }}</span>
                  <div class="text-warning small">
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-half"></i>
                  </div>
                </div>
                <h5 class="card-title mb-1">{{ product.name }}</h5>
                <div class="d-flex align-items-center gap-2">
                  <span class="text-dark fw-bold">P{{ product.price }}</span>
                  <span class="text-muted text-decoration-line-through small" v-if="product.originalPrice">P{{ product.originalPrice }}</span>
                  <span class="text-danger small ms-auto" v-if="product.discount">{{ product.discount }}% off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-5">
          <button class="btn btn-outline-dark px-4 py-2">View All Products</button>
        </div>
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="promo-banner py-5 bg-dark text-white">
      <div class="container py-4">
        <div class="row align-items-center">
          <div class="col-md-6 mb-4 mb-md-0">
            <h2 class="fw-bold mb-3">Summer Sale</h2>
            <p class="mb-4">Up to 50% off on selected items. Limited time offer!</p>
            <button class="btn btn-light px-4">Shop Sale</button>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-center justify-content-md-end">
              <div class="text-center me-3">
                <div class="time-block bg-white text-dark mb-2">
                  <div class="fw-bold fs-4">02</div>
                  <div class="small">Days</div>
                </div>
              </div>
              <div class="text-center me-3">
                <div class="time-block bg-white text-dark mb-2">
                  <div class="fw-bold fs-4">12</div>
                  <div class="small">Hours</div>
                </div>
              </div>
              <div class="text-center me-3">
                <div class="time-block bg-white text-dark mb-2">
                  <div class="fw-bold fs-4">45</div>
                  <div class="small">Mins</div>
                </div>
              </div>
              <div class="text-center">
                <div class="time-block bg-white text-dark mb-2">
                  <div class="fw-bold fs-4">30</div>
                  <div class="small">Secs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

<!-- Testimonials -->
<section class="testimonials-section py-5 bg-light">
  <div class="container">
    <div class="section-header mb-5 text-center">
      <h2 class="section-title fw-bold mb-3">What Our Customers Say</h2>
      <p class="section-subtitle text-muted">Real experiences from our happy clients</p>
    </div>

    <div class="row g-4">
      <div
        class="col-md-4"
        v-for="(testimonial, index) in testimonials"
        :key="index"
      >
        <div class="card border-0 shadow-sm h-100 text-center p-4 rounded-4">
          <!-- Star Ratings -->
          <div class="text-warning mb-3">
            <i
              v-for="n in 5"
              :key="n"
              class="bi"
              :class="n <= testimonial.rating ? 'bi-star-fill' : 'bi-star'"
            ></i>
          </div>

          <!-- Testimonial Text -->
          <p class="card-text fst-italic text-dark mb-4">
            “{{ testimonial.comment }}”
          </p>

          <!-- User Info -->
          <div class="d-flex align-items-center justify-content-center">
            <img
              :src="testimonial.avatar || 'https://via.placeholder.com/50'"
              class="rounded-circle me-3"
              width="50"
              height="50"
              :alt="testimonial.name"
              loading="lazy"
            />
            <div class="text-start">
              <h6 class="mb-0 fw-semibold">{{ testimonial.name }}</h6>
              <small class="text-muted">{{ testimonial.date }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


    <!-- Newsletter -->
    <section class="newsletter-section py-5 bg-white">
      <div class="container py-3">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8 text-center">
            <h2 class="fw-bold mb-3">Subscribe to Our Newsletter</h2>
            <p class="mb-4">Get updates on special offers and new products</p>
            <form class="d-flex">
              <input type="email" class="form-control rounded-0" placeholder="Your email address">
              <button class="btn btn-dark rounded-0 px-4" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <h5 class="fw-bold mb-4">About Us</h5>
            <p class="small">We provide high-quality home decor items that elevate your living space with style and functionality.</p>
            <div class="social-icons mt-4">
              <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-white me-3"><i class="bi bi-twitter"></i></a>
              <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
              <a href="#" class="text-white"><i class="bi bi-pinterest"></i></a>
            </div>
          </div>
          <div class="col-lg-2 col-md-6">
            <h5 class="fw-bold mb-4">Shop</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">All Products</a></li>
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">Featured</a></li>
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">New Arrivals</a></li>
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">Sale Items</a></li>
              <li><a href="#" class="text-white text-decoration-none small">Gift Cards</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6">
            <h5 class="fw-bold mb-4">Customer Service</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">Contact Us</a></li>
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">FAQs</a></li>
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">Shipping Policy</a></li>
              <li class="mb-2"><a href="#" class="text-white text-decoration-none small">Returns & Exchanges</a></li>
              <li><a href="#" class="text-white text-decoration-none small">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h5 class="fw-bold mb-4">Contact Info</h5>
            <ul class="list-unstyled small">
              <li class="mb-3 d-flex align-items-start">
                <i class="bi bi-geo-alt-fill me-2 mt-1"></i>
                <span>123 Main Street, Metro Manila, Philippines</span>
              </li>
              <li class="mb-3 d-flex align-items-center">
                <i class="bi bi-telephone-fill me-2"></i>
                <span>+63 912 345 6789</span>
              </li>
              <li class="d-flex align-items-center">
                <i class="bi bi-envelope-fill me-2"></i>
                <span>info@yourstore.com</span>
              </li>
            </ul>
          </div>
        </div>
        <hr class="my-4 bg-secondary">
        <div class="row">
          <div class="col-md-6 text-center text-md-start">
            <p class="small mb-0">© 2023 Your Store. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <img src="https://via.placeholder.com/200x30/f8f9fa/212529?text=Payment+Methods" alt="Payment Methods" class="img-fluid">
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import wallClockImage from '@/assets/clock.png'
import barCounterImage from '@/assets/bar counter.png'
import cabinetImage from '@/assets/cabinet5.png'
import couch1Image from '@/assets/couch4.png'
import mirrorImage from '@/assets/mirror43.png'
import logo from '@/assets/logo.png'
import profile_1 from '@/assets/profile_1.png'
import profile_2 from '@/assets/profile_2.png'
import profile_3 from '@/assets/profile_3.png'


export default {
  name: 'EcommerceHomepage',
  data() {
    return {
      categories: [
        { name: 'Wall Clocks', image: wallClockImage },
        { name: 'Home Decor', image: cabinetImage },
        { name: 'Lighting', image: barCounterImage }
      ],
      featuredProducts: [
        { 
          name: 'Vintage Couch', 
          category: 'Wall Clocks', 
          price: '129.00', 
          originalPrice: '159.00', 
          discount: '20', 
          image: wallClockImage 
        },
        { 
          name: 'Modern Beige Sofa', 
          category: 'Lighting', 
          price: '89.00', 
          image: couch1Image
        },
        { 
          name: 'Elegant Vanity Mirror', 
          category: 'Home Decor', 
          price: '45.00', 
          originalPrice: '59.00', 
          discount: '25', 
          image: mirrorImage
        },
        { 
          name: 'Bar Counter Set', 
          category: 'Home Decor', 
          price: '199.00', 
          image: barCounterImage
        }
      ],
      testimonials: [
        {
          name: 'Maria Santos',
          comment: 'The wall clock I purchased is even more beautiful in person. Excellent quality and fast delivery!',
          date: 'May 15, 2023',
          avatar: profile_1
        },
        {
          name: 'Juan Dela Cruz',
          comment: 'Great customer service when I had questions about my order. Products are exactly as described.',
          date: 'April 28, 2023',
          avatar: profile_2
        },
        {
          name: 'Anna Reyes',
          comment: 'Love my new home decor items! The packaging was secure and arrived earlier than expected.',
          date: 'June 2, 2023',
          avatar: profile_3
        }
      ],
       logo
    }
  },
  mounted() {
    // Initialize Owl Carousel if needed
    if (typeof $ !== 'undefined') {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 2
          },
          992: {
            items: 3
          }
        }
      });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

.ecommerce-homepage {
  font-family: 'Montserrat', sans-serif;
}

/* Hero Section */
.hero-section {
  background-color: #f9f6f0;
  background-size: cover;
  background-position: center;
  position: relative;
  min-height: 90vh;
  width: 100%;
  display: flex;
  align-items: center;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-section > .container {
  position: relative;
  z-index: 1;
}

.container-transparent {
  background: transparent !important;
}

.hero-content {
  background: transparent !important;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: -0.5px;
  font-size: 3.5rem;
  color: #2c2a29;
}

.hero-image {
  max-height: 500px;
  object-fit: contain;
}

/* Badge */
.badge {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  background-color: #d4c9be !important;
  color: #2c2a29;
}

/* Buttons */
.btn {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 0;
  transition: all 0.3s ease;
}

.btn-dark {
  background-color: #2c2a29;
  border: 1px solid #2c2a29;
  color: white;
}

.btn-dark:hover {
  background-color: transparent;
  color: #2c2a29;
}

.btn-outline-dark {
  border: 1px solid #2c2a29;
  color: #2c2a29;
}

.btn-outline-dark:hover {
  background-color: #2c2a29;
  color: white;
}

/* Section Titles */
.section-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #2c2a29;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: #d4c9be;
}

.section-subtitle {
  font-size: 1.1rem;
}

/* Product Cards */
.product-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.product-actions {
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions {
  transform: translateY(0);
}

/* Category Cards */
.category-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}

/* Promo Banner */
.promo-banner {
  background-color: #2c2a29;
  background-size: cover;
  background-position: center;
  position: relative;
}

.time-block {
  background-color: #ffffff;
  border-radius: 0;
  padding: 15px 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  min-width: 80px;
  border: 1px solid #d4c9be;
}

/* Newsletter Form */
.form-control {
  border-radius: 0;
  border: 1px solid #2c2a29;
}

/* Footer */
.footer a {
  transition: all 0.3s ease;
}

.footer a:hover {
  color: #d4c9be !important;
  text-decoration: underline !important;
}

.social-icons a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-icons a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* Responsive Adjustments */
@media (max-width: 1199.98px) {
  .hero-title {
    font-size: 3rem;
  }
}

@media (max-width: 991.98px) {
  .hero-section {
    min-height: auto;
    padding: 80px 0;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 767.98px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-content {
    text-align: center !important;
  }
  
  .hero-buttons {
    justify-content: center !important;
  }
  
  .time-block {
    padding: 10px 15px;
    min-width: 70px;
  }
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .featured-products .col-6 {
    width: 100%;
  }
  
  .promo-banner .col-md-6 {
    text-align: center !important;
  }
  
  .promo-banner .d-flex {
    justify-content: center !important;
  }
}
</style>