// import nextCookies from "next-cookies";
import { faCheck, faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import IOST from "iost";
import { WithTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import ImageUploading from "react-images-uploading";
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
import { API_URL, CATEGORIES, CATEGORIES_MAP, STATUS } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";
const FrameLayout = dynamic(() => import("../../../components/FrameLayout"),  { ssr: false });

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
  images: string[];
  sellerWechat: string;
  seller: string;
  desc: string;
  sellerMobile: string;
}

class AddStore extends React.Component<IProps, IState> {
  public static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"],
    };
  }

  public state: IState = {
    images: [],
    name: "",
    seller: "",
    sellerWechat: "",
    desc: "",
    sellerMobile: "",
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.initIwallet();
  }

  public render() {
    const { name, seller, desc, sellerMobile, sellerWechat } = this.state;
    const {
      t,
      i18n,
      isLoading } = this.props;
    const maxNumber = 5;
    const maxMbFileSize = 5;
    const onChange = (images) => {
      // data for submit
      this.setState({
        images,
      });
    };
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
          <div className="p-2 border-gray-400 border-b-2 text-blue-600 cursor-pointer" >
            <span onClick={ () => { Router.push("/manage/product"); } }>
              <svg viewBox="0 0 20 20"
              className="fill-current h-5 w-5 align-middle inline-block">
                <path fill="#3182ce" d="M12.452,4.516c0.446,0.436,0.481,1.043,0,1.576L8.705,10l3.747,3.908c0.481,0.533,0.446,1.141,0,1.574  c-0.445,0.436-1.197,0.408-1.615,0c-0.418-0.406-4.502-4.695-4.502-4.695C6.112,10.57,6,10.285,6,10s0.112-0.57,0.335-0.789  c0,0,4.084-4.287,4.502-4.695C11.255,4.107,12.007,4.08,12.452,4.516z"/>
              </svg>
              <span className="align-middle ml-1">返回</span>
            </span>
          </div>
          <form className="w-full max-w-lg mt-4">
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  店铺名称
                </label>
                <input
                autoFocus
                onChange={(evt) => { this.setState({ name: evt.target.value.trim() }); }}
                value={name}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                placeholder="商品名称"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  店铺简介
                </label>
                <input
                onChange={(evt) => { this.setState({ desc: evt.target.value.trim() }); }}
                value={ desc }
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="店铺简介"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  店铺封面
                </label>
                <ImageUploading maxFileSize={maxMbFileSize} onChange={onChange} maxNumber={maxNumber}>
                  {({ imageList, onImageUpload, onImageRemoveAll }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      onClick={(e) => { e.preventDefault(); onImageUpload(e); }}>上传图片</button>
                      <button
                      className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      onClick={(e) => { e.preventDefault(); onImageRemoveAll(e); }}>删除图片</button>
                      {imageList.map((image) => (
                        <div key={image.key} className="image-item mt-4">
                          <img src={image.dataURL} alt="" width="100" />
                            <div className="image-item__btn-wrapper">
                              <div className="mt-4">
                                <a className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                  onClick={() => {
                                    image.onUpdate();
                                  }} >
                                  <FontAwesomeIcon className="w-4" icon={faPenSquare} />
                                </a>
                                <a className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-2"
                                  onClick={image.onRemove} >
                                  <FontAwesomeIcon className="w-4" icon={faTrash} />
                                </a>
                              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  卖家
                </label>
                <input
                onChange={(evt) => { this.setState({ seller: evt.target.value.trim() }); }}
                value={seller}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="卖家名"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  卖家电话
                </label>
                <input
                onChange={(evt) => { this.setState({ sellerMobile: evt.target.value.trim() }); }}
                value={ sellerMobile}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="卖家电话"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  卖家微信
                </label>
                <input
                onChange={(evt) => { this.setState({ sellerWechat: evt.target.value.trim() }); }}
                value={ sellerWechat}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="卖家微信"/>
              </div>
            </div>
            <div className="-mx-3 mt-8">
              <div className="w-full px-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(evt) => this.createStore(evt)}>
                创建店铺
              </button>
              </div>
            </div>
          </form>
        </div>
      </FrameLayout>
    );
  }

  public async createStore(evt) {
    evt.preventDefault();
    if (this.state.name &&
      this.state.images.length) {
      if (confirm("确定创建店铺?")) {
        try {
          const result = await getAxios().post(`${API_URL}/cms/store/add`, {
            desc: this.state.desc,
            imgs: this.state.images,
            name: this.state.name,
            seller: this.state.seller,
            sellerMobile: this.state.sellerMobile,
            sellerWechat: this.state.sellerWechat,
          });
          if (result.data.code === STATUS.OK) {
            alert("创建店铺" + this.state.name + "成功");
            Router.push("/manage/store");
          } else {
            this.props.showErrorMessage(result.data.msg);
          }
        } catch (e) {
          this.props.showErrorMessage(e.message);
        }
      }
    } else {
      alert("请填写完整相应字段");
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
  const { wallet, errorMessage, showError, showSuccess, successMessage, isLoading } = state;
  return { wallet, errorMessage, showError, showSuccess, successMessage, isLoading };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(AddStore));
