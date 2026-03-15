import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const Guide = defineCollection({
  type: 'doc',
  dir: 'guide',
  linkPrefix: 'guide',
  title: '指南',
  sidebar: [
    {
      text: '用户指南',
      icon: 'mdi:user-outline',
      prefix: 'user',
      items: [
        { text: '界面介绍', icon: 'mdi:cellphone', link: 'interface-introduction' },
        { text: '课表导入', icon: 'mdi:calendar-end-outline', link: 'schedule-import' },
        { text: '已适配学校', icon: 'boxicons:school', link: 'adapted-school' },
        { text: '添加课表/时间表', icon: 'mdi:table-edit', link: '/guide/user/add-table' },
        { text: '导出与分享', icon: 'mdi:export', link: 'export-and-share' },
        { text: '高级功能', icon: 'mdi:layers', link: '/guide/user/advanced' },
        { text: '个性化配置', icon: 'mdi:palette-outline', link: 'personalized-configuration' },
        { text: '手环版', icon: 'tabler:device-watch', link: '/guide/user/band-edition' }
      ]
    },
    {
      text: '开发指南',
      icon: 'mdi:code',
      prefix: 'developer',
      items: [
        { text: '应用开发', icon: 'mdi:android', link: 'app-dev' },
        { text: '小部件开发', icon: 'mdi:widgets-outline', link: 'widget-dev' },
        { text: '学校教务系统适配', icon: 'mdi:school-outline', link: 'school-adaptation' }
      ]
    }
  ]
})

const Faq = defineCollection({
  type: "post",
  dir: "faq",
  title: "常见问题",
  link: "/faq/",
  archives: false,
  categories: false
});

export default defineCollections([
  Guide,
  Faq
])
