import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CHANGELOG_PATH = resolve(__dirname, '../docs/changelog.md')
const REPO = 'XingHeYuZhuan/shiguangschedule'

/* 获取 changelog 中最新的版本号 */
function getLatestVersion(content) {
  const match = content.match(/## \[v([\d.]+)\]/)
  return match ? match[1] : null
}

/* 重写版本标题行，body 去除空行 */
function formatRelease(release) {
  const version = release.tag_name.replace(/^v/, '')
  const date = new Date(release.published_at).toISOString().split('T')[0]
  const tagUrl = `https://github.com/${REPO}/releases/tag/${release.tag_name}`

  let entry = `## [v${version}](${tagUrl}) <Badge type="tip" text="${date}" />`

  if (release.body && release.body.trim()) {
    // 去掉 release body 中已有的版本标题行，统一换行符并去除多余空行
    const cleaned = release.body
      .replace(/^#+\s*v[\d.]+\s*(\r?\n)/m, '')
      .replace(/\r/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim()
    entry += '\n' + cleaned
  }

  return entry
}

async function main() {
  const response = await fetch(
    `https://api.github.com/repos/${REPO}/releases?per_page=10`,
    { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'ShiGuangSchedule-Docs/1.0' } }
  )
  if (!response.ok) throw new Error(`GitHub API: ${response.status}`)

  const releases = await response.json()
  if (!releases?.length) return console.log('没有 release')

  const changelog = readFileSync(CHANGELOG_PATH, 'utf-8')
  const latestVersion = getLatestVersion(changelog)

  const newReleases = releases
    .filter(r => !latestVersion || r.tag_name.replace(/^v/, '') > latestVersion)
    .reverse()

  if (!newReleases.length) return console.log('已是最新')

  console.log(`追加 ${newReleases.map(r => r.tag_name).join(', ')}`)

  const frontmatterEnd = changelog.indexOf('---', changelog.indexOf('---') + 3) + 3
  const before = changelog.substring(0, frontmatterEnd)
  const after = changelog.substring(frontmatterEnd).replace(/^\n+/, '')

  let entries = '\n\n'
  for (const release of newReleases) {
    entries += formatRelease(release) + '\n\n'
  }

  writeFileSync(CHANGELOG_PATH, before + entries + after, 'utf-8')
}

main().catch(e => { console.error(e.message); process.exit(1) })
