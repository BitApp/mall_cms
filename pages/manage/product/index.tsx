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
  busy,
  closeAlert,
  free,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../../../store/actions";
import { getAxios } from "../../../utils/axios";
import { ACTIONS, API_URL, CONTRACT_ADDRESS, PRODUCT_STATUS, SERVER_API_URL, STATUS } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";
const FrameLayout = dynamic(() => import("../../../components/FrameLayout"),  { ssr: false });
import classnames from "classnames";
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
  closeAlert: () => void;
  busy: () => void;
  free: () => void;
}

interface IState {
  products: any[];
}

class Index extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    const isServer = !!ctx.req;
    const { dispatch } = ctx.store;
    dispatch({type: ACTIONS.BUSY});
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

  public state: IState = {
    products: [],
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
    this.setState({products: this.props.products});
  }

  public render() {
    const {
    t,
    i18n,
    isLoading } = this.props;
    const { products } = this.state;
    const grid = <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">商品名</th>
          <th className="px-4 py-2">商品描述</th>
          <th className="px-4 py-2">商品图片</th>
          <th className="px-4 py-2">商品类别</th>
          <th className="px-4 py-2">价格</th>
          <th className="px-4 py-2">库存</th>
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
          { item.price } {item.token.toUpperCase()}
          </td>
          <td className="border px-4 py-2 text-center">
          { item.quantity }
          </td>
          <td className="border px-4 py-2 text-center">
          { item.status }
          </td>
          <td className="border px-4 py-2 text-center">
          { moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss") }
          </td>
          <td className="border px-4 py-2 text-center">
            <button disabled={ item.status !== PRODUCT_STATUS.OFFLINE } className={
              classnames("bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2",
              {
                "hover:border-transparent hover:text-white hover:bg-blue-500": item.status === PRODUCT_STATUS.OFFLINE,
                "opacity-50": item.status !== PRODUCT_STATUS.OFFLINE,
              })
              } onClick={ () => {
                this.onChain(item);
              }}>
              上链
            </button>
            <button disabled={ item.status !== PRODUCT_STATUS.OFFLINE } className={
              classnames("bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2",
              {
                "hover:border-transparent hover:text-white hover:bg-blue-500": item.status === PRODUCT_STATUS.OFFLINE,
                "opacity-50": item.status !== PRODUCT_STATUS.OFFLINE,
              })
              } onClick={ () => {
                Router.push(`/manage/product/modify/${item._id}`);
              } }>
              编辑
            </button>
            <button disabled={ item.status !== PRODUCT_STATUS.OFFLINE } className={
              classnames("bg-transparent text-red-700 font-semibold py-2 px-4 border border-red-500 rounded ml-2",
              {
                "hover:border-transparent hover:text-white hover:bg-red-500": item.status === PRODUCT_STATUS.OFFLINE,
                "opacity-50": item.status !== PRODUCT_STATUS.OFFLINE,
              })
              } onClick={ () => {
                this.deleteItem(item);
              } }>
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
            onClick={ () => Router.push("/manage/product/new") }>
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

  public onChain(item) {
    if (confirm("商品上链之后无法修改，确定上链" + item.name + "吗?")) {
      const win = window as any;
      const iost = win.IWalletJS.newIOST(IOST);
      // const { wallet, t } = this.props;
      const that = this;
      const tx = iost.callABI(
        CONTRACT_ADDRESS,
        "addProduct",
        [
          item._id,
          item.name,
          item.price.toString(),
          item.quantity.toString(),
          item.token,
        ],
      );
      tx.gasLimit = 300000;
      // tx.addApprove("iost", price.toString());
      iost.signAndSend(tx).on("pending", (trx) => {
        console.info(trx);
      })
      .on("success", (result) => {
        // 刷新数据
        that.props.showSuccessMessage(item.name + "上链成功，请等待30左右刷新再次确认状态，请勿重复上链");
      })
      .on("failed", (failed) => {
        that.props.showErrorMessage(chainErrorMessage(failed));
      });
    }
  }

  public async deleteItem(item) {
    if (confirm("确定删除" + item.name + "吗?")) {
      try {
        const result = await getAxios().get(`${API_URL}/cms/product/delete/${item._id}`);
        if (result.data.code === STATUS.OK) {
          alert("删除商品" + item.name + "成功");
          await this.refresh();
        } else {
          this.props.showErrorMessage(result.data.msg);
        }
      } catch (e) {
        this.props.showErrorMessage(e.message);
      }
    }
  }

  public async refresh() {
    busy();
    const res = await getAxios().get(`${ API_URL }/cms/products`);
    const products = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    free();
    this.setState({
      products,
    });
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      busy,
      closeAlert,
      free,
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
