export interface WhitelistForm {
  userName: string;
  qqNum: string;
  onlineFlag: '0' | '1';
  remark?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg?: string;
}

export interface ServerStatus {
  name: string;
  playerCount: number;
  players: string[];
}

export interface OnlinePlayerResponse {
  [serverName: string]: {
    '在线人数': number;
    '在线玩家': string;
  } | string;
  '查询时间': string;
}

export interface WhitelistMember {
  [key: string]: string | number;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: 1 | 2 | 3 | 4; // 1:单选 2:多选 3:填空 4:验证
  isRequired: 0 | 1;
  sortOrder: number;
  verificationId?: number;
  whitelistQuizAnswerVoList?: Answer[];
}

export interface Answer {
  id: number;
  answerText: string;
}

export interface QuizSubmission {
  code: string;
  answers: {
    questionId: number;
    answer: string;
    verificationId?: number;
  }[];
}
