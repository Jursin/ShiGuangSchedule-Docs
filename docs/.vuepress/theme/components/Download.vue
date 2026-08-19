<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

type DownloadSourceId = 'gitee.com' | 'github.com' | 'gh.dpik.top' | 'wget.la'

interface DownloadSource {
  id: DownloadSourceId
  description: string
}

const releases = ref<any[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const selectedDownloadSource = ref<DownloadSourceId>('gitee.com')
const copiedShaAssetId = ref<number | null>(null)
let copiedShaTimer: number | undefined

const downloadSources: DownloadSource[] = [
  { id: 'gitee.com', description: 'Gitee 镜像源' },
  { id: 'github.com', description: 'GitHub 官方源' },
  { id: 'gh.dpik.top', description: 'GitHub 镜像源' },
  { id: 'wget.la', description: 'GitHub 镜像源' }
]

function isGithubSource(sourceId: DownloadSourceId) {
  return sourceId === 'github.com' || sourceId === 'wget.la' || sourceId === 'gh.dpik.top'
}

// 取第一个 release
const currentRelease = computed(() => {
  if (!releases.value.length) return null
  return releases.value[0]
})

async function fetchLatestRelease() {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`https://api.github.com/repos/XingHeYuZhuan/shiguangschedule/releases?per_page=20`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ShiGuangSchedule-Docs/1.0'
      },
      signal: controller.signal
    })

    window.clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('releases 列表为空')
    }

    releases.value = data
  } catch (error) {
    console.error('获取最新版本失败:', error)
    hasError.value = true
    errorMessage.value = '可能是 GitHub API 访问较慢或服务异常，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 获取下载链接
function getProxyUrl(proxyHost: string, asset: any): string {
  return `https://${proxyHost}/${asset.browser_download_url}`
}

function getDownloadUrl(asset: any): string {
  const baseUrl = asset.browser_download_url
  if (selectedDownloadSource.value === 'gitee.com') {
    return baseUrl.replace(
      'https://github.com/XingHeYuZhuan/shiguangschedule',
      'https://gitee.com/XingHeYuZhuan-gh/shiguangschedule'
    )
  }
  if (selectedDownloadSource.value === 'github.com') {
    return baseUrl
  }
  return getProxyUrl(selectedDownloadSource.value, asset)
}

function getAssetSha256(asset: any): string {
  const digest = String(asset?.digest || '')
  if (!digest) return '未提供'
  return digest.replace(/^sha256:/i, '')
}

async function copyAssetSha256(asset: any) {
  const sha256 = getAssetSha256(asset)
  if (!sha256 || sha256 === '未提供') return

  const text = `sha256:${sha256}`
  await navigator.clipboard.writeText(text)

  copiedShaAssetId.value = asset.id
  if (copiedShaTimer) {
    window.clearTimeout(copiedShaTimer)
  }
  copiedShaTimer = window.setTimeout(() => {
    copiedShaAssetId.value = null
  }, 2000)
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 组件挂载时获取数据
onMounted(() => {
  fetchLatestRelease()
})
</script>

<template>
  <div class="download-container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在获取最新版本信息...</p>
    </div>

    <div v-else-if="hasError" class="error">
      <div class="error-content">
        <span class="error-icon"><Icon name="ic:round-warning" size="3rem" /></span>
        <h3>无法获取版本信息</h3>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" @click="fetchLatestRelease()">重新加载</button>
      </div>
    </div>

    <div v-else-if="currentRelease" class="release-info">
      <!-- 版本信息头部 -->
      <div class="release-header">
        <img src="/icon-prod.png" alt="拾光课程表" class="version-icon">
        <h1 class="title">下载拾光课程表</h1>
        <div class="release-title-row">
          <Icon name="octicon:tag-16" size="1.4em" />
          <span class="release-name">{{ currentRelease.name }}</span>
          <span class="release-date">{{ new Date(currentRelease.published_at).toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>

      <!-- 下载源选择 -->
      <div class="download-selector">
        <label class="selector-label">下载源</label>
        <div class="source-grid">
          <button v-for="source in downloadSources" :key="source.id" class="source-btn"
            :class="{ 'is-selected': selectedDownloadSource === source.id }"
            @click="selectedDownloadSource = source.id">
            <img v-if="isGithubSource(source.id)" src="/icons/github-dark.png" class="source-icon github-light">
            <img v-if="isGithubSource(source.id)" src="/icons/github-light.png" class="source-icon github-dark">
            <img v-else src="/icons/gitee.png" class="source-icon">
            <span class="source-info">
              <span class="source-name">{{ source.id }}</span>
              <span class="source-desc">{{ source.description }}</span>
            </span>
          </button>
        </div>
      </div>

      <!-- 下载文件列表 -->
      <div class="download-section">
        <h3>文件列表</h3>

        <div v-if="currentRelease.assets && currentRelease.assets.length > 0" class="assets-list">
          <div v-for="asset in currentRelease.assets" :key="asset.id" class="asset-item">
            <div class="asset-info">
              <div class="asset-header">
                <Icon name="octicon:package-16" />
                <h4 class="asset-name">{{ asset.name }}</h4>
              </div>
              <div class="asset-meta">
                <span class="download-count">{{ asset.download_count.toLocaleString() }} 次下载</span>
                <span class="asset-size">{{ formatFileSize(asset.size) }}</span>
                <span class="asset-sha-wrapper">
                  <span class="asset-sha" :title="`${getAssetSha256(asset)}`">sha256:{{ getAssetSha256(asset) }}</span>
                  <button type="button" class="sha-copy-button" @click="copyAssetSha256(asset)">
                    <Icon v-if="copiedShaAssetId === asset.id" name="octicon:check-16" color="#1a7f37" />
                    <Icon v-else name="octicon:copy-16" />
                  </button>
                </span>
              </div>
            </div>

            <div class="download-action">
              <a :href="getDownloadUrl(asset)" class="download-btn primary-btn" target="_blank"
                rel="noopener noreferrer">
                <Icon name="lucide:download" />
                <span class="btn-text">立即下载</span>
              </a>
            </div>
          </div>
        </div>

        <div v-else class="no-assets">
          <div class="no-assets-content">
            <h4>暂无下载文件</h4>
            <p>请稍后重试</p>
          </div>
        </div>

        <div class="view-release-history">
          <a href="https://github.com/XingHeYuZhuan/shiguangschedule/releases" target="_blank" rel="noopener noreferrer">
            查看历史版本
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-container {
  max-width: 1000px;
  margin: 36px auto;
  padding: 12px;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}

/* 加载状态 */
.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  color: var(--vp-c-text-2);
  margin: 0;
}

/* 错误状态 */
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-content p {
  color: var(--vp-c-text-2);
  margin: 0;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-warning-1);
}

.error-content h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background: var(--vp-c-brand-2);
  color: var(--vp-c-white);
  border: none;
  border-radius: 10px;
  box-shadow: var(--vp-shadow-2);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
}

/* 版本信息头部 */
.release-header {
  text-align: center;
}

.version-icon {
  width: 128px;
  height: 128px;
  display: block;
  margin: 0 auto;
}

.title {
  margin: 0.3em 0;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.release-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 22px;
}

.release-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.release-date {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.875rem;
  background: #83d0da50;
  color: var(--vp-c-text-1);
}

/* 下载源选择 */
.download-selector {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
}

.selector-label {
  display: block;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.source-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.source-btn:hover {
  border-color: var(--vp-c-brand-2);
}

.source-btn.is-selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.source-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

[data-theme="dark"] img.github-light {
  display: none;
}

[data-theme="light"] img.github-dark {
  display: none;
}

.source-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}

.source-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.source-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.2;
}

/* 下载文件列表 */
.download-section {
  margin-bottom: 24px;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.asset-item:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: var(--vp-shadow-2);
}

.asset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.asset-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.asset-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.asset-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.download-count,
.asset-size {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.asset-sha-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 1 auto;
  min-width: 0;
}

.asset-sha {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-family: "Monaspace Neon", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sha-copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.sha-copy-button:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.download-action {
  display: flex;
  align-items: center;
  margin-left: 20px;
  flex-shrink: 0;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background: var(--vp-c-brand-2);
  color: var(--vp-c-white);
  text-decoration: none;
  border-radius: 10px;
  box-shadow: var(--vp-shadow-2);
  transition: all 0.2s ease;
}

.download-btn:hover {
  background: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
  color: var(--vp-c-white);
}

/* 无文件状态 */
.no-assets {
  padding: 40px 20px;
  background: var(--vp-c-bg-soft);
  border: 2px dashed var(--vp-c-border);
  border-radius: 12px;
  text-align: center;
}

.no-assets-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-assets-content h4 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.view-release-history {
  margin-top: 16px;
  text-align: center;
}

.view-release-history a:hover {
  color: var(--vp-c-brand-1);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .download-container {
    padding: 16px;
  }

  .release-header {
    padding: 20px;
  }

  .release-name {
    font-size: 1.25rem;
  }

  .release-title-row {
    gap: 4px;
  }

  .download-selector {
    padding: 20px;
  }

  .source-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .asset-item {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .asset-header {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .asset-meta {
    flex-wrap: wrap;
    gap: 4px;
  }

  .asset-sha-wrapper {
    max-width: 100%;
  }

  .download-action {
    margin-left: 0;
  }

  .download-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
