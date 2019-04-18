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

export async function save(params) {
  return request(`${Constants.baseUrl}dataVote/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function edit(params) {
  return request(`${Constants.baseUrl}dataVote/edit`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function updateDataVote(params) {
  return request(`${Constants.baseUrl}dataVote/updateDataVote`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function view(params) {
  return request(`${Constants.baseUrl}dataVote/view`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function download1(params) {
  return downloadRequest(
    `${Constants.baseUrl}dataVote/download1`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    `${params.fileTitle}_${moment().format('YYYYMMDDHHmmss')}.xls`
  );
}
