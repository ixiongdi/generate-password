# 贡献指南 (Contributing Guide)

感谢您对安全密码生成器项目的关注！我们欢迎并感谢所有形式的贡献。

## 🤝 如何贡献

### 报告 Bug

在提交 Bug 报告之前，请：

1. **检查现有 Issues** - 确保您的问题尚未被报告
2. **使用最新版本** - 确认问题在最新版本中仍然存在
3. **提供详细信息** - 使用我们的 Bug 报告模板

**好的 Bug 报告应包含：**
- 清晰的标题和描述
- 重现步骤
- 期望的行为
- 实际的行为
- 屏幕截图（如果适用）
- 环境信息（浏览器、操作系统等）

### 功能请求

我们欢迎新功能建议！请：

1. **检查现有 Issues** - 避免重复建议
2. **描述用例** - 解释为什么这个功能有用
3. **考虑替代方案** - 是否有其他解决方法
4. **保持简洁** - 清楚地描述您的想法

### 代码贡献

#### 开发环境设置

1. **Fork 仓库**
   ```bash
   # 克隆您的 fork
   git clone https://github.com/your-username/generate-password.git
   cd generate-password
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

#### 编码规范

**TypeScript 规范：**
- 使用 TypeScript 严格模式
- 为所有函数和复杂类型提供类型注解
- 避免使用 `any` 类型
- 使用有意义的变量和函数名

**React 规范：**
- 使用函数组件和 Hooks
- 遵循 React Hooks 规则
- 正确处理副作用和清理
- 使用 PropTypes 或 TypeScript 类型

**代码风格：**
- 使用 2 空格缩进
- 使用单引号（除非字符串中包含单引号）
- 在语句末尾使用分号
- 遵循 ESLint 配置

**命名约定：**
- 组件：PascalCase (`MyComponent`)
- 函数和变量：camelCase (`myFunction`)
- 常量：UPPER_SNAKE_CASE (`MY_CONSTANT`)
- 文件名：camelCase 或 kebab-case

#### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

**类型：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式变更（不影响逻辑）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变更

**示例：**
```
feat(security): 添加自定义安全问题功能

允许用户创建和管理个性化的安全问题，
提高密码生成的个性化程度。

Closes #123
```

#### Pull Request 流程

1. **确保测试通过**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

2. **更新文档**
   - 如果添加新功能，更新 README.md
   - 添加或更新注释
   - 更新 CHANGELOG.md

3. **创建 Pull Request**
   - 使用清晰的标题和描述
   - 引用相关的 Issues
   - 添加屏幕截图（UI 变更时）
   - 请求代码审查

4. **响应反馈**
   - 及时回应审查意见
   - 进行必要的修改
   - 保持讨论的建设性

## 📋 开发指南

### 项目结构

```
src/
├── components/          # React 组件
├── data/               # 数据配置文件
│   └── securityQuestions.ts
├── utils/              # 工具函数
│   └── passwordGenerator.ts
├── App.tsx             # 主应用组件
├── App.css             # 样式文件
└── main.tsx            # 应用入口
```

### 添加新的安全问题

1. 编辑 `src/data/securityQuestions.ts`
2. 遵循现有的数据结构
3. 确保问题具有良好的隐私性
4. 添加合适的分类和占位符

### 测试

- **单元测试**: 测试工具函数和组件逻辑
- **集成测试**: 测试组件之间的交互
- **E2E 测试**: 测试完整的用户流程

运行测试：
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

### 性能考虑

- 避免不必要的重渲染
- 使用 `React.memo` 和 `useMemo` 进行优化
- 确保密码生成算法的效率
- 优化资源加载和打包大小

### 无障碍性

- 使用语义化 HTML 元素
- 提供适当的 ARIA 标签
- 确保键盘导航可用
- 保持足够的颜色对比度
- 测试屏幕阅读器兼容性

## 🎯 贡献优先级

我们特别欢迎以下类型的贡献：

1. **Bug 修复** - 提高应用稳定性
2. **安全性改进** - 密码生成算法优化
3. **用户体验优化** - 界面和交互改进
4. **国际化** - 多语言支持
5. **测试覆盖** - 增加测试用例
6. **文档改进** - 让项目更易理解
7. **性能优化** - 提升应用性能

## 📞 获取帮助

如果您在贡献过程中遇到问题：

- 📧 发送邮件：your-email@example.com
- 💬 在 [Discussions](https://github.com/yourusername/generate-password/discussions) 中提问
- 🐛 创建 [Issue](https://github.com/yourusername/generate-password/issues)

## 🏆 贡献者认可

我们会在以下地方认可所有贡献者：

- README.md 中的贡献者列表
- 发布说明中的感谢
- 项目的 Contributors 页面

## 📜 行为准则

请阅读并遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。我们致力于为所有人提供友好、安全和欢迎的环境。

---

再次感谢您的贡献！每一个贡献都让这个项目变得更好。🙏