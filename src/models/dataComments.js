import {
  list,
  remove,
  pass,
  reject,
  addComments,
  updatePraise,
  download,
} from '@/services/dataComments';

export default {
  namespace: 'dataComments',

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
    *remove({ callback, payload }, { call }) {
      const response = yield call(remove, payload);
      if (callback) {
        callback(response);
      }
    },
    *pass({ callback, payload }, { call }) {
      const response = yield call(pass, payload);
      if (callback) {
        callback(response);
      }
    },
    *reject({ callback, payload }, { call }) {
      const response = yield call(reject, payload);
      if (callback) {
        callback(response);
      }
    },
    *addComments({ callback, payload }, { call }) {
      const response = yield call(addComments, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePraise({ callback, payload }, { call }) {
      const response = yield call(updatePraise, payload);
      if (callback) {
        callback(response);
      }
    },
    *download({ callback, payload }, { call }) {
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
