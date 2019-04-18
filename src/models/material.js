import { list } from '@/services/material';

export default {
  namespace: 'material',

  state: {
    data: {
      content: [],
      pageNumber: 1,
      pageSize: 20,
      total: 0,
    },
    extraParam: {
      STORAGE_ADDRESS: '',
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
        data: action.payload.page,
        extraParam: {
          STORAGE_ADDRESS: action.payload.extraParam.STORAGE_ADDRESS || '',
        },
      };
    },
  },
};
