const https = require('https');
const fs = require('fs');
const path = require('path');

const SOURCE_URL = "https://raw.githubusercontent.com/XingHeYuZhuan/shiguang_warehouse/main/index/root_index.yaml";
const TARGET_FILE = path.join(__dirname, '..', 'docs', 'guide', 'user', 'adapted-school.md');
const REPO_SRC_URL = `https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources`;
const TIMESTAMP_PLACEHOLDER = '__TIMESTAMP__';

function parseYaml(yamlStr) {
    return yamlStr
        .split('- id:')
        .slice(1)
        .map((block) => {
        const name = extractValue(block, 'name');
        const initial = extractValue(block, 'initial');
        const folder = extractValue(block, 'resource_folder');

            if (!name) {
                return null;
            }

            return {
                name,
                initial: (initial || '#').toUpperCase(),
                folder: folder || ''
            };
        })
        .filter(Boolean);
}

function extractValue(block, key) {
    const regex = new RegExp(`${key}:\\s*["']?([^"'\n#]+)["']?`);
    const match = block.match(regex);
    return match ? match[1].trim() : null;
}

function normalizeMarkdownForCompare(markdown) {
    return markdown
        .replace(/\r\n/g, '\n')
        .replace(
            /^> 本页面由脚本自动同步，最后更新于：`.*`$/m,
            `> 本页面由脚本自动同步，最后更新于：\`${TIMESTAMP_PLACEHOLDER}\``
        );
}

function fetchAndGenerate() {
    console.log('🚀 正在从远程仓库同步学校索引...');

    const req = https.get(SOURCE_URL, (res) => {
        res.setEncoding('utf8');
        let data = '';
        if (res.statusCode !== 200) {
            console.error(`❌ 获取失败，状态码: ${res.statusCode}`);
            process.exitCode = 1;
            res.resume();
            return;
        }

        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const allSchools = parseYaml(data);

            const general = [];
            const specific = [];

            allSchools.forEach(s => {
                if (s.name.includes('通用') || s.name.includes('工具与服务')) {
                    general.push(s);
                } else {
                    specific.push(s);
                }
            });

            const sorter = (a, b) => {
                if (a.initial !== b.initial) return a.initial.localeCompare(b.initial);
                return a.name.localeCompare(b.name, 'zh-Hans-CN');
            };

            general.sort(sorter);
            specific.sort(sorter);

            const now = new Date();
            const timestamp = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            let md = `---\ntitle: 已适配学校\ncreateTime: 2026/03/04 20:21:35\n---\n\n`;
            md += `> 适配脚本仓库：[XingHeYuZhuan/shiguang_warehouse](https://github.com/XingHeYuZhuan/shiguang_warehouse)\n`;
            md += `>\n`;
            md += `> 本页面由脚本自动同步，最后更新于：\`${timestamp}\`\n\n`;

            md += `## <Icon name="entypo:tools" /> 通用工具与教务\n\n> 如果你的学校不在下方列表中，可以尝试这些通用适配方案。\n\n`;
            general.forEach(s => {
                const link = s.folder ? `[${s.name}](${REPO_SRC_URL}/${s.folder}/adapters.yaml)` : s.name;
                md += `- ${link}\n`;
            });

            md += `\n---\n\n`;

            md += `## <Icon name="material-symbols:school" /> 具体高校列表\n\n`;
            let currentLetter = '';
            specific.forEach(s => {
                if (s.initial !== currentLetter) {
                    currentLetter = s.initial;
                    md += `### ${currentLetter}\n`;
                }
                const link = s.folder ? `[${s.name}](${REPO_SRC_URL}/${s.folder}/adapters.yaml)` : s.name;
                md += `- ${link}\n`;
            });

            if (fs.existsSync(TARGET_FILE)) {
                const existingMd = fs.readFileSync(TARGET_FILE, 'utf-8');
                if (normalizeMarkdownForCompare(existingMd) === normalizeMarkdownForCompare(md)) {
                    console.log('✏️  学校列表无变化，不写入文件。');
                    return;
                }
            }

            // 确保目录存在后再写入。
            fs.mkdirSync(path.dirname(TARGET_FILE), { recursive: true });
            fs.writeFileSync(TARGET_FILE, md, 'utf-8');

            console.log(`\n✨ 同步成功！`);
            console.log(`📊 统计数据：通用项 ${general.length}，高校项 ${specific.length}`);
            console.log(`位置：${TARGET_FILE}`);
        });
    });

    req.setTimeout(15000, () => {
        req.destroy(new Error('请求超时'));
    });

    req.on('error', (err) => {
        console.error('❌ 网络请求出错: ' + err.message);
        process.exitCode = 1;
    });
}

fetchAndGenerate();
