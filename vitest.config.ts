/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // 测试环境配置
    environment: 'jsdom',
    
    // 全局设置
    globals: true,
    
    // 测试文件匹配模式
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // 设置测试文件
    setupFiles: ['./src/test/setup.ts'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
      ],
      // 覆盖率阈值
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // 测试超时时间
    testTimeout: 10000,
    
    // 钩子超时时间
    hookTimeout: 10000,
    
    // 并发测试
    threads: true,
    minThreads: 1,
    maxThreads: 4,
    
    // 输出配置
    reporter: ['verbose', 'json'],
    outputFile: './test-results.json'
  }
})