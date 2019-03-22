import request from '@/utils/request';
import Constants from '../utils/constants';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${Constants.baseUrl}currentUser`);
}
