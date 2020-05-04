import axios from "axios";
import IOST from "iost";
import cookies from "next-cookies";
import { WithTranslation } from "next-i18next";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import Layout from "../../components/Layout";
import Tips from "../../components/Tips";
import { withTranslation } from "../../i18n";
import {
  closeAlert,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
  updateAccountInfo,
} from "../../store/actions";
import { API_URL, STATUS } from "../../utils/constant";

interface IProps extends WithTranslation {
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
  login: (name: string, password: string) => Promise<void>;
}

class Index extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    // const isServer = !!ctx.req;
    const { dispatch } = ctx.store;
    return {
      namespacesRequired: ["common"],
    };
  }

  public name: string = "";
  public password: string = "";

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
  }

  public render() {
    const {
      showSuccess,
      showError,
      errorMessage,
      successMessage,
      t,
      i18n,
      isLoading } = this.props;

    return (
      <Layout>
        <Tips/>
        <div className="flex justify-center">
          <div className="w-full max-w-xs mt-48">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  用户名
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="用户名" onChange={(evt) => { this.name = evt.target.value; }}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  密码
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="密码" onChange={(evt) => { this.password = evt.target.value; }}/>
                {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={(e) => this.login(e) }>
                  登录
                </button>
                {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Forgot Password?
                </a> */}
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
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

  public async login(e) {
    const res = await axios.post(`${API_URL}/auth/signin`, {
      name: this.name,
      password: this.password,
    });
    if (res.data.code === STATUS.OK) {
      // save token to cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);
      document.cookie = `name=${res.data.data.name}; path=/; expires=${expires.toUTCString()}`;
      document.cookie = `token=${res.data.data.token}; path=/; expires=${expires.toUTCString()}`;
      // redirect to index
      Router.push("/");
    } else {
      this.props.showErrorMessage(res.data.msg);
    }
  }

  public closeAlert() {
    this.props.closeAlert();
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      closeAlert,
      setWallet,
      showErrorMessage,
      showSuccessMessage,
      updateAccountInfo,
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
)(withTranslation("common")(Index));
