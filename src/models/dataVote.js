import { list, remove, download } from '@/services/dataVote';

export default {
  namespace: 'dataVote',

  state: {
    data: {
      content: [],
      pageNumber: 1,
      pageSize: 20,
      total: 0,
    },
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'listInfo',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) {
        callback(response);
      }
    },
    *download({ payload, callback }, { call }) {
      const response = yield call(download, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    listInfo(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
