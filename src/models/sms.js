import { list } from '@/services/sms';

export default {
  namespace: 'sms',

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
