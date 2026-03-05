import { defineClientConfig } from 'vuepress/client'
import Layout from './theme/components/Layout.vue'
import Download from './theme/components/Download.vue'
import './theme/styles/var.css'
import './theme/styles/doc.css'
import './theme/styles/posts-container.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Download', Download)
  },
  layouts: {
    Layout,
  },
})
