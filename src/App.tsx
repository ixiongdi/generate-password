import { useState } from 'react'
import './App.css'
import { SECURITY_QUESTIONS, getCategoryName } from './data/securityQuestions'
import type { SecurityQuestion } from './data/securityQuestions'
import { generatePassword, getPasswordStrength } from './utils/passwordGenerator'
import type { SecurityAnswer, PasswordConfig } from './utils/passwordGenerator'

function App() {
  const [selectedQuestions, setSelectedQuestions] = useState<SecurityQuestion[]>([])
  const [answers, setAnswers] = useState<{[key: string]: string}>({})
  const [customQuestions, setCustomQuestions] = useState<SecurityQuestion[]>([])
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false)
  const [newCustomQuestion, setNewCustomQuestion] = useState<string>('')
  const [newCustomPlaceholder, setNewCustomPlaceholder] = useState<string>('')

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedPeriodType, setSelectedPeriodType] = useState<'year' | 'half' | 'quarter'>('year')
  const [selectedHalf, setSelectedHalf] = useState<1 | 2>(1)
  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4>(1)
  const [passwordLength, setPasswordLength] = useState<number>(16)
  const [generatedPassword, setGeneratedPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(true)

  // 推荐的默认安全问题（隐私性较好且不易被猜测）
  const defaultQuestions = [
    'childhood_nickname', // 您童年时的昵称是什么？
    'memorable_date',     // 对您最有意义的日期是什么？
    'favorite_teacher'    // 您最喜欢的老师的姓氏是什么？
  ]

  // 生成年份选项 (当前年份及未来几年)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)

  // 根据选择生成时间周期字符串
  const generateTimePeriod = () => {
    switch (selectedPeriodType) {
      case 'year':
        return selectedYear.toString()
      case 'half':
        return `${selectedYear}H${selectedHalf}`
      case 'quarter':
        return `${selectedYear}Q${selectedQuarter}`
      default:
        return selectedYear.toString()
    }
  }

  // 按类别分组的问题（包括自定义问题）
// 系统预设问题分组（不包含自定义问题）
  const systemGroupedQuestions = SECURITY_QUESTIONS.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, SecurityQuestion[]>)

  // 一键设置默认配置
  const setDefaultConfig = () => {
    const defaultSelectedQuestions = SECURITY_QUESTIONS.filter(q => 
      defaultQuestions.includes(q.id)
    )
    setSelectedQuestions(defaultSelectedQuestions)
    setAnswers({})
    setSelectedYear(new Date().getFullYear())
    setSelectedPeriodType('year')
    setPasswordLength(16)
    setGeneratedPassword('')
    setError('')
    setShowPassword(true)
  }

  // 添加自定义安全问题
  const addCustomQuestion = () => {
    if (!newCustomQuestion.trim()) {
      setError('请输入自定义问题内容')
      return
    }
    
    const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newQuestion: SecurityQuestion = {
      id: customId,
      question: newCustomQuestion.trim(),
      category: 'personal',
      placeholder: newCustomPlaceholder.trim() || '请输入您的答案'
    }
    
    setCustomQuestions(prev => [...prev, newQuestion])
    setNewCustomQuestion('')
    setNewCustomPlaceholder('')
    setShowCustomForm(false)
    setError('')
  }

  // 删除自定义问题
  const removeCustomQuestion = (questionId: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== questionId))
    // 如果该问题已被选中，也要从选中列表中移除
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId))
    // 移除对应的答案
    setAnswers(prev => {
      const newAnswers = { ...prev }
      delete newAnswers[questionId]
      return newAnswers
    })
  }

  // 处理问题选择
  const handleQuestionSelect = (question: SecurityQuestion) => {
    setError('')
    if (selectedQuestions.find(q => q.id === question.id)) {
      // 移除问题
      setSelectedQuestions(prev => prev.filter(q => q.id !== question.id))
      setAnswers(prev => {
        const newAnswers = { ...prev }
        delete newAnswers[question.id]
        return newAnswers
      })
    } else {
      // 添加问题（不再限制数量）
      setSelectedQuestions(prev => [...prev, question])
    }
  }

  // 处理答案输入
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setError('')
  }

  // 生成密码
  const handleGeneratePassword = () => {
    try {
      if (selectedQuestions.length === 0) {
        setError('请至少选择1个安全问题')
        return
      }

      const securityAnswers: SecurityAnswer[] = selectedQuestions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || ''
      }))

      const currentTimePeriod = generateTimePeriod()

      const config: PasswordConfig = {
        securityAnswers,
        timePeriod: currentTimePeriod,
        length: passwordLength
      }

      const password = generatePassword(config)
      setGeneratedPassword(password)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成密码时发生错误')
      setGeneratedPassword('')
    }
  }

  // 复制密码到剪贴板
  const handleCopyPassword = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword)
        alert('密码已复制到剪贴板')
      } catch (err) {
        console.error('复制失败:', err)
        alert('复制失败，请手动选择复制')
      }
    }
  }

  const passwordStrength = generatedPassword ? getPasswordStrength(generatedPassword) : null

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 安全密码生成器</h1>
        <p>基于个人安全问题生成唯一、高强度的记忆性密码</p>
      </header>

      <main className="main-content">
        {/* 步骤1: 选择安全问题 */}
        <section className="step">
          <div className="step-header">
            <h2>步骤 1: 选择安全问题 (已选择 {selectedQuestions.length} 个)</h2>
            <button 
              onClick={setDefaultConfig}
              className="default-config-btn"
              title="使用推荐的默认配置：年度周期，8位密码，隐私性好的安全问题"
            >
              🎯 使用默认配置
            </button>
          </div>
          <div className="questions-container">
            {/* 自定义问题区域 */}
            <div className="custom-questions-section">
              <div className="custom-header">
                <h3>🎨 自定义安全问题</h3>
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="add-custom-btn"
                  title="添加您自己的安全问题"
                >
                  {showCustomForm ? '❌ 取消' : '➕ 添加问题'}
                </button>
              </div>
              
              {showCustomForm && (
                <div className="custom-form">
                  <div className="custom-input-group">
                    <label htmlFor="custom-question">问题内容：</label>
                    <input
                      id="custom-question"
                      type="text"
                      value={newCustomQuestion}
                      onChange={(e) => setNewCustomQuestion(e.target.value)}
                      placeholder="例如：您的第一只宠物叫什么名字？"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-input-group">
                    <label htmlFor="custom-placeholder">答案提示（可选）：</label>
                    <input
                      id="custom-placeholder"
                      type="text"
                      value={newCustomPlaceholder}
                      onChange={(e) => setNewCustomPlaceholder(e.target.value)}
                      placeholder="例如：请输入宠物名字"
                      className="custom-input"
                    />
                  </div>
                  <div className="custom-form-actions">
                    <button
                      onClick={addCustomQuestion}
                      className="save-custom-btn"
                    >
                      ✓ 保存问题
                    </button>
                  </div>
                </div>
              )}
              
              {/* 显示已添加的自定义问题 */}
              {customQuestions.length > 0 && (
                <div className="custom-questions-list">
                  <h4>已添加的自定义问题：</h4>
                  <div className="questions-grid">
                    {customQuestions.map(question => (
                      <div key={question.id} className="custom-question-item">
                        <button
                          className={`question-btn ${selectedQuestions.find(q => q.id === question.id) ? 'selected' : ''}`}
                          onClick={() => handleQuestionSelect(question)}
                        >
                          {question.question}
                        </button>
                        <button
                          onClick={() => removeCustomQuestion(question.id)}
                          className="remove-custom-btn"
                          title="删除该自定义问题"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 原有的问题分类 */}
            {Object.entries(systemGroupedQuestions).map(([category, questions]) => (
              <div key={category} className="question-category">
                <h3>{getCategoryName(category as SecurityQuestion['category'])}</h3>
                <div className="questions-grid">
                  {questions.map(question => (
                    <button
                      key={question.id}
                      className={`question-btn ${
                        selectedQuestions.find(q => q.id === question.id) ? 'selected' : ''
                      }`}
                      onClick={() => handleQuestionSelect(question)}
                    >
                      {question.question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 步骤2: 输入答案 */}
        {selectedQuestions.length > 0 && (
          <section className="step">
            <h2>步骤 2: 输入安全问题答案</h2>
            <div className="answers-container">
              {selectedQuestions.map((question, index) => {
                const isCustom = question.id.startsWith('custom_')
                return (
                  <div key={question.id} className="answer-item">
                    <label htmlFor={question.id}>
                      <span className="question-number">{index + 1}.</span>
                      {question.question}
                      {isCustom && <span className="custom-tag">🎨 自定义</span>}
                    </label>
                    <input
                      id={question.id}
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      className="answer-input"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 步骤3: 选择密码周期和强度 */}
        <section className="step">
          <h2>步骤 3: 设置密码参数</h2>
          <div className="settings-container">
            <div className="setting-group">
              <label>密码更换周期：</label>
              
              {/* 年份选择 */}
              <div className="period-selector">
                <label className="period-label">选择年份：</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="year-select"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>
                <div className="selected-year-display">
                  <small>当前选择：{selectedYear}年</small>
                </div>
              </div>

              {/* 周期类型选择 */}
              <div className="period-selector">
                <label className="period-label">选择周期类型：</label>
                <div className="period-type-buttons">
                  <button
                    type="button"
                    className={`period-type-btn ${selectedPeriodType === 'year' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriodType('year')}
                  >
                    年度
                  </button>
                  <button
                    type="button"
                    className={`period-type-btn ${selectedPeriodType === 'half' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriodType('half')}
                  >
                    半年
                  </button>
                  <button
                    type="button"
                    className={`period-type-btn ${selectedPeriodType === 'quarter' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriodType('quarter')}
                  >
                    季度
                  </button>
                </div>
              </div>

              {/* 具体周期选择 */}
              {selectedPeriodType === 'half' && (
                <div className="period-selector">
                  <label className="period-label">选择半年：</label>
                  <div className="period-detail-buttons">
                    <button
                      type="button"
                      className={`period-detail-btn ${selectedHalf === 1 ? 'active' : ''}`}
                      onClick={() => setSelectedHalf(1)}
                    >
                      上半年 (H1)
                    </button>
                    <button
                      type="button"
                      className={`period-detail-btn ${selectedHalf === 2 ? 'active' : ''}`}
                      onClick={() => setSelectedHalf(2)}
                    >
                      下半年 (H2)
                    </button>
                  </div>
                </div>
              )}

              {selectedPeriodType === 'quarter' && (
                <div className="period-selector">
                  <label className="period-label">选择季度：</label>
                  <div className="period-detail-buttons">
                    <button
                      type="button"
                      className={`period-detail-btn ${selectedQuarter === 1 ? 'active' : ''}`}
                      onClick={() => setSelectedQuarter(1)}
                    >
                      第一季度 (Q1)
                    </button>
                    <button
                      type="button"
                      className={`period-detail-btn ${selectedQuarter === 2 ? 'active' : ''}`}
                      onClick={() => setSelectedQuarter(2)}
                    >
                      第二季度 (Q2)
                    </button>
                    <button
                      type="button"
                      className={`period-detail-btn ${selectedQuarter === 3 ? 'active' : ''}`}
                      onClick={() => setSelectedQuarter(3)}
                    >
                      第三季度 (Q3)
                    </button>
                    <button
                      type="button"
                      className={`period-detail-btn ${selectedQuarter === 4 ? 'active' : ''}`}
                      onClick={() => setSelectedQuarter(4)}
                    >
                      第四季度 (Q4)
                    </button>
                  </div>
                </div>
              )}

              {/* 显示当前选择的周期 */}
              <div className="current-period">
                <small>当前选择的周期：<strong>{generateTimePeriod()}</strong></small>
              </div>
            </div>

            <div className="setting-group">
              <label>密码长度：</label>
              <div className="length-control">
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="length-slider"
                />
                <span className="length-value">{passwordLength} 位</span>
              </div>
            </div>
          </div>
        </section>

        {/* 生成按钮 */}
        <section className="step">
          <button
            onClick={handleGeneratePassword}
            className="generate-btn"
            disabled={selectedQuestions.length === 0 || selectedQuestions.some(q => !answers[q.id]?.trim())}
          >
            🎯 生成密码
          </button>
        </section>

        {/* 错误提示 */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* 生成结果 */}
        {generatedPassword && (
          <section className="step result-section">
            <h2>生成的密码</h2>
            <div className="password-result">
              <div className="password-display">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={generatedPassword}
                  readOnly
                  className="password-input"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-visibility"
                  title={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? '🙈 隐藏' : '👁️ 显示'}
                </button>
                <button
                  onClick={handleCopyPassword}
                  className="copy-btn"
                >
                  📋 复制
                </button>
              </div>
              
              <div className="password-info">
                <div className={`strength-indicator strength-${passwordStrength}`}>
                  强度: {
                    passwordStrength === 'weak' ? '弱' :
                    passwordStrength === 'medium' ? '中等' : '强'
                  }
                </div>
                <div className="password-length">
                  长度: {generatedPassword.length} 位
                </div>
              </div>
            </div>
            
            <div className="password-tips">
              <h3>💡 重要提示</h3>
              <ul>
                <li>这个密码是根据您的安全问题答案和选择的时间周期生成的</li>
                <li>相同的答案和时间周期总是会生成相同的密码</li>
                <li>请妥善保管您的安全问题答案</li>
                <li>建议根据您选择的周期定期更换密码</li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
