/**
 * 测试环境设置文件
 * 
 * 为所有测试提供全局配置和工具函数
 */

import '@testing-library/jest-dom'
import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// 全局测试前设置
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock clipboard API
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
    writable: true,
  })

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

// 测试工具函数
export const testUtils = {
  // 等待指定时间
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // 模拟用户输入延迟
  typeDelay: 100,
  
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