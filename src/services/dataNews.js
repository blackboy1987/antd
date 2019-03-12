import request from '@/utils/request1';
import Constants from '../utils/constants';

export async function list(params) {
  return request(`${Constants.baseUrl}data_news/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function configChannel(params) {
  return request(`${Constants.baseUrl}data_news/config_channel`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function configTopic(params) {
  return request(`${Constants.baseUrl}data_news/config_topic`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reset(params) {
  return request(`${Constants.baseUrl}data_news/reset`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
