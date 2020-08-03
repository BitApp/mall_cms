import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {WithTranslation} from "next-i18next";
import Router from "next/router";
import React from "react";
import Modal from "react-modal";
import classnames from "classnames";
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
import {
  ACTIONS,
  API_URL,
  CHAIN_URL,
  CONTRACT_ADDRESS,
  PRODUCT_STATUS,
  SERVER_API_URL,
  STATUS
} from "../../../utils/constant";
import {chainErrorMessage} from "../../../utils/helper";

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

interface IState {
  stores: any[];
  setRecommendVisible: boolean,
  startTime: number,
  endTime: number,
  currentStore: any
}

class Index extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    const isServer = !!ctx.req;
    const {dispatch} = ctx.store;
    dispatch({type: ACTIONS.BUSY});
    const res = await getAxios(ctx).get(`${ isServer ? SERVER_API_URL : API_URL }/cms/recommends`);
    const stores = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({type: ACTIONS.FREE});
    return {
      namespacesRequired: ["common"],
      stores,
    };
  }

  public state: IState = {
    stores: [],
    setRecommendVisible: false,
    startTime: 0,
    endTime: 0,
    currentStore: null
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
    this.setState({stores: this.props.stores});
  }

  public render() {
    const {stores} = this.state;
    const grid = <table className="table-auto w-full">
      <thead>
      <tr>
        <th className="px-4 py-2">店铺</th>
        <th className="px-4 py-2">封面</th>
        <th className="px-4 py-2">代币</th>
        <th className="px-4 py-2">推荐</th>
        <th className="px-4 py-2">操作</th>
      </tr>
      </thead>
      <tbody>
      {stores.map((item: any, index) => {
        return <tr key={index}>
          <td className="border px-4 py-2 text-center">
            {item.name}
          </td>
          <td className="border px-4 py-2">
            <div className="text-center">
              {item.imgs.map((it, id) => (
                <img className="mr-1 inline-block" width="80" key={id} src={it}/>
              ))}
            </div>
          </td>
          <td className="border px-4 py-2 text-center">
            <a onClick={() => {
              Router.push(`/manage/token`);
            }} className="text-blue-500 cursor-hand">
              {item.token[0] ? item.token[0].symbol : ""}
            </a>
          </td>
          <td className="border px-4 py-2 text-green-500">
            <div className="text-center">
              {item.recommend &&
              <FontAwesomeIcon className="w-8 inline-block" icon={faCheckCircle}></FontAwesomeIcon>}
            </div>
          </td>
          <td className="border px-4 py-2 text-center">
            <button
              className={classnames("bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2 hover:border-transparent hover:text-white hover:bg-blue-500")}
              onClick={() => {
                this.recommend(item);
              }}>
              {(item.recommend && (item.recommendEndTime === 0 || item.recommendEndTime > Date.now()) ? "取消" : "") + "推荐"}
            </button>
            {(!item.recommend || (item.recommendEndTime < Date.now() && item.recommendEndTime !== 0)) &&
            <button className={
              classnames("mb-2 bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-2 hover:border-transparent hover:text-white hover:bg-blue-500")
            } onClick={
              () => this.setState({setRecommendVisible: true, currentStore: item})
            }>
              定时推荐
            </button>}
          </td>
        </tr>;
      })
      }
      </tbody>
    </table>;
    const emptyGrid = <div className="mt-4 bg-gray-100 border px-4 py-2 text-center text-gray-800 text-sm">
      暂无店铺
    </div>;
    return (
      <FrameLayout>
        <Tips/>
        <Modal
          isOpen={this.state.setRecommendVisible}
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                库存
              </label>
              开始时间:
              <input
                onChange={
                  (evt) => {
                    this.setState({startTime: new Date(evt.target.value).getTime()});
                  }
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startTime" type="datetime-local" min="0" placeholder="开始时间"/>
              结束时间:
              <input
                onChange={
                  (evt) => {
                    this.setState({endTime: new Date(evt.target.value).getTime()});
                  }
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endTime" type="datetime-local" min="0" placeholder="结束时间"/>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button" onClick={
                () => {
                  this.setRecommend();
                }
              }>
                修改
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
                onClick={() => this.setState({setRecommendVisible: false})}>
                取消
              </a>
            </div>
          </form>
        </Modal>
        <div className="p-6">
          {stores.length ? grid : emptyGrid}
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

  public async refresh() {
    const res = await getAxios().get(`${ API_URL }/cms/recommends`);
    this.setState({stores: res.data.data});
  }

  public async setRecommend() {
    try {
      const item = this.state.currentStore;
      const result = await getAxios().get(`${API_URL}/cms/store/recommend/${item._id}?startTime=${this.state.startTime}&endTime=${this.state.endTime}`);
      if (result.data.code === STATUS.OK) {
        this.props.showSuccessMessage((item.recommend && (item.recommendEndTime === 0 || item.recommendEndTime > Date.now()) ? "取消" : "") + "推荐店铺成功");
        this.setState({setRecommendVisible: false});
        this.refresh();
      } else {
        this.props.showErrorMessage(result.data.msg);
      }
    } catch (e) {
      this.props.showErrorMessage(e.message);
    }
  }

  public async recommend(item) {
    try {
      const result = await getAxios().get(`${API_URL}/cms/store/recommend/${item._id}`);
      if (result.data.code === STATUS.OK) {
        this.props.showSuccessMessage((item.recommend && (item.recommendEndTime === 0 || item.recommendEndTime > Date.now()) ? "取消" : "") + "推荐店铺成功");
        this.refresh();
      } else {
        this.props.showErrorMessage(result.data.msg);
      }
    } catch (e) {
      this.props.showErrorMessage(e.message);
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
