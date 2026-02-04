import request from '@/lib/request';
import type { ApiResponse } from '@/lib/request';

/**
 * 白名单申请表单
 */
export interface WhitelistForm {
  userName: string;
  qqNum: string;
  onlineFlag: '0' | '1';
  remark?: string;
}

/**
 * 白名单申请
 */
export function applyWhitelist(data: WhitelistForm) {
  return request.post('/api/v1/apply', data) as Promise<ApiResponse>;
}

/**
 * 验证白名单
 */
export function verifyWhitelist(code: string) {
  return request.get('/api/v1/verify', {
    params: { code }
  }) as Promise<ApiResponse>;
}

/**
 * 检查白名单成员详情
 */
export function checkMemberDetail(id: string) {
  return request.get('/api/v1/check', {
    params: { id }
  });
}

/**
 * 获取白名单列表
 */
export function getWhiteList() {
  return request.get('/api/v1/getWhiteList');
}
