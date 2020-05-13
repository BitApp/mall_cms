import axios from "axios";
import IOST from "iost";
import cookies from "js-cookie";
import nextCookies from "next-cookies";
import { WithTranslation } from "next-i18next";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import ReactTags from "react-tag-autocomplete";
import { bindActionCreators, Dispatch } from "redux";
import FrameLayout from "../../../components/FrameLayout";
import Tips from "../../../components/Tips";
import { withTranslation } from "../../../i18n";
import {
  closeAlert,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../../../store/actions";
import { ACTIONS, API_URL, CATEGORIES, CHAIN_URL, CONTRACT_ADDRESS, SERVER_API_URL } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";

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
  name: string;
  desc: string;
  tags: any[];
  suggestions: any[];
}

class AddProduct extends React.Component<IProps, IState> {
  public static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"],
    };
  }

  public state: IState = {
    desc: "",
    name: "",
    suggestions: [],
    tags: [],
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
    const suggestions: any[] = [];
    let id = 1;
    for (const name in CATEGORIES) {
      if (name) {
        suggestions.push({
          id,
          name,
        });
        id ++;
      }
    }
    this.setState({ suggestions });
  }

  public render() {
    const { tags, name, desc, suggestions } = this.state;
    const {
      t,
      i18n,
      isLoading } = this.props;
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
          <div className="p-2 border-gray-400 border-b-2 text-blue-600 cursor-pointer">
            <svg viewBox="0 0 20 20"
            className="fill-current h-5 w-5 align-middle inline-block" onClick={ () => { Router.back(); } }>
              <path fill="#3182ce" d="M12.452,4.516c0.446,0.436,0.481,1.043,0,1.576L8.705,10l3.747,3.908c0.481,0.533,0.446,1.141,0,1.574  c-0.445,0.436-1.197,0.408-1.615,0c-0.418-0.406-4.502-4.695-4.502-4.695C6.112,10.57,6,10.285,6,10s0.112-0.57,0.335-0.789  c0,0,4.084-4.287,4.502-4.695C11.255,4.107,12.007,4.08,12.452,4.516z"/>
            </svg>
            <span className="align-middle ml-1">返回</span>
          </div>
          <form className="w-full max-w-lg mt-4">
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  商品名称
                </label>
                <input onChange={(evt) => { this.setState({ name: evt.target.value }); }} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="商品名称"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  商品描述
                </label>
                <input onChange={(evt) => { this.setState({ desc: evt.target.value }); }} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="商品描述"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  商品类别
                </label>
                <ReactTags
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  tags={ tags }
                  suggestions = { suggestions }
                  handleDelete={ this.handleDelete.bind(this) }
                  handleAddition={ this.handleAddition.bind(this) } />
              </div>
            </div>
            <div className="-mx-3">
              <div className="w-full px-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(evt) => this.createProduct(evt)}>
                创建兑换商品
              </button>
              </div>
            </div>
          </form>
        </div>
      </FrameLayout>
    );
  }

  public handleAddition(tag) {
    const originTags = this.state.tags;
    const tags = originTags.concat([], tag);
    this.setState({ tags });
  }

  public handleDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  public createProduct(evt) {
    evt.preventDefault();
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
)(withTranslation("common")(AddProduct));
