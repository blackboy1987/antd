import request from '@/utils/request1';
import Constants from '../utils/constants';

export async function list(params) {
  return request(`${Constants.baseUrl}channel_plugin/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function install(params) {
  return request(`${Constants.baseUrl}${params.installUrl}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function uninstall(params) {
  return request(`${Constants.baseUrl}${params.uninstallUrl}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function update(params) {
  return request(`${Constants.baseUrl}${params.updateUrl}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function setting(params) {
  return request(`${Constants.baseUrl}${params.settingUrl}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
