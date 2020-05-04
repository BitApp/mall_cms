import { ACTIONS } from "../utils/constant";

/*
 * action creators
 */

export function busy() {
  return { type: ACTIONS.BUSY };
}

export function free() {
  return { type: ACTIONS.FREE };
}

export function setLang(lang) {
  return { type: ACTIONS.SET_LANG, payload: { lang } };
}

export function setWallet(wallet) {
  return { type: ACTIONS.SET_WALLET, payload: { wallet } };
}

export function showErrorMessage(message) {
  return { type: ACTIONS.SHOW_ERROR_MESSAGE, payload: { message } };
}

export function showSuccessMessage(message) {
  return { type: ACTIONS.SHOW_SUCCESS_MESSAGE, payload: { message } };
}

export function closeAlert() {
  return { type: ACTIONS.CLOSE_ALERT, payload: null };
}

export function updateAccountInfo(accountInfo) {
  return { type: ACTIONS.UPDATE_ACCOUNT_INFO, payload: { accountInfo } };
}
