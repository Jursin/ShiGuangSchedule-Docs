import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', icon: 'material-symbols:home-outline-rounded', link: '/' },
  {
    text: '指南',
    icon: 'ep:guide',
    items: [
      { text: '用户指南',
        icon: 'mdi:user-outline',
        items: [
          { text: '界面介绍', icon: 'mdi:cellphone', link: '/guide/user/interface-introduction' },
          { text: '课表导入', icon: 'mdi:calendar-end-outline', link: '/guide/user/schedule-import' },
          { text: '已适配学校', icon: 'boxicons:school', link: '/guide/user/adapted-school' },
          { text: '添加课表/时间表', icon: 'mdi:table-edit', link: '/guide/user/add-table' },
          { text: '导出与分享', icon: 'mdi:export', link: '/guide/user/export-and-share' },
          { text: '高级功能', icon: 'mdi:layers', link: '/guide/user/advanced' },
          { text: '个性化配置', icon: 'mdi:palette-outline', link: '/guide/user/personalized-configuration' }
        ]
      },
      { text: '开发指南',
        icon: 'mdi:code',
        items: [
          { text: '应用开发', icon: 'mdi:android', link: '/guide/developer/app-dev' },
          { text: '小部件开发', icon: 'mdi:widgets-outline', link: '/guide/developer/widget-dev' },
          { text: '学校教务系统适配', icon: 'mdi:school-outline', link: '/guide/developer/school-adaptation' }
        ]
      }
    ]
  },
  { text: '常见问题', icon: 'mingcute:question-line', link: '/faq/' },
  { text: '更新日志', icon: 'material-symbols:history-rounded', link: '/changelog' },
  { text: '关于', icon: 'material-symbols:info-outline-rounded', link: '/about' }
])
