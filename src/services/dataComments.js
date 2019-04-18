import request from '@/utils/request1';
import Constants from '../utils/constants';
import downloadRequest from '@/utils/downloadRequest';
import moment from 'moment';

export async function list(params) {
  return request(`${Constants.baseUrl}data_comments/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function remove(params) {
  return request(`${Constants.baseUrl}data_comments/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function pass(params) {
  return request(`${Constants.baseUrl}data_comments/pass`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reject(params) {
  return request(`${Constants.baseUrl}data_comments/reject`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function addComments(params) {
  return request(`${Constants.baseUrl}data_comments/add_comments`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function updatePraise(params) {
  return request(`${Constants.baseUrl}data_comments/updatePraise`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function download(params) {
  return downloadRequest(
    `${Constants.baseUrl}data_comments/download`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    `${params.fileTitle}_${moment().format('YYYYMMDDHHmmss')}.xls`
  );
}
