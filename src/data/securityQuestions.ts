/**
 * 安全问题数据库
 * 
 * 这个模块定义了用于密码生成的安全问题集合。
 * 所有问题按照不同类别分组，以便用户选择适合的问题组合。
 * 
 * @author Andy Xiong
 * @version 1.0.0
 * @since 2025-01-01
 */

/**
 * 安全问题接口定义
 * 定义了每个安全问题必须包含的属性
 */
export interface SecurityQuestion {
  /** 问题的唯一标识符 */
  id: string;
  /** 问题的具体内容 */
  question: string;
  /** 问题所属的类别 */
  category: 'personal' | 'family' | 'preferences' | 'memory' | 'location';
  /** 输入框的提示文字 */
  placeholder: string;
}

export const SECURITY_QUESTIONS: SecurityQuestion[] = [
  // 个人信息类
  {
    id: 'pet_name',
    question: '您第一只宠物的名字是什么？',
    category: 'personal',
    placeholder: '例如：小白'
  },
  {
    id: 'childhood_nickname',
    question: '您童年时的昵称是什么？',
    category: 'personal',
    placeholder: '例如：小明'
  },
  {
    id: 'favorite_teacher',
    question: '您最喜欢的老师的姓氏是什么？',
    category: 'personal',
    placeholder: '例如：王'
  },
  {
    id: 'first_job',
    question: '您的第一份工作是什么？',
    category: 'personal',
    placeholder: '例如：服务员'
  },
  {
    id: 'childhood_friend',
    question: '您童年最好朋友的名字是什么？',
    category: 'personal',
    placeholder: '例如：李小红'
  },

  // 家庭类
  {
    id: 'mother_maiden_name',
    question: '您母亲的娘家姓是什么？',
    category: 'family',
    placeholder: '例如：张'
  },
  {
    id: 'father_middle_name',
    question: '您父亲的名字是什么？',
    category: 'family',
    placeholder: '例如：建国'
  },
  {
    id: 'sibling_name',
    question: '您兄弟姐妹的名字是什么？',
    category: 'family',
    placeholder: '例如：小华'
  },
  {
    id: 'grandparent_name',
    question: '您祖父母的名字是什么？',
    category: 'family',
    placeholder: '例如：爷爷的名字'
  },
  {
    id: 'spouse_maiden_name',
    question: '您配偶的姓氏是什么？',
    category: 'family',
    placeholder: '例如：赵'
  },

  // 喜好类
  {
    id: 'favorite_movie',
    question: '您最喜欢的电影是什么？',
    category: 'preferences',
    placeholder: '例如：泰坦尼克号'
  },
  {
    id: 'favorite_book',
    question: '您最喜欢的书籍是什么？',
    category: 'preferences',
    placeholder: '例如：红楼梦'
  },
  {
    id: 'favorite_food',
    question: '您最喜欢的食物是什么？',
    category: 'preferences',
    placeholder: '例如：饺子'
  },
  {
    id: 'favorite_color',
    question: '您最喜欢的颜色是什么？',
    category: 'preferences',
    placeholder: '例如：蓝色'
  },
  {
    id: 'favorite_sport',
    question: '您最喜欢的运动是什么？',
    category: 'preferences',
    placeholder: '例如：篮球'
  },
  {
    id: 'favorite_singer',
    question: '您最喜欢的歌手是谁？',
    category: 'preferences',
    placeholder: '例如：周杰伦'
  },

  // 记忆类
  {
    id: 'first_car',
    question: '您第一辆车的品牌是什么？',
    category: 'memory',
    placeholder: '例如：丰田'
  },
  {
    id: 'first_phone',
    question: '您第一部手机的品牌是什么？',
    category: 'memory',
    placeholder: '例如：诺基亚'
  },
  {
    id: 'wedding_location',
    question: '您举办婚礼的城市是哪里？',
    category: 'memory',
    placeholder: '例如：北京'
  },
  {
    id: 'graduation_year',
    question: '您高中毕业的年份是哪一年？',
    category: 'memory',
    placeholder: '例如：2010'
  },
  {
    id: 'memorable_date',
    question: '对您最有意义的日期是什么？',
    category: 'memory',
    placeholder: '例如：0101（月日格式）'
  },

  // 地点类
  {
    id: 'birth_city',
    question: '您出生的城市是哪里？',
    category: 'location',
    placeholder: '例如：上海'
  },
  {
    id: 'elementary_school',
    question: '您就读的小学名称是什么？',
    category: 'location',
    placeholder: '例如：希望小学'
  },
  {
    id: 'honeymoon_destination',
    question: '您蜜月旅行的目的地是哪里？',
    category: 'location',
    placeholder: '例如：巴厘岛'
  },
  {
    id: 'childhood_street',
    question: '您童年时居住的街道名称是什么？',
    category: 'location',
    placeholder: '例如：人民路'
  },
  {
    id: 'favorite_vacation',
    question: '您最喜欢的度假地点是哪里？',
    category: 'location',
    placeholder: '例如：三亚'
  }
];

/**
 * 按类别获取安全问题
 * 
 * @param category - 问题类别
 * @returns 指定类别的所有安全问题
 * 
 * @example
 * ```typescript
 * const personalQuestions = getQuestionsByCategory('personal');
 * console.log(personalQuestions.length); // 输出个人信息类问题数量
 * ```
 */
export function getQuestionsByCategory(category: SecurityQuestion['category']): SecurityQuestion[] {
  return SECURITY_QUESTIONS.filter(q => q.category === category);
}

/**
 * 随机获取指定数量的安全问题
 * 
 * @param count - 需要获取的问题数量
 * @returns 随机选取的安全问题数组
 * 
 * @example
 * ```typescript
 * const randomQuestions = getRandomQuestions(3);
 * console.log(randomQuestions.length); // 3
 * ```
 */
export function getRandomQuestions(count: number): SecurityQuestion[] {
  const shuffled = [...SECURITY_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * 根据ID获取安全问题
 * 
 * @param id - 问题的唯一标识符
 * @returns 找到的安全问题，如果不存在则返回 undefined
 * 
 * @example
 * ```typescript
 * const question = getQuestionById('pet_name');
 * if (question) {
 *   console.log(question.question); // 输出问题内容
 * }
 * ```
 */
export function getQuestionById(id: string): SecurityQuestion | undefined {
  return SECURITY_QUESTIONS.find(q => q.id === id);
}

/**
 * 获取问题类别的中文名称
 * 
 * @param category - 问题类别英文标识
 * @returns 类别的中文名称
 * 
 * @example
 * ```typescript
 * const categoryName = getCategoryName('personal');
 * console.log(categoryName); // '个人信息'
 * ```
 */
export function getCategoryName(category: SecurityQuestion['category']): string {
  const categoryNames = {
    personal: '个人信息',
    family: '家庭信息', 
    preferences: '个人喜好',
    memory: '重要记忆',
    location: '地点信息'
  };
  return categoryNames[category];
}