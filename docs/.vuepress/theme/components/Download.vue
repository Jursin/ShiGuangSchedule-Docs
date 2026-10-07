<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

type OsId = 'android' | 'windows' | 'macos' | 'linux'
type DownloadSourceId = 'gitee.com' | 'github.com' | 'gh.dpik.top' | 'wget.la'

interface OsType {
  id: OsId
  name: string
  description: string
  icon: string
  match: (fileName: string) => boolean
}

interface ArchType {
  id: string
  name: string
  description: string
}

interface DownloadSource {
  id: DownloadSourceId
  description: string
}

const releases = ref<any[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const selectedOs = ref<OsId>('android')
const selectedArch = ref('all')
const selectedDownloadSource = ref<DownloadSourceId>('gitee.com')
const isOsDropdownOpen = ref(false)
const isArchDropdownOpen = ref(false)
const isSourceDropdownOpen = ref(false)
const isUsingGiteeFallback = ref(false)
const copiedShaAssetId = ref<string | number | null>(null)
let copiedShaTimer: number | undefined

const osTypes: OsType[] = [
  { id: 'android', name: 'Android', description: 'apk 安装包', icon: 'devicon:android', match: file => file.endsWith('.apk') },
  { id: 'windows', name: 'Windows', description: 'exe/msi 安装包', icon: 'logos:microsoft-windows-icon', match: file => file.includes('windows-') },
  { id: 'macos', name: 'macOS', description: 'dmg/pkg 安装包', icon: 'devicon:apple', match: file => file.includes('macos-') },
  { id: 'linux', name: 'Linux', description: 'deb/rpm 安装包', icon: 'devicon:linux', match: file => file.includes('linux-') }
]

const ALL_ARCHS: ArchType = { id: 'all', name: '全部架构', description: '该系统全部文件' }

const desktopArchs: ArchType[] = [ALL_ARCHS, { id: 'x64', name: 'x64', description: '64位 Intel/AMD' }]

const archTypes: Record<OsId, ArchType[]> = {
  android: [
    ALL_ARCHS,
    { id: 'arm64-v8a', name: 'arm64-v8a', description: '64位 ARM（推荐）' },
    { id: 'armeabi-v7a', name: 'armeabi-v7a', description: '32位 ARM' },
    { id: 'x86_64', name: 'x86_64', description: '64位 x86' }
  ],
  windows: desktopArchs,
  macos: [ALL_ARCHS, { id: 'arm64', name: 'arm64', description: 'Apple Silicon' }],
  linux: desktopArchs
}

const githubDownloadSources: DownloadSource[] = [
  { id: 'gitee.com', description: 'Gitee 镜像源' },
  { id: 'github.com', description: 'GitHub 官方源' },
  { id: 'gh.dpik.top', description: 'GitHub 镜像源' },
  { id: 'wget.la', description: 'GitHub 镜像源' }
]

const downloadSources = computed(() =>
  isUsingGiteeFallback.value ? githubDownloadSources.slice(0, 1) : githubDownloadSources
)

function isGithubSource(sourceId: DownloadSourceId) {
  return sourceId === 'github.com' || sourceId === 'wget.la' || sourceId === 'gh.dpik.top'
}

// 取第一个 release
const currentRelease = computed(() => releases.value[0] || null)

const currentOs = computed(() => osTypes.find(os => os.id === selectedOs.value)!)
const archList = computed(() => archTypes[selectedOs.value])
const currentArch = computed(() => archList.value.find(arch => arch.id === selectedArch.value) as ArchType)
const currentDownloadSource = computed(() => downloadSources.value.find(s => s.id === selectedDownloadSource.value)!)

function selectOs(id: OsId) {
  selectedOs.value = id
  selectedArch.value = 'all'
  isOsDropdownOpen.value = false
}

async function fetchLatestRelease() {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''
  isUsingGiteeFallback.value = false

  try {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`https://api.github.com/repos/ShiGuangSchedule/shiguangschedule/releases?per_page=20`, {
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
    console.warn('GitHub API 获取失败，尝试使用 Gitee API:', error)

    try {
      const response = await fetch(
        'https://gitee.com/api/v5/repos/XingHeYuZhuan-gh/shiguangschedule/releases/latest'
      )
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const release = await response.json()
      if (!release || typeof release !== 'object') {
        throw new Error('latest release 响应为空')
      }

      releases.value = [{
        ...release,
        published_at: release.published_at || release.created_at,
        assets: (release.assets || [])
          .filter((asset: Record<string, unknown>) =>
            !String(asset.browser_download_url || '').includes('/archive/refs/tags/')
          )
          .map((asset: Record<string, unknown>) => ({
            ...asset,
            id: asset.id || asset.name
          }))
      }]
      isUsingGiteeFallback.value = true
      selectedDownloadSource.value = 'gitee.com'
    } catch (giteeError) {
      console.error('GitHub 和 Gitee API 获取均失败:', giteeError)
      hasError.value = true
      errorMessage.value = '可能是 GitHub 或 Gitee API 访问较慢或服务异常，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

// 获取下载链接
function getDownloadUrl(asset: any): string {
  const baseUrl = asset.browser_download_url
  if (selectedDownloadSource.value === 'gitee.com') {
    return baseUrl.replace(
      'https://github.com/ShiGuangSchedule/shiguangschedule',
      'https://gitee.com/XingHeYuZhuan-gh/shiguangschedule'
    )
  }
  if (selectedDownloadSource.value === 'github.com') {
    return baseUrl
  }
  return `https://${selectedDownloadSource.value}/${baseUrl}`
}

function getAssetSha256(asset: any): string {
  const digest = String(asset?.digest || '')
  return digest ? digest.replace(/^sha256:/i, '') : '未提供'
}

async function copyAssetSha256(asset: any) {
  const sha256 = getAssetSha256(asset)
  if (sha256 === '未提供') return

  await navigator.clipboard.writeText(`sha256:${sha256}`)

  copiedShaAssetId.value = asset.id
  if (copiedShaTimer) window.clearTimeout(copiedShaTimer)
  copiedShaTimer = window.setTimeout(() => {
    copiedShaAssetId.value = null
  }, 2000)
}

// 按操作系统与架构过滤资源
const filteredAssets = computed(() => {
  const os = currentOs.value
  const arch = selectedArch.value

  return (currentRelease.value?.assets || []).filter((asset: any) => {
    const file = String(asset.name || '').toLowerCase()
    return os.match(file) && (arch === 'all' || file.includes(arch))
  })
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
const handleOsDropdownBlur = () => setTimeout(() => isOsDropdownOpen.value = false, 200)
const handleArchDropdownBlur = () => setTimeout(() => isArchDropdownOpen.value = false, 200)
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

      <!-- 下载选择器 -->
      <div class="download-selector">
        <div class="selector-controls">
          <!-- 操作系统选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">操作系统</label>
            <div class="dropdown" :class="{ 'is-open': isOsDropdownOpen }">
              <button class="dropdown-trigger" @click="isOsDropdownOpen = !isOsDropdownOpen"
                @blur="handleOsDropdownBlur">
                <span class="dropdown-content">
                  <Icon :key="currentOs.icon" :name="currentOs.icon" size="1.5em" class="os-icon" />
                  <span class="option-info">
                    <span class="option-name">{{ currentOs.name }}</span>
                    <span class="option-desc">{{ currentOs.description }}</span>
                  </span>
                </span>
                <Icon v-if="isOsDropdownOpen" name="lucide:chevron-up" class="dropdown-arrow" />
                <Icon v-else name="lucide:chevron-down" class="dropdown-arrow" />
              </button>

              <div class="dropdown-menu">
                <button v-for="os in osTypes" :key="os.id" class="dropdown-item"
                  :class="{ 'is-selected': selectedOs === os.id }"
                  @click="selectOs(os.id)">
                  <Icon :name="os.icon" size="1.5em" class="os-icon" />
                  <span class="option-info">
                    <span class="option-name">{{ os.name }}</span>
                    <span class="option-desc">{{ os.description }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- 设备架构选择器 -->
          <div class="dropdown-container">
            <label class="dropdown-label">设备架构</label>
            <div class="dropdown" :class="{ 'is-open': isArchDropdownOpen }">
              <button class="dropdown-trigger" @click="isArchDropdownOpen = !isArchDropdownOpen"
                @blur="handleArchDropdownBlur">
                <span class="dropdown-content">
                  <span class="option-info">
                    <span class="option-name">{{ currentArch.name }}</span>
                    <span class="option-desc">{{ currentArch.description }}</span>
                  </span>
                </span>
                <Icon v-if="isArchDropdownOpen" name="lucide:chevron-up" class="dropdown-arrow" />
                <Icon v-else name="lucide:chevron-down" class="dropdown-arrow" />
              </button>

              <div class="dropdown-menu">
                <button v-for="arch in archList" :key="arch.id" class="dropdown-item"
                  :class="{ 'is-selected': selectedArch === arch.id }"
                  @click="selectedArch = arch.id; isArchDropdownOpen = false">
                  <span class="option-info">
                    <span class="option-name">{{ arch.name }}</span>
                    <span class="option-desc">{{ arch.description }}</span>
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
                  <img v-if="isGithubSource(currentDownloadSource.id)" src="/icons/github-dark.png"
                    class="source-icon github-light">
                  <img v-if="isGithubSource(currentDownloadSource.id)" src="/icons/github-light.png"
                    class="source-icon github-dark">
                  <img v-else src="/icons/gitee.png" class="source-icon">
                  <span class="option-info">
                    <span class="option-name">{{ currentDownloadSource.id }}</span>
                    <span class="option-desc">{{ currentDownloadSource.description }}</span>
                  </span>
                </span>
                <Icon v-if="isSourceDropdownOpen" name="lucide:chevron-up" class="dropdown-arrow" />
                <Icon v-else name="lucide:chevron-down" class="dropdown-arrow" />
              </button>

              <div class="dropdown-menu">
                <button v-for="source in downloadSources" :key="source.id" class="dropdown-item"
                  :class="{ 'is-selected': selectedDownloadSource === source.id }"
                  @click="selectedDownloadSource = source.id; isSourceDropdownOpen = false">
                  <img v-if="isGithubSource(source.id)" src="/icons/github-dark.png" class="source-icon github-light">
                  <img v-if="isGithubSource(source.id)" src="/icons/github-light.png" class="source-icon github-dark">
                  <img v-else src="/icons/gitee.png" class="source-icon">
                  <span class="option-info">
                    <span class="option-name">{{ source.id }}</span>
                    <span class="option-desc">{{ source.description }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载文件列表 -->
      <div class="download-section">
        <h3 style="margin-bottom: 1rem; font-weight: 600;">文件列表</h3>

        <div v-if="filteredAssets.length > 0" class="assets-list">
          <div v-for="asset in filteredAssets" :key="asset.id" class="asset-item">
            <div class="asset-info">
              <div class="asset-header">
                <Icon name="octicon:package-16" class="asset-icon" size="1.4em" />
                <h4 class="asset-name">{{ asset.name }}</h4>
              </div>
              <div class="asset-meta">
                <span v-if="asset.download_count != null" class="download-count">{{ asset.download_count.toLocaleString() }} 次下载</span>
                <span v-if="asset.size != null" class="asset-size">{{ formatFileSize(asset.size) }}</span>
                <span v-if="getAssetSha256(asset) !== '未提供'" class="asset-sha-wrapper">
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
            <h4>暂无适用于 {{ currentOs.name }} {{ currentArch.name }} 的下载文件</h4>
            <p>请尝试调整操作系统或设备架构</p>
          </div>
        </div>

        <div class="view-release-history">
          <a
            :href="isUsingGiteeFallback
              ? 'https://gitee.com/XingHeYuZhuan-gh/shiguangschedule/releases'
              : 'https://github.com/ShiGuangSchedule/shiguangschedule/releases'"
            target="_blank"
            rel="noopener noreferrer">
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
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.os-icon,
.source-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.source-icon {
  object-fit: cover;
  border-radius: 4px;
}

[data-theme="dark"] img.github-light {
  display: none;
}

[data-theme="light"] img.github-dark {
  display: none;
}

.option-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}

.option-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.option-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.2;
}

.dropdown-arrow {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  flex-shrink: 0;
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
  gap: 14px;
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
  min-width: 0;
}

.asset-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.asset-icon {
  flex-shrink: 0;
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

  .title {
    font-size: 1.75rem;
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
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 1.25rem;
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
