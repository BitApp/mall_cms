import axios from "../../../utils/axios";
import IOST from "iost";
import cookies from "js-cookie";
import nextCookies from "next-cookies";
import { WithTranslation } from "next-i18next";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
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
import { ACTIONS, API_URL, CHAIN_URL, CONTRACT_ADDRESS, SERVER_API_URL } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";

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

class AddAccount extends React.Component<IProps> {
  public static async getInitialProps(ctx) {
    const isServer = !!ctx.req;
    const { dispatch } = ctx.store;
    dispatch({type: ACTIONS.BUSY});
    const { name, token } = nextCookies(ctx);
    const res = await axios.get(`${ isServer ? SERVER_API_URL : API_URL }/account/agentaccount`, {
      headers: {
        auth: `${name}:${token}`,
      },
    });
    const agentAccounts = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({ type: ACTIONS.UPDATE_AGENT_ACCOUNT, payload: { agentAccounts }});
    dispatch({ type: ACTIONS.FREE });

    return {
      namespacesRequired: ["common"],
    };
  }

  public name: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
  }

  public render() {
    const {
      agentAccounts,
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
                  IOST账户名
                </label>
                <input onChange={(evt) => { this.name = evt.target.value; }} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="账户名"/>
                <p className="text-gray-600 text-xs italic">
                  把已经存在IOST主网账户添加为代理账户
                 (<a className="text-blue-500">还没有创建主网账户?</a>)
                </p>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  密码
                </label>
                <input onChange={(evt) => { this.password = evt.target.value; }} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="密码"/>
                <p className="text-gray-600 text-xs italic">
                  代理账户密码
                </p>
              </div>
            </div>
            <div className="-mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  确认密码
                </label>
                <input onChange={(evt) => { this.confirmPassword = evt.target.value; }} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="密码"/>
                <p className="text-gray-600 text-xs italic">
                  确认密码
                </p>
              </div>
            </div>
            <div className="-mx-3">
              <div className="w-full px-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(evt) => this.createAgentAccount(evt)}>
                创建代理账户
              </button>
              </div>
            </div>
          </form>
        </div>
      </FrameLayout>
    );
  }

  public async createAgentAccount(evt) {
    evt.preventDefault();
    if (this.name &&
      this.password &&
      this.confirmPassword &&
      confirm("确定创建账户")) {
      if (this.password !== this.confirmPassword) {
        this.props.showErrorMessage("两次密码必须一致");
        return;
      }
      try {
        const result = await axios.post(`${API_URL}/cms/auth/signup`, {
          name: this.name,
          parent: cookies.get("name"),
          password: this.password,
        });
        if (result.data.code === "0") {
          alert("创建账户" + this.name + "成功");
          Router.push("/manage/account");
        } else {
          this.props.showErrorMessage(result.data.msg);
        }
      } catch (e) {
        this.props.showErrorMessage(e.message);
      }
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
  const { agentAccounts, wallet, errorMessage, showError, showSuccess, successMessage, isLoading } = state;
  return { agentAccounts, wallet, errorMessage, showError, showSuccess, successMessage, isLoading };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(AddAccount));
