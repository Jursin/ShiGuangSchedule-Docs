const https = require('https');
const fs = require('fs');
const path = require('path');

// --- 配置区 ---
const SOURCE_URL = "https://raw.githubusercontent.com/XingHeYuZhuan/shiguang_warehouse/main/index/root_index.yaml";
const TARGET_FILE = path.join(__dirname, '..', 'docs', 'guide', 'user', 'adapted-school.md');
const REPO_BASE_URL = "https://github.com/XingHeYuZhuan/shiguang_warehouse";
const REPO_SRC_URL = `${REPO_BASE_URL}/tree/main`;

/**
 * 核心解析逻辑
 * 针对 YAML 结构提取 id, name, initial, resource_folder
 */
function parseYaml(yamlStr) {
    const schools = [];
    // 按 "- id:" 分割每一项
    const blocks = yamlStr.split('- id:').slice(1);

    blocks.forEach(block => {
        const id = extractValue(block, 'id');
        const name = extractValue(block, 'name');
        const initial = extractValue(block, 'initial');
        const folder = extractValue(block, 'resource_folder');

        if (name) {
            schools.push({
                id,
                name,
                initial: (initial || '#').toUpperCase(),
                folder: folder || ''
            });
        }
    });
    return schools;
}

function extractValue(block, key) {
    const regex = new RegExp(`${key}:\\s*["']?([^"'\n#]+)["']?`);
    const match = block.match(regex);
    return match ? match[1].trim() : null;
}

/**
 * 同步并生成文档
 */
function fetchAndGenerate() {
    console.log('🚀 正在从远程仓库同步学校索引...');

    https.get(SOURCE_URL, (res) => {
        let data = '';
        if (res.statusCode !== 200) {
            console.error(`❌ 获取失败，状态码: ${res.statusCode}`);
            return;
        }

        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const allSchools = parseYaml(data);
            
            // 分类
            const general = [];
            const specific = [];
            
            allSchools.forEach(s => {
                if (s.name.includes('通用') || s.name.includes('工具与服务')) {
                    general.push(s);
                } else {
                    specific.push(s);
                }
            });

            // 排序 (通用类按字母排，高校类按字母索引排)
            const sorter = (a, b) => {
                if (a.initial !== b.initial) return a.initial.localeCompare(b.initial);
                return a.name.localeCompare(b.name, 'zh-Hans-CN');
            };

            general.sort(sorter);
            specific.sort(sorter);

            // 构建 Markdown
            const now = new Date();
            const timestamp = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            let md = `---\ntitle: 已适配学校\ncreateTime: ${timestamp}\n---\n\n`;
            md += `> 适配脚本仓库：[XingHeYuZhuan/shiguang_warehouse](${REPO_BASE_URL})\n`;
            md += `> 本页面由脚本自动同步，最后更新于：\`${timestamp}\`\n\n`;

            // 1. 渲染通用适配
            md += `## 🛠️ 通用工具与教务\n\n> 如果你的学校不在下方列表中，可以尝试这些通用适配方案。\n\n`;
            general.forEach(s => {
                const link = s.folder ? `[${s.name}](${REPO_SRC_URL}/${s.folder})` : s.name;
                md += `- ${link}\n`;
            });

            md += `\n---\n\n`;

            // 2. 渲染高校列表
            md += `## 🎓 具体高校列表\n\n`;
            let currentLetter = '';
            specific.forEach(s => {
                if (s.initial !== currentLetter) {
                    currentLetter = s.initial;
                    md += `### ${currentLetter}\n`;
                }
                const link = s.folder ? `[${s.name}](${REPO_SRC_URL}/${s.folder})` : s.name;
                md += `- ${link}\n`;
            });

            // 写入文件
            fs.mkdirSync(path.dirname(TARGET_FILE), { recursive: true });
            fs.writeFileSync(TARGET_FILE, md, 'utf-8');
            
            console.log(`\n✨ 同步成功！`);
            console.log(`📊 统计数据：通用项 ${general.length}，高校项 ${specific.length}`);
            console.log(`位置：${TARGET_FILE}`);
        });
    }).on('error', (err) => {
        console.error('❌ 网络请求出错: ' + err.message);
    });
}

fetchAndGenerate();
