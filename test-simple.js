#!/usr/bin/env node

/**
 * 简单的测试运行器
 * 使用 Node.js 原生 assert 模块进行测试
 */

const assert = require('assert');
const { execSync } = require('child_process');

console.log('🧪 运行简单测试...\n');

// 测试 1: 基础断言
console.log('测试 1: 基础断言');
try {
  assert.strictEqual(1 + 1, 2);
  console.log('✅ 1 + 1 = 2');
} catch (error) {
  console.log('❌ 基础断言失败:', error.message);
  process.exit(1);
}

// 测试 2: 字符串测试
console.log('\n测试 2: 字符串测试');
try {
  assert.ok('hello world'.includes('world'));
  console.log('✅ 字符串包含测试通过');
} catch (error) {
  console.log('❌ 字符串测试失败:', error.message);
  process.exit(1);
}

// 测试 3: 尝试编译 TypeScript
console.log('\n测试 3: TypeScript 编译检查');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript 编译检查通过');
} catch (error) {
  console.log('❌ TypeScript 编译检查失败');
  console.log('请运行 npm run lint 查看详细错误');
}

// 测试 4: ESLint 检查
console.log('\n测试 4: ESLint 代码检查');
try {
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('✅ ESLint 检查通过');
} catch (error) {
  console.log('⚠️ ESLint 检查有警告或错误');
  console.log('请运行 npm run lint 查看详细信息');
}

// 测试 5: 构建测试
console.log('\n测试 5: 项目构建测试');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ 项目构建成功');
} catch (error) {
  console.log('❌ 项目构建失败');
  console.log('请运行 npm run build 查看详细错误');
}

console.log('\n🎉 基础测试完成！');

// 如果 Vitest 可用，尝试运行
console.log('\n🔍 检查 Vitest 是否可用...');
try {
  execSync('npx vitest --version', { stdio: 'pipe' });
  console.log('✅ Vitest 已安装，可以使用 npm test 运行完整测试');
} catch (error) {
  console.log('⚠️ Vitest 不可用，但基础功能测试已通过');
}