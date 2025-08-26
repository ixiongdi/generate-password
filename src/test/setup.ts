/**
 * 测试环境设置文件
 * 
 * 为所有测试提供全局配置和工具函数
 */

import { vi } from 'vitest'

// Mock 基本 API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
})

// 测试工具函数
export const testUtils = {
  // 等待指定时间
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // 常用测试数据
  mockSecurityAnswers: [
    { questionId: 'pet_name', answer: '小白' },
    { questionId: 'birth_city', answer: '北京' },
    { questionId: 'favorite_food', answer: '饺子' }
  ],
  
  mockPasswordConfig: {
    securityAnswers: [
      { questionId: 'pet_name', answer: '小白' },
      { questionId: 'birth_city', answer: '北京' }
    ],
    timePeriod: '2025',
    length: 16
  }
}