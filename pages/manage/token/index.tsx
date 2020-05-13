import axios from "axios";
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
import { ACTIONS, API_URL, CHAIN_URL, CONTRACT_ADDRESS, SERVER_API_URL } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";

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
    return {
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
    const {
      t,
      i18n,
      isLoading } = this.props;
    const grid = <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">账户名(IOST主网)</th>
            <th className="px-4 py-2">状态</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
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
            onClick={ () => Router.push("/manage/account/add") }>
              新建代理账户
            </button>
          </div>
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
