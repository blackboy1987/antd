import {
  list,
  remove,
  download,
  save,
  edit,
  updateDataVote,
  view,
  download1,
} from '@/services/dataVote';

export default {
  namespace: 'dataVote',

  state: {
    data: {
      content: [],
      pageNumber: 1,
      pageSize: 20,
      total: 0,
    },
    values: {},
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
    *save({ payload, callback }, { call }) {
      const response = yield call(save, payload);
      if (callback) {
        callback(response);
      }
    },

    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'editInfo',
        payload: response,
      });
    },

    *updateDataVote({ payload, callback }, { call }) {
      const response = yield call(updateDataVote, payload);
      if (callback) {
        callback(response);
      }
    },
    *view({ payload, callback }, { call }) {
      const response = yield call(view, payload);
      if (callback) {
        callback(response);
      }
    },
    *download1({ payload, callback }, { call }) {
      const response = yield call(download1, payload);
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
    editInfo(state, action) {
      return {
        ...state,
        values: action.payload,
      };
    },
  },
};
