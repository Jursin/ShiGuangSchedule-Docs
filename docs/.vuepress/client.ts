import { defineClientConfig } from 'vuepress/client'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
import Layout from './theme/components/Layout.vue'
import './theme/styles/var.css'
import './theme/styles/doc.css'
import './theme/styles/posts-container.css'

export default defineClientConfig({
  enhance({ app }) {
    // app.component('Swiper', Swiper)

    // app.component('CustomComponent', CustomComponent)
  },
  layouts: {
    Layout,
  },
})
