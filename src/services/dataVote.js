import request from '@/utils/request1';
import downloadRequest from '@/utils/downloadRequest';
import Constants from '@/utils/constants';
import moment from 'moment';

export async function list(params) {
  return request(`${Constants.baseUrl}dataVote/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function remove(params) {
  return request(`${Constants.baseUrl}dataVote/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function download(params) {
  return downloadRequest(
    `${Constants.baseUrl}dataVote/download`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    `投票下载_${moment().format('YYYYMMDDHHmmss')}.xls`
  );
}
