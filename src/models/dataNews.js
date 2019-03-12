import { list, configChannel, configTopic, reset } from '@/services/dataNews';

export default {
  namespace: 'dataNews',

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
    *configChannel({ callback, payload }, { call }) {
      const response = yield call(configChannel, payload);
      if (callback) {
        callback(response);
      }
    },
    *configTopic({ callback, payload }, { call }) {
      const response = yield call(configTopic, payload);
      if (callback) {
        callback(response);
      }
    },
    *reset({ callback, payload }, { call }) {
      const response = yield call(reset, payload);
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
