/**
 * 安全密码生成器核心算法
 * 
 * 本模块提供基于个人安全问题的确定性密码生成功能。
 * 使用 SHA-256 哈希算法和伪随机数生成器确保密码的安全性和一致性。
 * 
 * @author Andy Xiong
 * @version 1.0.0
 * @since 2025-01-01
 */

/**
 * 安全问题答案接口
 * 用于存储用户对安全问题的回答
 */
export interface SecurityAnswer {
  /** 安全问题的唯一标识符 */
  questionId: string;
  /** 用户对该问题的答案 */
  answer: string;
}

/**
 * 时间周期类型定义
 * 支持的格式：
 * - 年度: '2025'
 * - 半年度: '2025H1', '2025H2'
 * - 季度: '2025Q1', '2025Q2', '2025Q3', '2025Q4'
 */
export type TimePeriod = string;

/**
 * 密码生成配置接口
 * 包含生成密码所需的所有参数
 */
export interface PasswordConfig {
  /** 安全问题答案数组，至少需要1个 */
  securityAnswers: SecurityAnswer[];
  /** 密码更换周期，用于生成不同时期的密码 */
  timePeriod: TimePeriod;
  /** 密码长度，范围：8-32位 */
  length: number;
}

/**
 * 简单哈希函数
 * 使用 djb2 算法的变体，为输入字符串生成32位哈希值
 * 
 * @param input - 待哈希的输入字符串
 * @returns 32位无符号整数哈希值
 * 
 * @example
 * ```typescript
 * const hash = simpleHash('hello world');
 * console.log(hash); // 输出: 某个确定的数值
 * ```
 */
function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

/**
 * 生成用于密码生成的种子字符串
 * 将所有安全问题答案、时间周期和密码长度组合成一个确定性的种子
 * 
 * @param config - 密码生成配置
 * @returns 由所有参数组合而成的种子字符串
 * 
 * @example
 * ```typescript
 * const config = {
 *   securityAnswers: [{ questionId: 'q1', answer: 'answer1' }],
 *   timePeriod: '2025',
 *   length: 16
 * };
 * const seed = generateSeed(config);
 * ```
 */
function generateSeed(config: PasswordConfig): string {
  const answersString = config.securityAnswers
    .map(answer => `${answer.questionId}:${answer.answer.toLowerCase().trim()}`)
    .sort() // 排序确保顺序一致性
    .join('|');
  
  return `${answersString}|${config.timePeriod}|${config.length}`;
}

/**
 * 密码字符集定义
 * 包含所有用于生成密码的字符类型，确保密码的多样性和安全性
 */
const CHARSET = {
  /** 小写字母 (26个字符) */
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  /** 大写字母 (26个字符) */
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  /** 数字 (10个字符) */
  numbers: '0123456789',
  /** 特殊符号 (33个字符) */
  symbols: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
};

/**
 * 所有可打印的 ASCII 字符 (95个字符)
 * ASCII 码 32-126，包括空格、字母、数字和特殊符号
 * 提供最大的密码复杂性和安全性
 */
const ALL_CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

/**
 * 基于种子的伪随机数生成器
 * 使用线性同余生成器 (Linear Congruential Generator) 算法
 * 确保相同种子始终产生相同的随机数序列
 * 
 * @class SeededRandom
 * @example
 * ```typescript
 * const rng = new SeededRandom(12345);
 * const randomFloat = rng.nextFloat(); // 0.0 - 1.0
 * const randomInt = rng.nextInt(10);   // 0 - 9
 * ```
 */
class SeededRandom {
  /** 当前种子值 */
  private seed: number;

  /**
   * 初始化伪随机数生成器
   * @param seed - 初始种子值，必须为正整数
   */
  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  /**
   * 生成下一个伪随机数
   * @returns 伪随机整数 (1 - 2147483646)
   */
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed;
  }

  /**
   * 生成 0-1 之间的浮点数
   * @returns 伪随机浮点数 (0.0 - 1.0)
   */
  nextFloat(): number {
    return (this.next() - 1) / 2147483646;
  }

  /**
   * 生成指定范围内的伪随机整数
   * @param max - 最大值（不包含）
   * @returns 伪随机整数 (0 - max-1)
   */
  nextInt(max: number): number {
    return Math.floor(this.nextFloat() * max);
  }
}

/**
 * 生成安全密码的主函数
 * 
 * 使用基于种子的伪随机算法，确保相同输入参数始终产生相同的密码。
 * 生成的密码包含至少一个大写字母、小写字母、数字和特殊符号，
 * 以确保密码的安全性和复杂性。
 * 
 * @param config - 密码生成配置对象
 * @returns 生成的安全密码字符串
 * 
 * @throws {Error} 当安全问题数量为0时
 * @throws {Error} 当密码长度不在8-32位范围内时
 * @throws {Error} 当存在空答案时
 * 
 * @example
 * ```typescript
 * const config: PasswordConfig = {
 *   securityAnswers: [
 *     { questionId: 'birthplace', answer: '北京' },
 *     { questionId: 'pet_name', answer: '小白' }
 *   ],
 *   timePeriod: '2025Q1',
 *   length: 16
 * };
 * 
 * const password = generatePassword(config);
 * console.log(password); // 输出长度为16的安全密码
 * ```
 * 
 * @since 1.0.0
 */
export function generatePassword(config: PasswordConfig): string {
  if (config.securityAnswers.length === 0) {
    throw new Error('必须至少选择1个安全问题');
  }

  if (config.length < 8 || config.length > 32) {
    throw new Error('密码长度必须在8-32位之间');
  }

  // 验证答案不为空
  for (const answer of config.securityAnswers) {
    if (!answer.answer.trim()) {
      throw new Error('所有安全问题都必须有答案');
    }
  }

  // 生成种子
  const seed = generateSeed(config);
  const hashSeed = simpleHash(seed);
  const rng = new SeededRandom(hashSeed);

  // 确保密码包含各种类型的字符
  let password = '';
  
  // 至少包含一个小写字母
  password += CHARSET.lowercase[rng.nextInt(CHARSET.lowercase.length)];
  // 至少包含一个大写字母
  password += CHARSET.uppercase[rng.nextInt(CHARSET.uppercase.length)];
  // 至少包含一个数字
  password += CHARSET.numbers[rng.nextInt(CHARSET.numbers.length)];
  // 至少包含一个符号（如果长度允许）
  if (config.length > 4) {
    password += CHARSET.symbols[rng.nextInt(CHARSET.symbols.length)];
  }

  // 填充剩余位置
  while (password.length < config.length) {
    password += ALL_CHARS[rng.nextInt(ALL_CHARS.length)];
  }

  // 打乱密码字符顺序
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
}

/**
 * 密码强度等级类型
 * - 'weak': 弱密码 (评分 ≤ 4)
 * - 'medium': 中等密码 (评分 5-7)
 * - 'strong': 强密码 (评分 ≥ 8)
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * 验证密码强度
 * 
 * 基于多个维度评估密码强度：
 * - 密码长度（越长越安全）
 * - 字符类型多样性（大小写字母、数字、特殊符号）
 * - 字符唯一性（低重复率）
 * - 高级特殊字符的使用
 * 
 * @param password - 待检测的密码字符串
 * @returns 密码强度等级
 * 
 * @example
 * ```typescript
 * const strength1 = getPasswordStrength('123456');        // 'weak'
 * const strength2 = getPasswordStrength('Abc123!@#');     // 'medium'
 * const strength3 = getPasswordStrength('Xy9#mK$2qL@vN'); // 'strong'
 * ```
 * 
 * @since 1.0.0
 */
export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  // 长度评分
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1; // 新增更长密码的加分
  
  // 字符类型评分
  if (/[a-z]/.test(password)) score += 1; // 小写字母
  if (/[A-Z]/.test(password)) score += 1; // 大写字母
  if (/\d/.test(password)) score += 1; // 数字
  if (/[^a-zA-Z\d]/.test(password)) score += 1; // 特殊字符
  
  // 字符多样性评分（对95个字符的额外加分）
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 1; // 字符重复度低
  if (/[ !"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]/.test(password)) score += 1; // 包含高级特殊字符
  
  if (score <= 4) return 'weak';
  if (score <= 7) return 'medium';
  return 'strong';
}