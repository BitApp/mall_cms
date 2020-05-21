import IOST from "iost";
import cookies from "next-cookies";
import { WithTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
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
import { ACTIONS, API_URL, CHAIN_URL, CONTRACT_ADDRESS, SERVER_API_URL } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";
const FrameLayout = dynamic(() => import("../../../components/FrameLayout"),  { ssr: false });
import moment from "moment";

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
    const { name, token  } = cookies(ctx);
    const res = await getAxios(ctx).get(`${ isServer ? SERVER_API_URL : API_URL }/cms/products`);
    const products = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({ type: ACTIONS.FREE });
    return {
      namespacesRequired: ["common"],
      products,
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
      products } = this.props;
    const grid = <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">商品名</th>
          <th className="px-4 py-2">商品描述</th>
          <th className="px-4 py-2">商品图片</th>
          <th className="px-4 py-2">商品类别</th>
          <th className="px-4 py-2">状态</th>
          <th className="px-4 py-2">时间</th>
          <th className="px-4 py-2">操作</th>
        </tr>
      </thead>
      <tbody>
      { products.map((item: any, index) => {
        return <tr key={index}>
          <td className="border px-4 py-2 text-center">
          { item.name }
          </td>
          <td className="border px-4 py-2 text-center">
          { item.desc }
          </td>
          <td className="border px-4 py-2 text-center">
          { item.imgs.map((it, id) => (
            <img className="mr-1" width="80" key={id} src={it}/>
          )) }
          </td>
          <td className="border px-4 py-2 text-center">
          { item.types.map((it) => (
            <span className="mr-1" key={it.id}>{it.name}</span>
          )) }
          </td>
          <td className="border px-4 py-2 text-center">
          { item.status }
          </td>
          <td className="border px-4 py-2 text-center">
          { moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss") }
          </td>
          <td className="border px-4 py-2 text-center">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              上链
            </button>
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-2">
              编辑
            </button>
            <button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded ml-2">
              删除
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
            onClick={ () => Router.push("/manage/product/add") }>
              新增商品
            </button>
          </div>
          { products.length ? grid : emptyGrid }
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
