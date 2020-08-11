import cookies from "js-cookie";
import { WithTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { withTranslation } from "../i18n";
import {
  updatePath,
} from "../store/actions";
import { ACCOUNT_TYPE } from "../utils/constant";
import "./layout.scss";
import Nav from "./Nav";

interface IProps extends WithTranslation {
  updatePath: (path: any) => Promise<void>;
  path: string;
}

class FrameLayout extends React.Component<IProps> {
  public componentDidMount() {
    if (location) {
      this.props.updatePath(location.pathname);
    }
  }

  public render() {
    const { children, path } = this.props;
    return (
      <div className="bg-gray-900 font-sans leading-normal tracking-normal">
        <Head>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          rel="stylesheet" />
          <link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          rel="stylesheet" />
        </Head>
        <div>
          <Nav/>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-900 shadow-lg h-16 fixed bottom-0 mt-12 md:relative md:h-screen
            z-10 w-full md:w-48">
                <div className="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
                    <ul className="list-reset flex flex-row md:flex-col py-0 md:py-3 px-1 md:px-2 text-center md:text-left">
                        <li className="mr-3 flex-1">
                          <Link href="/">
                            <a className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-white ${ path === "/" ? "border-white" : ""}`}>
                              <i className="fa fa-envelope pr-0 md:pr-3"></i><span className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">首页</span>
                            </a>
                          </Link>
                        </li>
                        { cookies.get("type") ===  ACCOUNT_TYPE.ROOT && <li className="mr-3 flex-1">
                          <Link href="/manage/account">
                            <a className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-pink-500 ${ path === "/manage/account" ? "border-pink-500" : ""}`}>
                              <i className="fas fa-tasks pr-0 md:pr-3"></i><span className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">账户管理</span>
                            </a>
                          </Link>
                        </li> }
                        { cookies.get("type") ===  ACCOUNT_TYPE.ROOT && <li className="mr-3 flex-1">
                          <Link href="/manage/recommend">
                            <a className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-pink-500 ${ path === "/manage/recommend" ? "border-pink-500" : ""}`}>
                              <i className="fas fa-tasks pr-0 md:pr-3"></i><span className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">推荐管理</span>
                            </a>
                          </Link>
                        </li> }
                        {
                          cookies.get("type") ===  ACCOUNT_TYPE.AGENT && <li className="mr-3 flex-1">
                            <Link href="/manage/product">
                              <a className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-purple-500 ${ path === "/manage/product" ? "border-purple-500" : ""}`}>
                                <i className="fa fa-envelope pr-0 md:pr-3"></i><span className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">兑换商品管理</span>
                              </a>
                            </Link>
                          </li>
                        }
                        {
                          cookies.get("type") ===  ACCOUNT_TYPE.AGENT && <li className="mr-3 flex-1">
                            <Link href="/manage/store">
                              <a className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-purple-500 ${ path === "/manage/store" ? "border-purple-500" : ""}`}>
                                <i className="fa fa-envelope pr-0 md:pr-3"></i><span className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">店铺管理</span>
                              </a>
                            </Link>
                          </li>
                        }
                        {
                          cookies.get("type") ===  ACCOUNT_TYPE.AGENT && <li className="mr-3 flex-1">
                            <Link href="/manage/token">
                              <a className={`block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-purple-500 ${ path === "/manage/token" ? "border-purple-500" : ""}`}>
                                <i className="fa fa-envelope pr-0 md:pr-3"></i><span className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">代币管理</span>
                              </a>
                            </Link>
                          </li>
                        }
                    </ul>
                </div>
            </div>
            <div className="main-content flex-1 bg-gray-100 mt-12 pb-24 md:pb-5">
            { children }
            </div>
        </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      updatePath,
    },
    dispatch,
  );
}

function mapStateToProps(state: any) {
  const { path } = state;
  return { path };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(FrameLayout));
