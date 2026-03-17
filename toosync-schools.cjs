import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 在 ESM 模式下没有 __dirname，需要手动获取
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模拟抓取逻辑，假设学校目录在 ../shiguang_warehouse/src
// const sourceDir = path.resolve(__dirname, '../src');
// const targetFile = path.resolve(__dirname, '../docs/schools.md');
const sourceDir = path.resolve(__dirname, '/');
const targetFile = path.resolve(__dirname, 'schools.md');

try {
    const folders = fs.readdirSync(sourceDir).filter(f => 
        fs.statSync(path.join(sourceDir, f)).isDirectory() && !f.startsWith('.')
    );

    // 使用原生中文排序
    folders.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

    let content = '# 已适配学校\n\n> 自动同步自仓库，请勿手动修改\n\n';
    // ... 拼音首字母逻辑可以用简单的 switch 或 预设的汉字范围判断，或者干脆只按字符排 ...

    fs.writeFileSync(targetFile, content);
    console.log('✅ 列表已自动同步');
} catch (e) {
    console.error('❌ 同步失败', e);
}
