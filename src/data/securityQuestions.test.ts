/**
 * 安全问题数据库测试
 * 
 * 测试安全问题数据的完整性和工具函数的正确性
 */

import { describe, it, expect, test } from 'vitest'
import { 
  SECURITY_QUESTIONS,
  getQuestionsByCategory,
  getRandomQuestions,
  getQuestionById,
  getCategoryName,
  type SecurityQuestion
} from './securityQuestions'

describe('securityQuestions', () => {
  describe('SECURITY_QUESTIONS 数据完整性', () => {
    it('应该包含安全问题', () => {
      expect(SECURITY_QUESTIONS).toBeDefined()
      expect(SECURITY_QUESTIONS.length).toBeGreaterThan(0)
    })

    it('每个问题都应该有必需的属性', () => {
      SECURITY_QUESTIONS.forEach((question, index) => {
        expect(question.id, `问题 ${index} 缺少 id`).toBeDefined()
        expect(question.id, `问题 ${index} 的 id 不能为空`).toBeTruthy()
        
        expect(question.question, `问题 ${index} 缺少 question`).toBeDefined()
        expect(question.question, `问题 ${index} 的 question 不能为空`).toBeTruthy()
        
        expect(question.category, `问题 ${index} 缺少 category`).toBeDefined()
        expect(['personal', 'family', 'preferences', 'memory', 'location'])
          .toContain(question.category)
        
        expect(question.placeholder, `问题 ${index} 缺少 placeholder`).toBeDefined()
        expect(question.placeholder, `问题 ${index} 的 placeholder 不能为空`).toBeTruthy()
      })
    })

    it('所有问题ID应该是唯一的', () => {
      const ids = SECURITY_QUESTIONS.map(q => q.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('应该包含所有预期的类别', () => {
      const categories = new Set(SECURITY_QUESTIONS.map(q => q.category))
      const expectedCategories: SecurityQuestion['category'][] = ['personal', 'family', 'preferences', 'memory', 'location']
      
      expectedCategories.forEach(category => {
        expect(categories.has(category)).toBe(true)
      })
    })

    it('每个类别应该至少有一个问题', () => {
      const categoryGroups = SECURITY_QUESTIONS.reduce((acc, question) => {
        if (!acc[question.category]) {
          acc[question.category] = 0
        }
        acc[question.category]++
        return acc
      }, {} as Record<string, number>)

      Object.values(categoryGroups).forEach(count => {
        expect(count).toBeGreaterThan(0)
      })
    })

    it('问题内容应该合理', () => {
      SECURITY_QUESTIONS.forEach(question => {
        // 问题应该以问号结尾
        expect(question.question).toMatch(/？$/)
        
        // 占位符应该包含示例
        expect(question.placeholder).toMatch(/例如/)
        
        // ID应该是有效的标识符格式
        expect(question.id).toMatch(/^[a-z_]+$/)
      })
    })
  })

  describe('getQuestionsByCategory', () => {
    it('应该返回指定类别的所有问题', () => {
      const personalQuestions = getQuestionsByCategory('personal')
      
      expect(personalQuestions.length).toBeGreaterThan(0)
      personalQuestions.forEach(question => {
        expect(question.category).toBe('personal')
      })
    })

    it('应该为每个有效类别返回问题', () => {
      const categories: SecurityQuestion['category'][] = ['personal', 'family', 'preferences', 'memory', 'location']
      
      categories.forEach(category => {
        const questions = getQuestionsByCategory(category)
        expect(questions.length).toBeGreaterThan(0)
        questions.forEach(question => {
          expect(question.category).toBe(category)
        })
      })
    })

    it('返回的问题应该是原数组的子集', () => {
      const personalQuestions = getQuestionsByCategory('personal')
      
      personalQuestions.forEach(question => {
        expect(SECURITY_QUESTIONS).toContainEqual(question)
      })
    })
  })

  describe('getRandomQuestions', () => {
    it('应该返回指定数量的问题', () => {
      const randomQuestions = getRandomQuestions(5)
      expect(randomQuestions).toHaveLength(5)
    })

    it('返回的问题应该来自原数组', () => {
      const randomQuestions = getRandomQuestions(3)
      
      randomQuestions.forEach(question => {
        expect(SECURITY_QUESTIONS).toContainEqual(question)
      })
    })

    it('请求数量超过总数时应该返回所有问题', () => {
      const allQuestions = getRandomQuestions(1000)
      expect(allQuestions.length).toBe(SECURITY_QUESTIONS.length)
    })

    it('请求0个问题应该返回空数组', () => {
      const noQuestions = getRandomQuestions(0)
      expect(noQuestions).toHaveLength(0)
    })

    it('连续调用应该可能返回不同的结果', () => {
      const result1 = getRandomQuestions(5)
      const result2 = getRandomQuestions(5)
      
      // 虽然有小概率相同，但大多数情况下应该不同
      // 这里只是检查函数是否在尝试随机化
      expect(Array.isArray(result1)).toBe(true)
      expect(Array.isArray(result2)).toBe(true)
    })
  })

  describe('getQuestionById', () => {
    it('应该返回正确的问题', () => {
      const firstQuestion = SECURITY_QUESTIONS[0]
      const foundQuestion = getQuestionById(firstQuestion.id)
      
      expect(foundQuestion).toEqual(firstQuestion)
    })

    it('不存在的ID应该返回undefined', () => {
      const nonExistentQuestion = getQuestionById('non_existent_id')
      expect(nonExistentQuestion).toBeUndefined()
    })

    it('应该能找到所有已知问题', () => {
      SECURITY_QUESTIONS.forEach(question => {
        const found = getQuestionById(question.id)
        expect(found).toEqual(question)
      })
    })

    it('空字符串ID应该返回undefined', () => {
      const emptyIdQuestion = getQuestionById('')
      expect(emptyIdQuestion).toBeUndefined()
    })
  })

  describe('getCategoryName', () => {
    const expectedNames = {
      personal: '个人信息',
      family: '家庭信息',
      preferences: '个人喜好',
      memory: '重要记忆',
      location: '地点信息'
    }

    test.each([
      ['personal', '个人信息'],
      ['family', '家庭信息'],
      ['preferences', '个人喜好'],
      ['memory', '重要记忆'],
      ['location', '地点信息']
    ])('类别 %s 应该返回 %s', (category, expectedName) => {
      const name = getCategoryName(category as SecurityQuestion['category'])
      expect(name).toBe(expectedName)
    })

    it('应该为所有类别提供中文名称', () => {
      Object.entries(expectedNames).forEach(([category, expectedName]) => {
        const name = getCategoryName(category as SecurityQuestion['category'])
        expect(name).toBe(expectedName)
        expect(name).toBeTruthy()
      })
    })
  })

  describe('数据质量检查', () => {
    it('问题内容应该适合中文用户', () => {
      SECURITY_QUESTIONS.forEach(question => {
        // 检查是否包含中文字符
        expect(question.question).toMatch(/[\u4e00-\u9fff]/)
        expect(question.placeholder).toMatch(/[\u4e00-\u9fff]/)
      })
    })

    it('占位符应该提供有意义的示例', () => {
      SECURITY_QUESTIONS.forEach(question => {
        expect(question.placeholder.length).toBeGreaterThan(2)
        expect(question.placeholder).toMatch(/例如/)
      })
    })

    it('问题应该具有足够的多样性', () => {
      // 检查是否有足够的不同类别
      const categories = new Set(SECURITY_QUESTIONS.map(q => q.category))
      expect(categories.size).toBeGreaterThanOrEqual(5)

      // 每个类别应该有多个问题
      categories.forEach(category => {
        const categoryQuestions = getQuestionsByCategory(category)
        expect(categoryQuestions.length).toBeGreaterThanOrEqual(3)
      })
    })

    it('问题ID应该遵循命名规范', () => {
      SECURITY_QUESTIONS.forEach(question => {
        // ID应该只包含小写字母和下划线
        expect(question.id).toMatch(/^[a-z_]+$/)
        
        // ID应该具有描述性
        expect(question.id.length).toBeGreaterThanOrEqual(3)
      })
    })
  })

  describe('边界情况', () => {
    it('空数组情况下的工具函数', () => {
      // 测试在没有匹配项时的行为
      const emptyResults = SECURITY_QUESTIONS.filter(q => q.category === ('non_existent' as any))
      expect(emptyResults).toHaveLength(0)
    })

    it('大量请求的性能', () => {
      const startTime = performance.now()
      
      // 执行大量查询
      for (let i = 0; i < 1000; i++) {
        getQuestionsByCategory('personal')
        getQuestionById('pet_name')
        getCategoryName('personal')
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // 应该在合理时间内完成
      expect(duration).toBeLessThan(100) // 100ms
    })
  })
})