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
import ReactTags from "react-tag-autocomplete";
import { bindActionCreators, Dispatch } from "redux";
import Tips from "../../../../components/Tips";
import { withTranslation } from "../../../../i18n";
import {
  closeAlert,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../../../../store/actions";
import { getAxios } from "../../../../utils/axios";
import { API_URL, CATEGORIES, CATEGORIES_MAP, STATUS, ACTIONS, SERVER_API_URL } from "../../../../utils/constant";
import { chainErrorMessage } from "../../../../utils/helper";
const FrameLayout = dynamic(() => import("../../../../components/FrameLayout"), { ssr: false });

import "../../../../styles/react-tags.scss";

interface IProps extends WithTranslation {
  agentAccounts: [any];
  errorMessage: string;
  showError: boolean;
  showSuccess: boolean;
  successMessage: string;
  isLoading: boolean;
  product: any;
  id: string;
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
  defaultImages: any[];
  token: string;
  price: number;
  quantity: number;
}

class ModifyProduct extends React.Component<IProps, IState> {
  public static async getInitialProps(ctx) {
    const id = ctx.query.id;
    const isServer = !!ctx.req;
    const { dispatch } = ctx.store;
    dispatch({type: ACTIONS.BUSY});
    const res = await getAxios(ctx).get(`${ isServer ? SERVER_API_URL : API_URL }/cms/products/${id}`);
    const products = res.data.data;
    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    dispatch({ type: ACTIONS.FREE });
    return {
      id,
      namespacesRequired: ["common"],
      product: products[0],
    };
  }

  public state: IState = {
    defaultImages: [],
    desc: "",
    images: [],
    name: "",
    price: 1,
    quantity: 1,
    suggestions: [],
    tags: [],
    token: "iost",
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
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
    this.setState({
      defaultImages: this.props.product.imgs,
      desc: this.props.product.desc,
      name: this.props.product.name,
      price: this.props.product.price,
      quantity: this.props.product.quantity,
      suggestions,
      tags: this.props.product.types,
      token: this.props.product.token,
    });
  }

  public render() {
    const { tags, name, desc, suggestions, token, images, price, quantity, defaultImages } = this.state;
    const {
      t,
      i18n,
      isLoading,
      product } = this.props;
    const maxNumber = 5;
    const maxMbFileSize = 5;
    const onChange = (uploadImages) => {
      // data for submit
      this.setState({
        images: uploadImages,
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
                <input onChange={(evt) => { this.setState({ name: evt.target.value.trim() }); }} value={name} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="商品名称"/>
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
                <ImageUploading
                maxFileSize={maxMbFileSize}
                onChange={onChange}
                imgExtension={[".jpg", ".png"]}>
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
                                  <FontAwesomeIcon icon={faPenSquare} />
                                </a>
                                <a className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-2"
                                  onClick={image.onRemove} >
                                  <FontAwesomeIcon icon={faTrash} />
                                </a>
                              </div>
                          </div>
                        </div>
                      ))}
                      {defaultImages.map((image, index) => (
                        <div key={index} className="image-item mt-4">
                          <img src={image} alt="" width="100" />
                            <div className="image-item__btn-wrapper">
                              <div className="mt-4">
                                <a className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-2"
                                  onClick={
                                    () => {
                                      defaultImages.splice(index, 1);
                                      this.setState({
                                        defaultImages,
                                      });
                                    }
                                  } >
                                  <FontAwesomeIcon icon={faTrash} />
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
            {/* <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  兑换Token
                </label>
                <label className="custom-checkbox-lable flex">
                  <div className="bg-white border-2 rounded w-6 h-6 p-1 flex justify-center items-center mr-2 opacity-50">
                    <input type="checkbox" className="hidden" checked={ iostSupport }
                    onChange={(e) => e.preventDefault()} />
                    <FontAwesomeIcon className="hidden w-4 h-4 text-green-600 pointer-events-none" icon={ faCheck }/>
                  </div>
                  <span className="select-none">IOST</span>
                </label>
                <label className="custom-checkbox-lable flex mt-2 cursor-pointer">
                  <div className="bg-white border-2 rounded w-6 h-6 p-1 flex justify-center items-center mr-2">
                    <input type="checkbox" className="hidden" checked={ ownTokenSupport }
                    onChange={() => this.setState({ownTokenSupport: !ownTokenSupport})}/>
                    <FontAwesomeIcon className="hidden w-4 h-4 text-green-600 pointer-events-none" icon={ faCheck }/>
                  </div>
                  <span className="select-none">OwnToken</span>
                </label>
              </div>
            </div> */}
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  价格
                </label>
                <input
                onChange={(evt) => { this.setState({ price: Number(evt.target.value.trim()) }); }}
                value={price}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"
                min="1"
                step="100"
                placeholder="价格"/>
              </div>
            </div>
            <div className="-mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  库存
                </label>
                <input
                onChange={(evt) => { this.setState({ quantity: Number(evt.target.value.trim()) }); }}
                value={quantity}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"
                min="1"
                step="1"
                placeholder="库存"/>
              </div>
            </div>
            <div className="-mx-3 mt-8">
              <div className="w-full px-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(evt) => this.updateProduct(evt)}>
                保存商品
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

  public async updateProduct(evt) {
    evt.preventDefault();
    if (this.state.name &&
      this.state.desc &&
      this.state.tags.length &&
      (this.state.images.length || this.state.defaultImages.length)) {
        try {
          const result = await getAxios().post(`${API_URL}/cms/product/modify/${this.props.id}`, {
            desc: this.state.desc,
            imgs: this.state.images,
            token: this.state.token,
            name: this.state.name,
            price: this.state.price,
            quantity: this.state.quantity,
            types: this.state.tags,
          });
          if (result.data.code === STATUS.OK) {
            alert("修改商品" + this.state.name + "成功");
            Router.push("/manage/product");
          } else {
            this.props.showErrorMessage(result.data.msg);
          }
        } catch (e) {
          this.props.showErrorMessage(e.message);
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
)(withTranslation("common")(ModifyProduct));
