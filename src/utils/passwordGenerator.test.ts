/**
 * 密码生成器核心算法测试
 * 
 * 测试密码生成的正确性、一致性和安全性
 */

import { describe, it, expect, test } from 'vitest'
import { 
  generatePassword, 
  getPasswordStrength, 
  type PasswordConfig, 
  type SecurityAnswer 
} from './passwordGenerator'

describe('passwordGenerator', () => {
  // 测试数据
  const mockAnswers: SecurityAnswer[] = [
    { questionId: 'pet_name', answer: '小白' },
    { questionId: 'birth_city', answer: '北京' },
    { questionId: 'favorite_food', answer: '饺子' }
  ]

  const validConfig: PasswordConfig = {
    securityAnswers: mockAnswers,
    timePeriod: '2025',
    length: 16
  }

  describe('generatePassword', () => {
    it('应该生成指定长度的密码', () => {
      const config8 = { ...validConfig, length: 8 }
      const config16 = { ...validConfig, length: 16 }
      const config32 = { ...validConfig, length: 32 }

      expect(generatePassword(config8)).toHaveLength(8)
      expect(generatePassword(config16)).toHaveLength(16)
      expect(generatePassword(config32)).toHaveLength(32)
    })

    it('相同输入应该产生相同密码', () => {
      const password1 = generatePassword(validConfig)
      const password2 = generatePassword(validConfig)
      
      expect(password1).toBe(password2)
    })

    it('不同输入应该产生不同密码', () => {
      const config1 = validConfig
      const config2 = { ...validConfig, timePeriod: '2025Q1' }
      const config3 = { ...validConfig, length: 12 }

      const password1 = generatePassword(config1)
      const password2 = generatePassword(config2)
      const password3 = generatePassword(config3)

      expect(password1).not.toBe(password2)
      expect(password1).not.toBe(password3)
      expect(password2).not.toBe(password3)
    })

    it('生成的密码应该包含各种字符类型', () => {
      const password = generatePassword(validConfig)
      
      // 检查是否包含小写字母
      expect(password).toMatch(/[a-z]/)
      // 检查是否包含大写字母
      expect(password).toMatch(/[A-Z]/)
      // 检查是否包含数字
      expect(password).toMatch(/\d/)
      // 对于长度大于4的密码，应该包含特殊字符
      if (validConfig.length > 4) {
        expect(password).toMatch(/[^a-zA-Z\d]/)
      }
    })

    it('应该只包含可打印的ASCII字符', () => {
      const password = generatePassword(validConfig)
      
      // 检查所有字符都在ASCII 32-126范围内
      for (const char of password) {
        const charCode = char.charCodeAt(0)
        expect(charCode).toBeGreaterThanOrEqual(32)
        expect(charCode).toBeLessThanOrEqual(126)
      }
    })

    it('答案的大小写和空格不应该影响密码生成', () => {
      const config1 = {
        ...validConfig,
        securityAnswers: [
          { questionId: 'pet_name', answer: '小白' },
          { questionId: 'birth_city', answer: '北京' }
        ]
      }
      
      const config2 = {
        ...validConfig,
        securityAnswers: [
          { questionId: 'pet_name', answer: ' 小白 ' },
          { questionId: 'birth_city', answer: '北京' }
        ]
      }

      const password1 = generatePassword(config1)
      const password2 = generatePassword(config2)
      
      expect(password1).toBe(password2)
    })

    it('答案顺序不应该影响密码生成', () => {
      const config1 = {
        ...validConfig,
        securityAnswers: [
          { questionId: 'pet_name', answer: '小白' },
          { questionId: 'birth_city', answer: '北京' }
        ]
      }
      
      const config2 = {
        ...validConfig,
        securityAnswers: [
          { questionId: 'birth_city', answer: '北京' },
          { questionId: 'pet_name', answer: '小白' }
        ]
      }

      const password1 = generatePassword(config1)
      const password2 = generatePassword(config2)
      
      expect(password1).toBe(password2)
    })

    describe('错误处理', () => {
      it('没有安全问题时应该抛出错误', () => {
        const invalidConfig = {
          ...validConfig,
          securityAnswers: []
        }

        expect(() => generatePassword(invalidConfig)).toThrow('必须至少选择1个安全问题')
      })

      it('密码长度小于8时应该抛出错误', () => {
        const invalidConfig = {
          ...validConfig,
          length: 7
        }

        expect(() => generatePassword(invalidConfig)).toThrow('密码长度必须在8-32位之间')
      })

      it('密码长度大于32时应该抛出错误', () => {
        const invalidConfig = {
          ...validConfig,
          length: 33
        }

        expect(() => generatePassword(invalidConfig)).toThrow('密码长度必须在8-32位之间')
      })

      it('存在空答案时应该抛出错误', () => {
        const invalidConfig = {
          ...validConfig,
          securityAnswers: [
            { questionId: 'pet_name', answer: '小白' },
            { questionId: 'birth_city', answer: '' }
          ]
        }

        expect(() => generatePassword(invalidConfig)).toThrow('所有安全问题都必须有答案')
      })

      it('存在空白答案时应该抛出错误', () => {
        const invalidConfig = {
          ...validConfig,
          securityAnswers: [
            { questionId: 'pet_name', answer: '小白' },
            { questionId: 'birth_city', answer: '   ' }
          ]
        }

        expect(() => generatePassword(invalidConfig)).toThrow('所有安全问题都必须有答案')
      })
    })

    describe('边界情况测试', () => {
      it('最小长度密码应该正常生成', () => {
        const config = { ...validConfig, length: 8 }
        const password = generatePassword(config)
        
        expect(password).toHaveLength(8)
        expect(password).toMatch(/[a-z]/)
        expect(password).toMatch(/[A-Z]/)
        expect(password).toMatch(/\d/)
      })

      it('最大长度密码应该正常生成', () => {
        const config = { ...validConfig, length: 32 }
        const password = generatePassword(config)
        
        expect(password).toHaveLength(32)
        expect(password).toMatch(/[a-z]/)
        expect(password).toMatch(/[A-Z]/)
        expect(password).toMatch(/\d/)
        expect(password).toMatch(/[^a-zA-Z\d]/)
      })

      it('单个安全问题应该正常工作', () => {
        const config = {
          ...validConfig,
          securityAnswers: [{ questionId: 'pet_name', answer: '小白' }]
        }
        
        const password = generatePassword(config)
        expect(password).toHaveLength(16)
      })

      it('大量安全问题应该正常工作', () => {
        const manyAnswers = Array.from({ length: 10 }, (_, i) => ({
          questionId: `question_${i}`,
          answer: `answer_${i}`
        }))
        
        const config = {
          ...validConfig,
          securityAnswers: manyAnswers
        }
        
        const password = generatePassword(config)
        expect(password).toHaveLength(16)
      })
    })
  })

  describe('getPasswordStrength', () => {
    it('应该正确评估弱密码', () => {
      expect(getPasswordStrength('123456')).toBe('weak')
      expect(getPasswordStrength('password')).toBe('weak')
      expect(getPasswordStrength('abc123')).toBe('weak')
    })

    it('应该正确评估中等强度密码', () => {
      expect(getPasswordStrength('Password123')).toBe('medium')
      expect(getPasswordStrength('Abc123!@')).toBe('medium')
      expect(getPasswordStrength('MyPass2024')).toBe('medium')
    })

    it('应该正确评估强密码', () => {
      expect(getPasswordStrength('MyStrongP@ssw0rd2024!')).toBe('strong')
      expect(getPasswordStrength('Xy9#mK$2qL@vN&8c')).toBe('strong')
      
      // 测试生成的密码强度
      const generatedPassword = generatePassword(validConfig)
      const strength = getPasswordStrength(generatedPassword)
      
      // 生成的密码应该至少是中等强度
      expect(['medium', 'strong']).toContain(strength)
    })

    it('空密码应该返回弱强度', () => {
      expect(getPasswordStrength('')).toBe('weak')
    })

    it('长密码应该获得额外加分', () => {
      const shortPassword = 'Abc123!@'
      const longPassword = 'Abc123!@#$%^&*()_+{}|:"<>?'
      
      const shortStrength = getPasswordStrength(shortPassword)
      const longStrength = getPasswordStrength(longPassword)
      
      // 长密码的强度应该不低于短密码
      const strengthOrder = { 'weak': 0, 'medium': 1, 'strong': 2 }
      expect(strengthOrder[longStrength]).toBeGreaterThanOrEqual(strengthOrder[shortStrength])
    })
  })

  describe('时间周期格式测试', () => {
    test.each([
      '2025',
      '2025H1',
      '2025H2', 
      '2025Q1',
      '2025Q2',
      '2025Q3',
      '2025Q4'
    ])('时间周期 %s 应该生成有效密码', (timePeriod) => {
      const config = { ...validConfig, timePeriod }
      const password = generatePassword(config)
      
      expect(password).toHaveLength(16)
      expect(typeof password).toBe('string')
    })

    it('不同时间周期应该生成不同密码', () => {
      const periods = ['2025', '2025H1', '2025H2', '2025Q1', '2025Q2', '2025Q3', '2025Q4']
      const passwords = periods.map(period => 
        generatePassword({ ...validConfig, timePeriod: period })
      )

      // 所有密码应该都不相同
      const uniquePasswords = new Set(passwords)
      expect(uniquePasswords.size).toBe(periods.length)
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内生成密码', () => {
      const startTime = performance.now()
      
      // 生成100个密码
      for (let i = 0; i < 100; i++) {
        generatePassword({
          ...validConfig,
          securityAnswers: [
            { questionId: `q${i}`, answer: `answer${i}` }
          ]
        })
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // 应该在1秒内完成
      expect(duration).toBeLessThan(1000)
    })
  })
})