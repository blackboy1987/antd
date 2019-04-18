import request from '@/utils/request1';
import Constants from '../utils/constants';

export async function list(params) {
  return request(`${Constants.baseUrl}material/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function configChannel(params) {
  return request(`${Constants.baseUrl}material/config_channel`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function configTopic(params) {
  return request(`${Constants.baseUrl}material/config_topic`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reset(params) {
  return request(`${Constants.baseUrl}material/reset`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
