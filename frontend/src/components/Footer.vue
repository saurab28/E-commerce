<script setup>
import openTheApp from '@/assets/opentheapp2.png'
import placeOrder from '@/assets/placeorder2.png'
import freeDelivery from '@/assets/getfreedelivery2.png'
import {ref} from 'vue'
import getit from '@/assets/getit.png'
const categoryList = ref([
   "Fruits & Vegetables",
   "Cold Drinks & Juices",
   "Beverages",
   "Foodgrains, Oil & Masala",
   "Bakery, Cakes & Dairy",
   "Snacks & Branded Foods",
   "Eggs, Meat & Fish",
   "Gourmet & World Food",
   "Baby Care",
   "Cleaning & Household",
   "Beauty & Hygiene",
   "Kitchen, Garden & Pets",
   "Chocolates & Candies",
   "Dry Fruits",
   "Indian Mithai",
])
</script>

<template>
<footer class="footer-root">
  
  <div class="footer-main">
    <div class="container">
      <div class="footer-cols">
        <div class="footer-col">
          <h4 class="footer-heading">Categories</h4>
          <ul>
            <li v-for="category in categoryList">
              <RouterLink :to="{ name: 'products', params: { title: category } }">
                    {{ category }}
              </RouterLink>
            </li>
            
          </ul>
        </div>
        <div class="footer-col">
          <h4> </h4>
          <ul>
            <li>Home</li>
            <li>Delivery Areas</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Mojo - a Pickzy Blog</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4> </h4>
          <ul>
            <li>Responsible Disclosure Policy</li>
            <li>Sell on Pickzy</li>
            <li>Deliver with Pickzy</li>
            <li>Franchise with Pickzy</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Customer Care</h4>
          <ul>
            <li>My Account</li>
            <li>My Orders</li>
            <li>My Wishlist</li>
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div class="footer-col app-download-col">
          <h4 class="footer-heading app-download-heading">Download App</h4>
          <div class="footer-download-btns app-download-align">
            <a href="#" target="_blank" class="store-badge-link">
              <img :src="getit" alt="Get it on App Store and Play Store" class="store-badge" />
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom-row">
        <div class="logo-social">
          <div class="pickzy-logo">Pickzy</div>
          <div class="footer-social">
            <a href="https://www.instagram.com/pickzy.store/" target="_blank" aria-label="Instagram" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/PickzyStore" target="_blank" aria-label="Twitter" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" aria-label="Facebook" class="social-link">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="https://www.linkedin.com/company/109083929" target="_blank" aria-label="LinkedIn" class="social-link">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div class="footer-copyright">
          © Pickzy Marketplace Private Limited<br />
          fssai lic no : 11224999000872
        </div>
      </div>
    </div>
  </div>
</footer>
</template>

<style scoped>
.footer-root {
  background: #fff;
  border-top: 2px solid #eee;
  color: #222;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top:30px;
}
.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 32px;
  box-sizing: border-box;
}
.how-it-works {
  padding: 60px 0 40px 0;
  text-align: center;
}
.how-it-works h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #1a1a1a;
}
.how-it-works-cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.how-card {
  background: #fafafa;
  border-radius: 16px;
  box-shadow: 0 2px 8px #0000000a;
  padding: 30px 20px;
  max-width: 320px;
  min-width: 220px;
  flex: 1 1 220px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.how-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px #00000019;
}
.how-card .how-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 18px auto;
  display: block;
  object-fit: contain;
}
.how-card h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1a1a1a;
}
.how-card p {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}
.footer-main {
  border-top: 1px solid #eee;
  padding: 40px 0 10px 0;
}
.footer-cols {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 46px;
  margin-bottom: 30px;
  align-items: flex-start;
  width: 100%;
}
.footer-heading {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  letter-spacing: 0.1px;
}
.app-download-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.app-download-heading {
  margin: 0 0 10px 0;
  padding: 0;
  text-align: left;
}
.footer-download-btns,
.app-download-align {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  padding: 0;
}
.store-badge-link {
  display: block;
  margin: 0;
  padding: 0;
}
.store-badge {
  width: 170px;
  height: auto;
  display: block;
  margin: 0;
  padding: 0;
  object-fit: contain;
  transition: transform 0.2s;
}
.store-badge:hover {
  transform: scale(1.04);
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-col ul li {
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 9px;
  cursor: pointer;
  color: #333;
  line-height: 1.3;
}
.footer-col ul li:hover {
  color: #e44258;
}
.footer-bottom-row {
  padding: 28px 0 16px 0;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}
.logo-social {
  display: flex;
  align-items: center;
  gap: 16px;
}
.pickzy-logo {
  font-size: 26px;
  font-weight: 700;
  color: #e44258;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.5px;
}
.footer-social {
  display: flex;
  align-items: center;
  gap: 16px;
}
.social-link i {
  font-size: 18px;
  color: #999;
  transition: color 0.2s ease, transform 0.2s ease;
}
.social-link:hover i {
  color: #e44258;
  transform: scale(1.2);
}
.footer-copyright {
  color: #999;
  font-size: 12px;
  text-align: right;
  line-height: 1.5;
  margin-left: auto;
}
@media (min-width: 1000px) {
  .container { max-width: 1180px; padding: 0 48px; }
}
@media (max-width: 700px) {
  .container { max-width: 100vw; padding: 0 16px; }
}
@media (max-width: 1200px) {
  .footer-cols { gap: 28px; }
}
@media (max-width: 900px) {
  .footer-cols { grid-template-columns: 1fr 1fr; gap: 18px; }
}
@media (max-width: 600px) {
  .footer-cols { grid-template-columns: 1fr; gap: 12px; }
  .footer-bottom-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .footer-heading { font-size: 15px; }
}
@media (min-width: 1400px) {
  .container { max-width: 1400px; padding: 0 96px; }
}
</style>
