import { defineThemeConfig } from 'vuepress-theme-plume'
import navbar from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/theme/
 */
export default defineThemeConfig({
  logo: '/logo.png',

  appearance: true,  // 配置 深色模式

  social: [
    { icon: 'github', link: 'https://github.com/XingHeYuZhuan/shiguangschedule' },
    { icon: 'qq', link: 'https://qm.qq.com/q/Ahm5AuJc0o' },
  ],
  navbarSocialInclude: ['github', 'qq'], // 允许显示在导航栏的 social 社交链接
  // aside: true, // 页内侧边栏， 默认显示在右侧
  // outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  // copyright: true,

  // prevPage: true,   // 是否启用上一页链接
  // nextPage: true,   // 是否启用下一页链接
  // createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  // footer: {
  //   message: 'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  //   copyright: '',
  // },

  navbar,
  collections: [
    {
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
            { text: '课表导入', icon: 'mdi:calendar-end-outline', link: 'schedule-import' },
            { text: '已适配学校', icon: 'boxicons:school', link: 'adapted-school' },
            { text: '添加课表/时间表', icon: 'mdi:table-edit', link: '/guide/user/add-table' },
            { text: '导出与分享', icon: 'mdi:export', link: 'export-and-share' },
            { text: '快捷操作', icon: 'mdi:lightning-bolt-outline', link: '/guide/user/quickactions' },
            { text: '课程提醒', icon: 'mdi:bell-outline', link: '/guide/user/course-notification' },
            { text: '个性化配置', icon: 'mdi:palette-outline', link: 'personalized-configuration' }
          ]
        },
        {
          text: '开发指南',
          icon: 'mdi:code',
          prefix: 'developer',
          items: [
            { text: '应用开发', icon: 'mdi:android', link: 'app-dev' },
            { text: '学校教务系统适配', icon: 'mdi:school-outline', link: 'school-adaptation' }
          ]
        }
      ]
    }
  ],

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/
   */
  // bulletin: {
  //   layout: 'top-right',
  //   contentType: 'markdown',
  //   title: '公告板标题',
  //   content: '公告板内容',
  // },

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/theme/#transition */
  transition: {
  //   page: true,        // 启用 页面间跳转过渡动画
  //   postList: true,    // 启用 博客文章列表过渡动画
    appearance: 'circle-clip',  // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  },

})
