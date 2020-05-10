export enum TABS {
  recommend,
  store,
  my,
  no,
}

export const API_URL: string = "/api";
export const SERVER_API_URL: string = "http://127.0.0.1:4000/api";
export const WEB_API_URL: string = "https://testauction.bitapp.net/webapi";
export const CHAIN_URL: string = "https://www.iostabc.com/endpoint/getBatchContractStorage";
export const CONTRACT_ADDRESS: string = "ContractCnVcjzfbxmPVi9DhLyrG2KTc1vknTp8bhmtkVrJ1354Y";

export enum ACTIONS {
  BUSY = "BUSY",
  FREE = "FREE",
  CLOSE_ALERT = "CLOSE_ALERT",
  SHOW_ERROR_MESSAGE = "SHOW_ERROR_MESSAGE",
  SHOW_SUCCESS_MESSAGE = "SHOW_SUCCESS_MESSAGE",
  SET_LANG = "SET_LANG",
  SET_WALLET = "SET_WALLET",
  UPDATE_ACCOUNT_INFO = "UPDATE_ACCOUNT_INFO",
  UPDATE_AGENT_ACCOUNT = "UPDATE_AGENT_ACCOUNT",
  UPDATE_PATH = "UPDATE_PATH",
}

export enum ACCOUNT_TYPE {
  ROOT = "root",
  AGENT = "agent",
}

export enum STATUS {
  OK = "0",
}

export enum LANGS {
  en = "en",
  cn = "cn",
}
