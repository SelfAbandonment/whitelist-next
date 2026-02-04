import request from '@/lib/request';
import type { ApiResponse } from '@/lib/request';

/**
 * 更改ID请求表单
 */
export interface ChangeIdRequest {
  oldUserName: string;
  newUserName: string;
  qqNum: string;
  changeReason?: string;
}

/**
 * 请求更改游戏ID
 */
export function requestChangeId(data: ChangeIdRequest) {
  return request.post('/api/v1/requestChangeId', data) as Promise<ApiResponse>;
}

/**
 * 确认更改游戏ID
 */
export function confirmChangeId(code: string, qqNum: string) {
  return request.post(`/api/v1/confirmChangeId?code=${code}&qqNum=${qqNum}`) as Promise<ApiResponse>;
}

/**
 * 查询更改历史（管理员）
 */
export function getChangeHistory(params?: {
  pageNum?: number;
  pageSize?: number;
  oldUserName?: string;
  newUserName?: string;
  qqNum?: string;
  status?: string;
}) {
  return request.get('/api/v1/changeHistory/list', { params });
}

/**
 * 导出更改历史（管理员）
 */
export function exportChangeHistory(params?: {
  oldUserName?: string;
  newUserName?: string;
  qqNum?: string;
  status?: string;
}) {
  return request.post('/api/v1/changeHistory/export', params, {
    responseType: 'blob'
  });
}
