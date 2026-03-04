import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const UserGuide = defineCollection({
  type: 'doc',
  // 文档集合所在目录，相对于 `docs`
  dir: 'user-guide',
  // `dir` 所指向的目录中的所有 markdown 文件，其 permalink 需要以 `linkPrefix` 配置作为前缀
  // 如果 前缀不一致，则无法生成侧边栏。
  // 所以请确保  markdown 文件的 permalink 都以 `linkPrefix` 开头
  linkPrefix: '/user-guide',
  title: '用户指南',
  sidebar: 'auto',
})

const DevelopGuide = defineCollection({
  type: 'doc',
  // 文档集合所在目录，相对于 `docs`
  dir: 'develop-guide',
  // `dir` 所指向的目录中的所有 markdown 文件，其 permalink 需要以 `linkPrefix` 配置作为前缀
  // 如果 前缀不一致，则无法生成侧边栏。
  // 所以请确保  markdown 文件的 permalink 都以 `linkPrefix` 开头
  linkPrefix: '/develop-guide',
  title: '开发指南',
  sidebar: 'auto',
})

const Faq = defineCollection({
  type: "post",
  dir: "faq",
  title: "常见问题",
  link: "/faq/",
  //   linkPrefix: '/article/', // 相关文章的链接前缀
  //   postList: true, // 是否启用文章列表页
  //   tags: true, // 是否启用标签页
  archives: false, // 是否启用归档页
  categories: false, // 是否启用分类页
  //   postCover: 'right', // 文章封面位置
  //   pagination: 15, // 每页显示文章数量
});

/**
 * 导出所有的 collections
 */
export default defineCollections([
  UserGuide,
  DevelopGuide,
  Faq
])
