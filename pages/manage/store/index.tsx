import axios from "axios";
import classnames from "classnames";
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
import { getAxios } from "../../../utils/axios";
import { ACTIONS, API_URL, CHAIN_URL, CONTRACT_ADDRESS, SERVER_API_URL } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";

interface IProps extends WithTranslation {
  stores: [any];
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
    const res = await getAxios(ctx).get(`${ isServer ? SERVER_API_URL : API_URL }/cms/stores`);
    const stores = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({ type: ACTIONS.FREE });
    return {
      namespacesRequired: ["common"],
      stores,
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
      t,
      i18n,
      isLoading,
      wallet,
      stores } = this.props;
    const grid = <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">店铺</th>
            <th className="px-4 py-2">封面</th>
            <th className="px-4 py-2">代币</th>
            <th className="px-4 py-2">卖家信息</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
        { stores.map((item: any, index) => {
        return <tr key={index}>
          <td className="border px-4 py-2 text-center">
            { item.name }
          </td>
          <td className="border px-4 py-2 text-center">
          { item.imgs.map((it, id) => (
            <img className="mr-1" width="80" key={id} src={it}/>
          )) }
          </td>
          <td className="border px-4 py-2 text-center">
            <a onClick={() => { Router.push(`/manage/token`); }} className="text-blue-500 cursor-hand">
            { item.token[0] ? item.token[0].symbol : "" }
            </a>
          </td>
          <td className="border px-4 py-2 text-center">
            <div className="m-auto text-left w-48">
              <div><label className="mr-2">卖家:</label>{ item.seller }</div>
              <div><label className="mr-2">卖家IOST账户:</label>{ item.sellerAccount }</div>
              <div><label className="mr-2">卖家电话:</label>{ item.sellerMobile }</div>
              <div><label className="mr-2">卖家微信:</label>{ item.sellerWechat }</div>
            </div>
          </td>
          <td className="border px-4 py-2 text-center">
            <button className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2 hover:border-transparent hover:text-white hover:bg-blue-500"
              onClick={ () => {
                Router.push(`/manage/store/modify/${item._id}`);
              } }>
              配置
            </button>
          </td>
        </tr>; })
        }
        </tbody>
    </table>;
    const emptyGrid = <div className="mt-4 bg-gray-100 border px-4 py-2 text-center text-gray-800 text-sm">
      暂无店铺
    </div>;
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
        <div className="p-2 bg-gray-200 rounded">
            <button className={ classnames("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            stores.length ? "opacity-50" : "") }
            onClick={ () => {
              if (!stores.length) {
                Router.push("/manage/store/new");
              }
              }}>
              新建店铺
            </button>
          </div>
          { stores.length ? grid : emptyGrid }
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
  const { wallet, errorMessage, showError, showSuccess, successMessage, isLoading } = state;
  return { wallet, errorMessage, showError, showSuccess, successMessage, isLoading };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(Index));
