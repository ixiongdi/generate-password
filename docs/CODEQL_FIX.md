# CodeQL 权限问题修复

## 问题描述

在GitHub Actions的CI/CD流程中，CodeQL代码安全扫描出现了权限相关的错误：

```
Warning: Resource not accessible by integration - https://docs.github.com/rest
Error: Resource not accessible by integration - https://docs.github.com/rest
```

## 问题原因

这个错误通常由以下原因引起：

1. **缺少必要权限**: CodeQL Action需要 `security-events: write` 权限来上传扫描结果
2. **权限配置不完整**: 工作流中的安全扫描作业没有明确声明所需的权限
3. **GitHub Token权限不足**: 默认的GITHUB_TOKEN可能没有足够的权限

## 解决方案

### 1. 添加权限配置

在 `.github/workflows/ci.yml` 文件的 `security` 作业中添加了明确的权限声明：

```yaml
security:
  name: 🔒 安全扫描
  runs-on: ubuntu-latest
  permissions:
    actions: read
    contents: read
    security-events: write  # 关键权限：允许上传安全扫描结果
  steps:
    # ... 其他步骤
```

### 2. 权限说明

- `actions: read` - 读取Actions相关信息
- `contents: read` - 读取仓库内容
- `security-events: write` - **关键权限**，允许写入安全事件和上传CodeQL扫描结果

### 3. 添加分类标识

为CodeQL分析添加了分类标识，有助于更好地组织和管理扫描结果：

```yaml
- name: 📊 执行 CodeQL 分析
  uses: github/codeql-action/analyze@v3
  with:
    category: "/language:javascript"
```

## 预期效果

修复后，CodeQL扫描应该能够：

1. ✅ 成功执行代码安全扫描
2. ✅ 正常上传扫描结果到GitHub Security tab
3. ✅ 在仓库的Security → Code scanning alerts中显示结果
4. ✅ 不再出现权限相关的警告和错误

## 验证方法

1. 推送代码到仓库触发CI/CD流程
2. 查看GitHub Actions的安全扫描作业是否成功完成
3. 检查仓库的Security tab是否显示CodeQL扫描结果
4. 确认没有权限相关的错误信息

## 相关文档

- [GitHub CodeQL Action权限配置](https://docs.github.com/en/code-security/code-scanning/creating-an-advanced-setup-for-code-scanning/customizing-your-advanced-setup-for-code-scanning#changing-the-languages-that-are-analyzed)
- [GitHub Actions权限文档](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
- [SARIF上传权限要求](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning)

## 修复日期

修复时间: 2025-08-26
修复人员: Andy Xiong