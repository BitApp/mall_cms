import {getAxios} from "../../../utils/axios";
import cookies from "next-cookies";
import {WithTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import Tips from "../../../components/Tips";
import {withTranslation} from "../../../i18n";
import {closeAlert, setWallet, showErrorMessage, showSuccessMessage,} from "../../../store/actions";
import {ACCOUNT_STATUS, ACTIONS, API_URL, SERVER_API_URL, STATUS} from "../../../utils/constant";

const FrameLayout = dynamic(() => import("../../../components/FrameLayout"), {ssr: false});

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

class Index extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    const isServer = !!ctx.req;
    const {dispatch} = ctx.store;
    dispatch({type: ACTIONS.BUSY});
    const {name, token} = cookies(ctx);
    const res = await getAxios(ctx).get(`${ isServer ? SERVER_API_URL : API_URL }/cms/account/agentaccount`, {
      headers: {
        auth: `${name}:${token}`,
      },
    });
    const agentAccounts = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({type: ACTIONS.FREE});
    return {
      agentAccounts,
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
    const {agentAccounts} = this.props;
    const grid = <table className="table-auto w-full">
      <thead>
      <tr>
        <th className="px-4 py-2">账户名(IOST主网)</th>
        <th className="px-4 py-2">状态</th>
        <th className="px-4 py-2">操作</th>
      </tr>
      </thead>
      <tbody>
      {agentAccounts.map((item: any, index) => {
        return <tr key={index}>
          <td className="border px-4 py-2 text-center text-blue-600">
            <a target="_blank" href={`https://www.iostabc.com/account/${item.name}`}>{item.name}</a>
          </td>
          <td className="border px-4 py-2 text-center">
            {item.status}
          </td>
          <td className="border px-4 py-2 text-center">
            {[ACCOUNT_STATUS.OFFLINE, ACCOUNT_STATUS.ONCHAIN].includes(item.status) && <button
              className="opacity-50 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              type="button"
              onClick={
                () => {
                  this.forbidAgent(item, true);
                }
              }>
              禁用
            </button>}
            {item.status === ACCOUNT_STATUS.FORBID && <button
              className="opacity-50 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              type="button"
              onClick={
                () => {
                  this.forbidAgent(item, false);
                }
              }>
              取消禁用
            </button>}
            {item.status !== ACCOUNT_STATUS.DELETED &&
            <button
              className="opacity-50 ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              type="button"
              onClick={
                () => {
                  this.deleteAgent();
                }
              }>
              取消代理身份
            </button>}
          </td>
        </tr>;
      })
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
                    onClick={() => Router.push("/manage/account/add")}>
              新建代理账户
            </button>
          </div>
          {agentAccounts.length ? grid : emptyGrid}
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

  public async forbidAgent(item, forbid: boolean) {
    if (forbid ? confirm("确定要禁用账户" + item.name + "吗?") : confirm("确定要取消禁用账户" + item.name + "吗?")) {
      try {
        const result = await getAxios().get(`${API_URL}/cms/account/forbidagentaccoun?agent=${item.name}&forbid=${forbid}`);
        if (result.data.code === STATUS.OK) {
          alert(forbid ? "禁用用户" + item.name + "成功" : "取消禁用用户" + item.name + "成功");
          this.refresh();
        } else {
          this.props.showErrorMessage(result.data.msg);
        }
      } catch (e) {
        this.props.showErrorMessage(e.message);
      }
    }
  }

  public deleteAgent() {
    console.log('deleteAgent')
  }

  public async refresh() {
    const res = await getAxios().get(`${ API_URL }/cms/account/agentaccount`);
    this.setState({agentAccounts: res.data.data});
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
  const {wallet, errorMessage, showError, showSuccess, successMessage, isLoading} = state;
  return {wallet, errorMessage, showError, showSuccess, successMessage, isLoading};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(Index));
