import { faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { WithTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import ImageUploading from "react-images-uploading";
import { connect } from "react-redux";
import ReactTags from "react-tag-autocomplete";
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
import { chainErrorMessage, isEmpty } from "../../../utils/helper";
const FrameLayout = dynamic(() => import("../../../components/FrameLayout"),  { ssr: false });

import "../../../styles/react-tags.scss";

interface IProps extends WithTranslation {
  token: string;
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
  desc: string;
  tags: any[];
  suggestions: any[];
  images: any[];
  token: string;
  storeToken: string;
  price: number | string;
  quantity: number | string;
  formErrors: any;
}

class AddProduct extends React.Component<IProps, IState> {
  public static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"],
    };
  }

  public state: IState = {
    desc: "",
    images: [],
    name: "",
    price: "",
    quantity: "",
    suggestions: [],
    tags: [],
    token: "IOST",
    storeToken: '',
    formErrors: null,
  };

  constructor(props) {
    super(props);
  }

  public async componentDidMount() {
    this.initIwallet();
    const suggestions: any[] = [];
    let id = 1;
    for (const name in CATEGORIES) {
      if (name) {
        suggestions.push({
          id,
          name: CATEGORIES_MAP[name],
        });
        id ++;
      }
    }
    const res = await getAxios().get(`${ API_URL }/cms/account/token`);
    this.setState({ suggestions, storeToken: res.data.data && res.data.data.symbol ? res.data.data.symbol: '' });
  }

  public render() {
    const { tags, name, desc, suggestions, price, quantity, token, storeToken, formErrors } = this.state;
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
                  商品名称
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
                  商品描述
                </label>
                <input onChange={(evt) => { this.setState({ desc: evt.target.value.trim() }); }} value={desc} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="商品描述"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  商品类别
                </label>
                <ReactTags
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  tags={ tags }
                  suggestions = { suggestions }
                  handleDelete={ this.handleDelete.bind(this) }
                  handleAddition={ this.handleAddition.bind(this) } />
                <p className="text-xs mt-2">
                  { suggestions.map((item, index) =>
                    <a key={item.id} onClick={() => {this.handleAddition(item); }} className="mr-1 mb-1 cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center rounded-full">
                      { item.name }
                    </a> )
                  }
                </p>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  商品图片
                </label>
                <ImageUploading multiple maxFileSize={maxMbFileSize} onChange={onChange} maxNumber={maxNumber}>
                  {({ imageList, onImageUpload, onImageRemoveAll }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      onClick={(e) => { e.preventDefault(); onImageUpload(e); }}>上传图片</button>
                      <button
                      className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      onClick={(e) => { e.preventDefault(); onImageRemoveAll(e); }}>删除图片</button>
                      <div><span className="text-xs text-gray-800">推荐尺寸: 300*300</span></div>
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
                  兑换Token
                </label>
                <select onChange={(e) => this.setState({token: e.target.value})} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="iost">iost</option>
                  {storeToken && <option value={storeToken}>{storeToken}</option>}
                </select>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  价格
                </label>
                <input
                onChange = {(evt) => {
                  const value = Number(evt.target.value.trim());
                  if (value < 0) {
                    this.setState({
                      formErrors: {
                        price: "price must be greater than 0",
                      },
                    });
                  } else {
                    if (formErrors?.price) {
                      delete formErrors.price;
                    }
                    this.setState({
                      formErrors: {
                        ...formErrors,
                      },
                      price: value,
                    });
                  }
                }}
                className={classnames(formErrors?.price ? "border-red-500 border-2 focus:border-red-500" : "border-gray-200 border focus:border-gray-500", "appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white")}
                type="number"
                min="1"
                step="10"
                placeholder="价格"/>
                {price > 0 &&
                <p className="text-gray-600 text-xs italic"> { price } {token} </p> }
                { formErrors?.price && <p className="text-red-500 text-xs italic">{formErrors?.price}</p> }
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  库存
                </label>
                <input
                onChange = {(evt) => {
                  const value = Number(evt.target.value.trim());
                  if (value <= 0) {
                    this.setState({
                      formErrors: {
                        quantity: "quantity must be greater than 0",
                      },
                    });
                  } else if (Math.round(value) !== value) {
                    this.setState({
                      formErrors: {
                        quantity: "quantity must be Integer",
                      },
                    });
                  } else {
                    if (formErrors?.quantity) {
                      delete formErrors.quantity;
                    }
                    this.setState({
                      formErrors: {
                        ...formErrors,
                      },
                      quantity: value,
                    });
                  }
                }}
                className={classnames(formErrors?.quantity ? "border-red-500 border-2 focus:border-red-500" : "border-gray-200 border focus:border-gray-500", "appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white")}
                type="number"
                min="1"
                step="1"
                placeholder="库存"/>
                { formErrors?.quantity && <p className="text-red-500 text-xs italic">{formErrors?.quantity}</p> }
              </div>
            </div>
            <div className="-mx-3 mt-8">
              <div className="w-full px-3">
              <button disabled={ !isEmpty(formErrors) } className={classnames(!isEmpty(formErrors) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700", "bg-blue-500 text-white font-bold py-2 px-4 rounded")}
              onClick={(evt) => this.createProduct(evt)}>
                创建兑换商品
              </button>
              </div>
            </div>
          </form>
        </div>
      </FrameLayout>
    );
  }

  public handleAddition(tag) {
    const originTags = this.state.tags;
    const tags = originTags.concat([], tag);
    this.setState({ tags });
  }

  public handleDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  public async createProduct(evt) {
    evt.preventDefault();
    if (this.state.name &&
      this.state.desc &&
      this.state.tags.length &&
      this.state.images.length) {
      if (confirm("确定创建商品?")) {
        try {
          const result = await getAxios().post(`${API_URL}/cms/product/add`, {
            desc: this.state.desc,
            imgs: this.state.images,
            token: this.state.token.toLowerCase(),
            name: this.state.name,
            price: this.state.price,
            quantity: this.state.quantity,
            types: this.state.tags,
          });
          if (result.data.code === STATUS.OK) {
            alert("创建商品" + this.state.name + "成功");
            Router.push("/manage/product");
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
)(withTranslation("common")(AddProduct));
