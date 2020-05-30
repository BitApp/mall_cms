import { faCheck, faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IOST from "iost";
import cookies from "js-cookie";
import { WithTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import ImageUploading from "react-images-uploading";
import { connect } from "react-redux";
import ReactTags from "react-tag-autocomplete";
import { bindActionCreators, Dispatch } from "redux";
import Tips from "../../../components/Tips";
import { withTranslation } from "../../../i18n";
import {
  closeAlert,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../../../store/actions";
import { getAxios } from "../../../utils/axios";
import { API_URL, CATEGORIES, CATEGORIES_MAP, STATUS, CONTRACT_ADDRESS } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";
const FrameLayout = dynamic(() => import("../../../components/FrameLayout"),  { ssr: false });

import "../../../styles/react-tags.scss";

interface IProps extends WithTranslation {
  agentAccounts: [any];
  errorMessage: string;
  showError: boolean;
  showSuccess: boolean;
  successMessage: string;
  isLoading: boolean;
  wallet: string;
  setWallet: (wallet: string) => Promise<void>;
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;
  closeAlert: () => void;
}

interface IState {
  symbol: string;
  totalSupply: number;
  decimal: number;
  fullName: string;
}

class NewToken extends React.Component<IProps, IState> {
  public static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"],
    };
  }

  public state: IState = {
    decimal: 8,
    fullName: "",
    symbol: "",
    totalSupply: 21000000,
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
  }

  public render() {
    const { decimal, symbol, totalSupply, fullName } = this.state;
    const {
      t,
      i18n,
      isLoading } = this.props;
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
          <div className="p-2 border-gray-400 border-b-2 text-blue-600 cursor-pointer" >
            <span onClick={ () => { Router.push("/manage/token"); } }>
              <svg viewBox="0 0 20 20"
              className="fill-current h-5 w-5 align-middle inline-block">
                <path fill="#3182ce" d="M12.452,4.516c0.446,0.436,0.481,1.043,0,1.576L8.705,10l3.747,3.908c0.481,0.533,0.446,1.141,0,1.574  c-0.445,0.436-1.197,0.408-1.615,0c-0.418-0.406-4.502-4.695-4.502-4.695C6.112,10.57,6,10.285,6,10s0.112-0.57,0.335-0.789  c0,0,4.084-4.287,4.502-4.695C11.255,4.107,12.007,4.08,12.452,4.516z"/>
              </svg>
              <span className="align-middle ml-1">返回</span>
            </span>
          </div>
          <form className="w-full max-w-lg mt-4">
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Symbol
                </label>
                <input
                autoFocus
                onChange={(evt) => { this.setState({ symbol: evt.target.value.trim() }); }}
                value={symbol}
                minLength={2}
                maxLength={16}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                placeholder="Symbol"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  FullName
                </label>
                <input
                onChange={(evt) => { this.setState({ fullName: evt.target.value.trim() }); }}
                value={fullName}
                maxLength={ 20 }
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                placeholder="FullName"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  精度(decimal)
                </label>
                <input onChange={(evt) => { this.setState({ decimal: Number(evt.target.value) }); }} value={decimal}
                type="number"
                min="1"
                step="100"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="精度(decimal)"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  总量
                </label>
                <input
                onChange={ (evt) => { this.setState({ totalSupply: Number(evt.target.value.trim()) }); }}
                value={ totalSupply }
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"
                min="1"
                step="100"
                placeholder="总量"/>
              </div>
            </div>
            <div className="-mx-3 mt-8">
              <div className="w-full px-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(evt) => this.issueToken(evt)}>
                发行Token
              </button>
              </div>
            </div>
          </form>
        </div>
      </FrameLayout>
    );
  }

  public async issueToken(evt) {
    evt.preventDefault();
    if (this.state.symbol &&
      this.state.fullName &&
      this.state.decimal &&
      this.state.totalSupply) {
      if (confirm("确定发行Token?")) {
        const win = window as any;
        const iost = win.IWalletJS.newIOST(IOST);
        // const { wallet, t } = this.props;
        const that = this;
        const tx = iost.callABI(
          CONTRACT_ADDRESS,
          "issueToken",
          [
            this.state.symbol,
            this.state.totalSupply,
            this.state.decimal,
            this.state.fullName,
          ],
        );
        tx.gasLimit = 300000;
        // tx.addApprove("iost", price.toString());
        iost.signAndSend(tx).on("pending", (trx) => {
          console.info(trx);
        })
        .on("success", (result) => {
          // 刷新数据
          that.props.showSuccessMessage(this.state.symbol + "发行成功，请等待30左右刷新再次确认状态，请勿重复发行");
        })
        .on("failed", (failed) => {
          that.props.showErrorMessage(chainErrorMessage(failed));
        });
      }
    } else {
      alert("请填写完整相应字段");
    }
  }

  public initIwallet() {
    const timeInterval = setInterval(() => {
      const win = window as any;
      if (win.IWalletJS) {
          win.IWalletJS.enable().then((account) => {
          if (account) {
            clearInterval(timeInterval);
            this.props.setWallet(account);
          }
        });
      }
    }, 1000);
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      closeAlert,
      setWallet,
      showErrorMessage,
      showSuccessMessage,
    },
    dispatch,
  );
}

function mapStateToProps(state: any) {
  const { wallet, errorMessage, showError, showSuccess, successMessage, isLoading } = state;
  return { wallet, errorMessage, showError, showSuccess, successMessage, isLoading };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(NewToken));
