import { ACTIONS } from "../utils/constant";

const initialState = {
  accountInfo: {
    name: "",
    token: "",
    type: "",
  },
  errorMessage: "",
  isLoading: false,
  lang: "cn",
  path: "",
  showError: false,
  showSuccess: false,
  successMessage: "",
  wallet: "",
};

// store/index.ts
import { Action } from "redux";

interface IAuctionAction extends Action<ACTIONS> {
  payload: any;
}

export const reducer = (state = initialState, action: IAuctionAction) => {
  if (action.type === ACTIONS.SET_LANG) {
    const lang = /cn/i.test(action.payload.lang) ? "cn" : "en";
    return {
      ...state,
      lang,
    };
  } else if (action.type === ACTIONS.BUSY) {
    return {
      ...state,
      isLoading: true,
    };
  }  else if (action.type === ACTIONS.FREE) {
    return {
      ...state,
      isLoading: false,
    };
  } else if (action.type === ACTIONS.SET_WALLET) {
    return {
      ...state,
      wallet: action.payload.wallet,
    };
  } else if (action.type === ACTIONS.UPDATE_ACCOUNT_INFO) {
    return {
      ...state,
      accountInfo: action.payload.accountInfo,
    };
  } else if (action.type === ACTIONS.UPDATE_AGENT_ACCOUNT) {
    return {
      ...state,
      agentAccounts: action.payload.agentAccounts,
    };
  } else if (action.type === ACTIONS.UPDATE_PATH) {
    return {
      ...state,
      path: action.payload.path,
    };
  } else if (action.type === ACTIONS.SHOW_ERROR_MESSAGE) {
    return {
      ...state,
      errorMessage: action.payload.message,
      showError: true,
    };
  } else if (action.type === ACTIONS.SHOW_SUCCESS_MESSAGE) {
    return {
      ...state,
      showSuccess: true,
      successMessage: action.payload.message,
    };
  }  else if (action.type === ACTIONS.CLOSE_ALERT) {
    return {
      ...state,
      showError: false,
      showSuccess: false,
    };
  } else {
    return state;
  }
};

export type RootState = ReturnType<typeof reducer>;
