import request from '@/utils/request1';
import Constants from '@/utils/constants';

export async function list(params) {
  return request(`${Constants.baseUrl}log_sms/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function list1(params) {
  return request(`${Constants.baseUrl}sms/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
