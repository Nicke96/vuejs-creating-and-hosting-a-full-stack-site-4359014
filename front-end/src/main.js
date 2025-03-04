import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import * as VueRouter from "vue-router";
import ShoppingCartPage from "./pages/ShoppingCartPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDw4NBjik1EGWMoioYP0-foQn4ejQpNYOQ",

  authDomain: "vue-site-b0745.firebaseapp.com",

  projectId: "vue-site-b0745",

  storageBucket: "vue-site-b0745.firebasestorage.app",

  messagingSenderId: "696317744562",

  appId: "1:696317744562:web:550252634d6d75529940ab",
};

// Initialize Firebase

initializeApp(firebaseConfig);

createApp(App)
  .use(
    VueRouter.createRouter({
      history: VueRouter.createWebHistory(process.env.BASE_URL),
      routes: [
        {
          path: "/cart",
          component: ShoppingCartPage,
        },
        {
          path: "/products",
          component: ProductsPage,
        },
        {
          path: "/products/:productId",
          component: ProductDetailPage,
        },
        {
          path: "/",
          redirect: "/products",
        },
        {
          path: "/:pathMatch(.*)*",
          component: NotFoundPage,
        },
      ],
    })
  )
  .mount("#app");
