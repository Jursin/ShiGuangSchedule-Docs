import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '用户指南', link: '/user-guide/' },
  { text: '开发指南', link: '/develop-guide/' },
  { text: '常见问题', link: '/faq/' },
  { text: '更新日志', link: '/changelog' }
])
