# 🔐 安全密码生成器 (Secure Password Generator)

一个基于个人安全问题的智能密码生成器，帮助您创建唯一、高强度且易于记忆的密码。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff.svg)](https://vitejs.dev/)

## ✨ 特性

- 🔒 **基于安全问题的密码生成** - 使用个人安全问题答案生成唯一密码
- 🎯 **高度可定制** - 支持自定义安全问题和密码参数
- ⏰ **时间周期管理** - 支持年度、半年度、季度密码更换周期
- 💪 **高强度密码** - 使用95个可打印ASCII字符，确保密码复杂性
- 📱 **响应式设计** - 完美适配手机、平板和桌面设备
- 🚀 **零后端依赖** - 纯前端实现，保护隐私
- 🌐 **现代化界面** - 基于React 19 + TypeScript + Vite构建
- ♿ **无障碍支持** - 符合Web无障碍标准

## 🎯 核心功能

### 安全问题库
- **个人信息**: 出生地、学校、宠物等
- **家庭信息**: 家庭成员、家族历史等
- **个人喜好**: 音乐、电影、运动等
- **重要记忆**: 特殊日期、难忘经历等
- **地点信息**: 旅行、居住地等
- **自定义问题**: 支持添加完全个性化的安全问题

### 密码生成配置
- **问题选择**: 可选择任意数量的安全问题（至少1个）
- **时间周期**: 年度/半年度/季度密码更换
- **密码长度**: 8-32位可调节（默认16位）
- **字符集**: 95个可打印ASCII字符（空格、字母、数字、符号）

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/ixiongdi/pwd-gen.git
   cd generate-password
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   
   访问 [http://localhost:5173](http://localhost:5173) 查看应用

## 📖 使用指南

### 基本使用

1. **选择安全问题** - 从预设问题库中选择或添加自定义问题
2. **输入答案** - 为选中的问题提供答案
3. **设置参数** - 选择密码更换周期和长度
4. **生成密码** - 点击生成按钮获取您的专属密码
5. **复制使用** - 一键复制密码到剪贴板

### 高级功能

- **一键默认配置**: 快速应用推荐的安全配置
- **自定义问题管理**: 添加、删除个性化安全问题
- **密码强度检测**: 实时显示密码强度等级
- **时间周期灵活设置**: 支持精确到季度的密码更换计划

## 🛠️ 开发

### 项目结构

```
src/
├── components/          # React组件
├── data/               # 数据配置
│   └── securityQuestions.ts  # 安全问题库
├── utils/              # 工具函数
│   └── passwordGenerator.ts  # 密码生成逻辑
├── App.tsx             # 主应用组件
├── App.css             # 样式文件
└── main.tsx            # 应用入口
```

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 运行测试
npm test
```

### 技术栈

- **前端框架**: React 19.1.1
- **类型系统**: TypeScript 5.8.3
- **构建工具**: Vite 7.1.2
- **代码规范**: ESLint 9.33.0
- **样式**: CSS3 + 响应式设计

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 贡献方式

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🌍 协助翻译

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看 LICENSE 文件了解详情。

## 🔒 安全性

- **隐私保护**: 所有计算都在本地进行，不会向服务器发送任何数据
- **确定性算法**: 相同输入始终产生相同输出，确保密码一致性
- **高强度生成**: 使用SHA-256哈希算法确保密码随机性和安全性

如果您发现安全漏洞，请查看我们的 [安全政策](SECURITY.md)。

## 📞 支持

- 🐛 [问题反馈](https://github.com/ixiongdi/pwd-gen/issues)
- 💬 [讨论区](https://github.com/ixiongdi/pwd-gen/discussions)
- 📧 邮箱: ixiongdi@gmail.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/ixiongdi">Andy Xiong</a>
</div>
