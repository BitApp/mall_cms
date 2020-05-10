import axios from "axios";
import IOST from "iost";
import cookies from "next-cookies";
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
  products: [any];
  errorMessage: string;
  showError: boolean;
  showSuccess: boolean;
  successMessage: string;
  isLoading: boolean;
  wallet: string;
  setWallet: (wallet: string) => Promise<void>;
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;
  updateProducts: (products: [any]) => void;
  closeAlert: () => void;
}

class Index extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    const isServer = !!ctx.req;
    const { dispatch } = ctx.store;
    dispatch({type: ACTIONS.BUSY});
    const { name, token, id } = cookies(ctx);
    const res = await axios.get(`${ isServer ? SERVER_API_URL : API_URL }/account/agentaccount`, {
      headers: {
        auth: `${name}:${token}:${id}`,
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
    const grid = <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">账户名(IOST主网)</th>
            <th className="px-4 py-2">状态</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
        { agentAccounts.map((item: any, index) => {
          return <tr key={index}>
            <td className="border px-4 py-2 text-center text-blue-600">
              <a target="_blank" href={ `https://www.iostabc.com/account/${item.name}` }>{item.name}</a>
            </td>
            <td className="border px-4 py-2 text-center">
              { item.block ? "激活" : "可用" }
            </td>
            <td className="border px-4 py-2 text-center">
              <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                禁用
              </button>
              <button className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                取消代理身份
              </button>
            </td>
          </tr>; })
        }
      </tbody>
    </table>;
    const emptyGrid = <div className="mt-4 bg-gray-100 border px-4 py-2 text-center text-gray-800 text-sm">
      暂无数据
    </div>;
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
          <div className="p-2 bg-gray-200 rounded">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={ () => Router.push("/manage/account/add") }>
              新建代理账户
            </button>
          </div>
          { agentAccounts.length ? grid : emptyGrid }
        </div>
      </FrameLayout>
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
)(withTranslation("common")(Index));
