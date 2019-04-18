import { list, install, uninstall, update, setting } from '@/services/channelPlugin';

export default {
  namespace: 'channelPlugin',

  state: {
    data: {
      list: [],
    },
    channelPluginInfo: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'listInfo',
        payload: response,
      });
    },
    *install({ payload, callback }, { call }) {
      const response = yield call(install, payload);
      if (callback) {
        callback(response);
      }
    },
    *uninstall({ payload, callback }, { call }) {
      const response = yield call(uninstall, payload);
      if (callback) {
        callback(response);
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (callback) {
        callback(response);
      }
    },
    *setting({ payload }, { call, put }) {
      const response = yield call(setting, payload);
      yield put({
        type: 'channelPluginInfo',
        payload: response,
      });
    },
  },

  reducers: {
    listInfo(state, action) {
      return {
        ...state,
        data: {
          list: action.payload,
        },
      };
    },
    channelPluginInfo(state, action) {
      return {
        ...state,
        channelPluginInfo: action.payload,
      };
    },
  },
};
