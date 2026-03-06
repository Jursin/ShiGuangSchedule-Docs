<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface DeviceType {
  id: 'all' | 'arm64-v8a' | 'armeabi-v7a' | 'x86_64'
  name: string
  description: string
  patterns: string[]
}

type DownloadSourceId = 'gitee.com' | 'github.com' | 'gh-proxy.net' | 'gh-proxy.top'
type AppVersionTypeId = 'prod' | 'dev'

interface DownloadSource {
  id: DownloadSourceId
  name: string
  description: string
}

interface AppVersionType {
  id: AppVersionTypeId
  name: string
  description: string
}

const releases = ref<any[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const selectedAppVersionType = ref<AppVersionTypeId>('prod')
const selectedDeviceType = ref<'all' | 'arm64-v8a' | 'armeabi-v7a' | 'x86_64'>('all')
const selectedDownloadSource = ref<DownloadSourceId>('gitee.com')
const isAppVersionDropdownOpen = ref(false)
const isDeviceDropdownOpen = ref(false)
const isSourceDropdownOpen = ref(false)

const appVersionTypes: AppVersionType[] = [
  { id: 'prod', name: '正式版', description: '普通用户使用' },
  { id: 'dev', name: '开发者版', description: '开发者测试使用' }
]

const baseDeviceTypes: DeviceType[] = [
  {
    id: 'all',
    name: '全部',
    description: '显示所有架构文件',
    patterns: ['*']
  },
  {
    id: 'arm64-v8a',
    name: 'arm64-v8a',
    description: '64位 ARM 架构（推荐）',
    patterns: ['arm64-v8a']
  },
  {
    id: 'armeabi-v7a',
    name: 'armeabi-v7a',
    description: '32位 ARM 架构',
    patterns: ['armeabi-v7a']
  },
  {
    id: 'x86_64',
    name: 'x86_64',
    description: '64位 x86 架构',
    patterns: ['x86_64']
  }
]

const downloadSources: DownloadSource[] = [
  { id: 'gitee.com', name: 'gitee.com', description: 'Gitee 镜像源' },
  { id: 'github.com', name: 'github.com', description: 'GitHub 官方源' },
  { id: 'gh-proxy.net', name: 'gh-proxy.net', description: 'GitHub 镜像源' },
  { id: 'gh-proxy.top', name: 'gh-proxy.top', description: 'GitHub 镜像源' }
]

function isDeveloperReleaseTag(release: any): boolean {
  const tag = String(release?.tag_name || '').toLowerCase()
  const title = String(release?.name || '').toLowerCase()
  const text = `${tag} ${title}`
  return /(dev|alpha|beta|rc|preview|nightly|canary|test)/.test(text)
}

const currentRelease = computed(() => {
  if (!releases.value.length) return null
  const matcher = selectedAppVersionType.value === 'dev'
    ? (release: any) => isDeveloperReleaseTag(release)
    : (release: any) => !isDeveloperReleaseTag(release)

  return releases.value.find(matcher) || releases.value[0]
})

const currentAppVersionType = computed(() => {
  return appVersionTypes.find(type => type.id === selectedAppVersionType.value) || appVersionTypes[0]
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
    errorMessage.value = '无法获取版本信息，请检查网络连接或稍后重试'
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

// 根据设备类型过滤资源
const filteredAssets = computed(() => {
  if (!currentRelease.value?.assets) return []

  const assets = currentRelease.value.assets
  if (selectedDeviceType.value === 'all') return assets

  const currentType = baseDeviceTypes.find(type => type.id === selectedDeviceType.value)
  if (!currentType) return assets

  return assets.filter((asset: any) => {
    const fileName = asset.name.toLowerCase()
    return currentType.patterns.some(pattern => {
      if (pattern === '*') return true
      return fileName.includes(pattern.toLowerCase())
    })
  })
})

// 获取当前选择的下载源信息
const currentDownloadSource = computed(() => {
  return downloadSources.find(source => source.id === selectedDownloadSource.value) || downloadSources[0]
})

// 获取当前选择的设备类型信息
const currentDeviceType = computed(() => {
  const type = baseDeviceTypes.find(d => d.id === selectedDeviceType.value)
  return type || baseDeviceTypes[0]
})

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理下拉菜单的blur事件
const handleAppVersionDropdownBlur = () => setTimeout(() => isAppVersionDropdownOpen.value = false, 200)
const handleDeviceDropdownBlur = () => setTimeout(() => isDeviceDropdownOpen.value = false, 200)
const handleSourceDropdownBlur = () => setTimeout(() => isSourceDropdownOpen.value = false, 200)

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
        <span class="error-icon">⚠️</span>
        <h3>无法获取版本信息</h3>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" @click="fetchLatestRelease()">重新加载</button>
      </div>
    </div>

    <div v-else-if="currentRelease" class="release-info">
      <!-- 版本信息头部 -->
      <div class="release-header">
        <img :src="selectedAppVersionType === 'prod' ? '/icon-prod.png' : '/icon-dev.png'"
          :alt="selectedAppVersionType === 'prod' ? '正式版' : '开发者版'" class="version-icon">
        <div class="release-title-row">
          <span class="release-name">{{ currentRelease.name }}</span>
          <span class="release-date">{{ new Date(currentRelease.published_at).toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>

      <div class="download-selector">
        <div class="selector-controls">
          <!-- 应用版本选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">应用版本</label>
            <div class="dropdown" :class="{ 'is-open': isAppVersionDropdownOpen }">
              <button class="dropdown-trigger" @click="isAppVersionDropdownOpen = !isAppVersionDropdownOpen"
                @blur="handleAppVersionDropdownBlur">
                <span class="dropdown-content">
                  <span class="device-info">
                    <span class="device-name">{{ currentAppVersionType.name }}</span>
                    <span class="device-desc">{{ currentAppVersionType.description }}</span>
                  </span>
                </span>
                <Icon v-if="isAppVersionDropdownOpen" name="lucide:chevron-up" class="dropdown-arrow" />
                <Icon v-else name="lucide:chevron-down" class="dropdown-arrow" />
              </button>

              <div class="dropdown-menu">
                <button v-for="version in appVersionTypes" :key="version.id" class="dropdown-item"
                  :class="{ 'is-selected': selectedAppVersionType === version.id }"
                  @click="selectedAppVersionType = version.id; isAppVersionDropdownOpen = false">
                  <span class="device-info">
                    <span class="device-name">{{ version.name }}</span>
                    <span class="device-desc">{{ version.description }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- 设备类型选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">设备架构</label>
            <div class="dropdown" :class="{ 'is-open': isDeviceDropdownOpen }">
              <button class="dropdown-trigger" @click="isDeviceDropdownOpen = !isDeviceDropdownOpen"
                @blur="handleDeviceDropdownBlur">
                <span class="dropdown-content">
                  <span class="device-info">
                    <span class="device-name">{{ currentDeviceType.name }}</span>
                    <span class="device-desc">{{ currentDeviceType.description }}</span>
                  </span>
                </span>
                <Icon v-if="isDeviceDropdownOpen" name="lucide:chevron-up" class="dropdown-arrow" />
                <Icon v-else name="lucide:chevron-down" class="dropdown-arrow" />
              </button>

              <div class="dropdown-menu">
                <button v-for="device in baseDeviceTypes" :key="device.id" class="dropdown-item"
                  :class="{ 'is-selected': selectedDeviceType === device.id }"
                  @click="selectedDeviceType = device.id; isDeviceDropdownOpen = false">
                  <span class="device-info">
                    <span class="device-name">{{ device.name }}</span>
                    <span class="device-desc">{{ device.description }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- 下载源选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">下载源</label>
            <div class="dropdown" :class="{ 'is-open': isSourceDropdownOpen }">
              <button class="dropdown-trigger" @click="isSourceDropdownOpen = !isSourceDropdownOpen"
                @blur="handleSourceDropdownBlur">
                <span class="dropdown-content">
                  <span class="source-info">
                    <span class="source-name">{{ currentDownloadSource.name }}</span>
                    <span class="source-desc">{{ currentDownloadSource.description }}</span>
                  </span>
                </span>
                <Icon v-if="isSourceDropdownOpen" name="lucide:chevron-up" class="dropdown-arrow" />
                <Icon v-else name="lucide:chevron-down" class="dropdown-arrow" />
              </button>

              <div class="dropdown-menu">
                <button v-for="source in downloadSources" :key="source.id" class="dropdown-item" :class="{
                  'is-selected': selectedDownloadSource === source.id
                }" @click="selectedDownloadSource = source.id; isSourceDropdownOpen = false">
                  <span class="source-info">
                    <span class="source-name">{{ source.name }}</span>
                    <span class="source-desc">{{ source.description }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载文件列表 -->
      <div class="download-section">
        <h3>文件列表</h3>

        <div v-if="filteredAssets && filteredAssets.length > 0" class="assets-list">
          <div v-for="asset in filteredAssets" :key="asset.id" class="asset-item">
            <div class="asset-info">
              <div class="asset-header">
                <h4 class="asset-name">{{ asset.name }}</h4>
              </div>
              <div class="asset-meta">
                <span class="download-count">{{ asset.download_count.toLocaleString() }} 次下载</span>
                <span class="asset-size">{{ formatFileSize(asset.size) }}</span>
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
            <h4>暂无适用于 {{ currentDeviceType.name }} 的下载文件</h4>
            <p>请尝试选择其他设备类型</p>
          </div>
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
  font-size: 3rem;
  color: var(--vp-c-danger-1);
}

.error-content h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.retry-btn {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background: var(--vp-c-brand-2);
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

.release-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 22px auto;
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
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 下载选择器 */
.download-selector {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
}

.selector-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.dropdown-container {
  position: relative;
}

.dropdown-label {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover,
.dropdown.is-open .dropdown-trigger {
  border-color: var(--vp-c-brand-1);
}

.dropdown.is-open .dropdown-trigger {
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.dropdown-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.device-info,
.source-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.device-name,
.source-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.device-desc,
.source-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.2;
}

.dropdown-arrow {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  z-index: 50;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.2s ease;
}

.dropdown.is-open .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--vp-c-default-soft);
}

.dropdown-item.is-selected {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
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
}

.asset-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.asset-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.asset-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-count,
.asset-size {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.download-action {
  display: flex;
  align-items: center;
  margin-left: 20px;
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

  .selector-controls {
    grid-template-columns: 1fr;
  }

  .asset-item {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .asset-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
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
