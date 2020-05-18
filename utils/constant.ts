export enum TABS {
  recommend,
  store,
  my,
  no,
}

export const API_URL: string = "/api";
export const SERVER_API_URL: string = "http://127.0.0.1:7777/api";
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

export enum CATEGORIES {
  ELECTRONIC = "ELECTRONIC",
  DIGITAL = "DIGITAL",
  ART = "ART",
  MAKEUP = "MAKEUP",
  DRESS = "DRESS",
  BAG = "BAG",
  IMPORT = "IMPORT",
  BOOK = "BOOK",
  KNOWLEDGE = "KNOWLEDGE",
  OTHER = "OTHER",
}

export const CATEGORIES_MAP = {
  ART : "艺术",
  BAG : "箱包",
  BOOK : "书籍",
  DIGITAL : "数码",
  DRESS : "穿搭",
  ELECTRONIC : "电子",
  IMPORT : "进口",
  KNOWLEDGE : "知识付费",
  MAKEUP : "美妆",
  OTHER : "其他",
};

export enum ACCOUNT_TYPE {
  ROOT = "ROOT",
  AGENT = "AGENT",
}

export enum STATUS {
  OK = "0",
}

export enum LANGS {
  en = "en",
  cn = "cn",
}
