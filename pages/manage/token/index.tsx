import axios from "axios";
import classnames from "classnames";
import IOST from "iost";
import cookies from "next-cookies";
import Modal from "react-modal";
import {WithTranslation} from "next-i18next";
import Router from "next/router";
import React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import FrameLayout from "../../../components/FrameLayout";
import Tips from "../../../components/Tips";
import {withTranslation} from "../../../i18n";
import {
  closeAlert,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../../../store/actions";
import {getAxios} from "../../../utils/axios";
import {ACTIONS, API_URL, CHAIN_URL, CONTRACT_ADDRESS, SERVER_API_URL} from "../../../utils/constant";
import {chainErrorMessage} from "../../../utils/helper";

interface IProps extends WithTranslation {
  tokens: [any];
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
  showRecharge: boolean,
  rechargeAmount: number
}

interface IState {
  showRecharge: boolean,
  rechargeAmount: number
}

class Index extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    const isServer = !!ctx.req;
    const {dispatch} = ctx.store;
    dispatch({type: ACTIONS.BUSY});
    const res = await getAxios(ctx).get(`${ isServer ? SERVER_API_URL : API_URL }/cms/account/token`);
    const token = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({type: ACTIONS.FREE});
    return {
      namespacesRequired: ["common"],
      tokens: token ? [token] : [],
    };
  }

  constructor(props) {
    super(props);
  }

  public state: IState = {
    showRecharge: false,
    rechargeAmount: 0
  };

  public componentDidMount() {
    this.initIwallet();
  }

  public render() {
    const {
      t,
      i18n,
      isLoading,
      wallet,
      tokens
    } = this.props;
    const grid = <table className="table-auto w-full">
      <thead>
      <tr>
        <th className="px-4 py-2">代币</th>
        <th className="px-4 py-2">精度</th>
        <th className="px-4 py-2">总量</th>
        <th className="px-4 py-2">回购价格</th>
        <th className="px-4 py-2">回购余额</th>
      </tr>
      </thead>
      <tbody>
      {tokens.map((item: any, index) => {
        return <tr key={index}>
          <td className="border px-4 py-2 text-center">
            {item.symbol}
          </td>
          <td className="border px-4 py-2 text-center">
            {item.decimal}
          </td>
          <td className="border px-4 py-2 text-center">
            {item.totalSupply}
          </td>
          {
            item.repoRate && <td className="border px-4 py-2 text-center">
              <span>1 IOST = {(1 / item.repoRate).toFixed(2)} {item.symbol}</span>
              <button
                className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2 hover:border-transparent hover:text-white hover:bg-blue-500"
                onClick={() => {
                  Router.push(`/manage/token/modify/${item.symbol}`);
                }}>
                配置
              </button>
            </td>
          }
          {
            !item.repoRate && <td className="border px-4 py-2 text-center">
              <button
                className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2 hover:border-transparent hover:text-white hover:bg-blue-500"
                onClick={() => {
                  Router.push(`/manage/token/modify/${item.symbol}`);
                }}>
                配置
              </button>
            </td>
          }
          {
            <td className="border px-4 py-2 text-center">
              {item.repoBalance || 0}
              <button
                className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2 hover:border-transparent hover:text-white hover:bg-blue-500"
                onClick={() => this.setState({showRecharge: true})}>
                充值
              </button>
            </td>
          }
        </tr>;
      })
      }
      </tbody>
    </table>;
    const emptyGrid = <div className="mt-4 bg-gray-100 border px-4 py-2 text-center text-gray-800 text-sm">
      暂无代币
    </div>;
    return (
      <FrameLayout>
        <Tips/>
        <Modal
          isOpen={this.state.showRecharge}
          // onAfterOpen={afterOpenModal}
          // onRequestClose={closeModal}
          style={{
            content: {
              top: "30%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              width: "300px",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          contentLabel="Example Modal"
        >
          <form>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                充值数量
              </label>
              <input
                autoFocus
                onChange={(evt) => {
                  const tmp = evt.target.value;
                  const value = tmp.replace(/[^1-9]{0,1}(\d*(?:\.\d{0,2})?).*$/g, '$1');
                  this.setState({rechargeAmount: Number(value)});
                }}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                onInput={(evt) => {

                }}
                value={this.state.rechargeAmount}
                placeholder="充值数量"/>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button" onClick={
                () => {
                  this.rechargeRepoBalance();
                }
              }>
                提交
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
                onClick={() => this.setState({showRecharge: false})}>
                取消
              </a>
            </div>
          </form>
        </Modal>
        <div className="p-6">
          <div className="p-2 bg-gray-200 rounded">
            <button className={classnames("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
              tokens.length ? "opacity-50" : "")}
                    onClick={() => {
                      if (!tokens.length) {
                        Router.push("/manage/token/new");
                      }
                    }}>
              发行新的Token
            </button>
            <button className={classnames("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4",
              tokens.length ? "opacity-50" : "")}
                    onClick={() => {
                      if (!tokens.length) {
                        Router.push("/manage/token/exist");
                      }
                    }}>
              关联现有Token
            </button>
          </div>
          {tokens.length ? grid : emptyGrid}
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

  public rechargeRepoBalance() {
    if (confirm("确定要充值" + this.state.rechargeAmount + "个IOST吗?")) {
      const win = window as any;
      const iost = win.IWalletJS.newIOST(IOST);
      // const { wallet, t } = this.props;
      const that = this;
      const tx = iost.callABI(
        CONTRACT_ADDRESS,
        "rechargeRepoBalance",
        [
          String(this.state.rechargeAmount)
        ],
      );
      tx.gasLimit = 300000;
      tx.addApprove("iost", this.state.rechargeAmount.toString());
      iost.signAndSend(tx).on("pending", (trx) => {
        console.info(trx);
      })
        .on("success", (result) => {
          // 刷新数据
          that.props.showSuccessMessage("充值成功，请等待30左右刷新再次确认状态");
          Router.push(`/manage/token`);
        })
        .on("failed", (failed) => {
          that.props.showErrorMessage(chainErrorMessage(failed));
        });
    }
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
