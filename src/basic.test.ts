/**
 * 基础测试 - 验证测试环境
 */

import { describe, it, expect } from 'vitest'

describe('基础测试', () => {
  it('测试环境应该正常工作', () => {
    expect(1 + 1).toBe(2)
  })

  it('字符串应该正确匹配', () => {
    expect('hello world').toContain('world')
  })

  it('数组应该包含指定元素', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr).toContain(3)
    expect(arr).toHaveLength(5)
  })
})