import { WithTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
import { bindActionCreators, Dispatch } from "redux";
import Tips from "../components/Tips";
import { withTranslation } from "../i18n";
import {
  closeAlert,
  setWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../store/actions";
const FrameLayout = dynamic(() => import("../components/FrameLayout"),  { ssr: false });

interface IProps extends WithTranslation {
  accountInfo: any;
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
      wallet,
      accountInfo } = this.props;
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
          <div>
            当前IOST账户:
            <a className="ml-2 text-blue-500"
            target="_target" href={`https://www.iostabc.com/account/${wallet}`}>{wallet}</a>
          </div>
          { wallet !== accountInfo.name && <p className="text-red-500 text-xs italic">请登录和当前账户名一致的IOST账户</p> }
          {!accountInfo.name && <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={ () => Router.push("/auth/login") }>
              登录管理账户
            </button>
          </div>}
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
  const { accountInfo, wallet, errorMessage, showError, showSuccess, successMessage, isLoading } = state;
  return { accountInfo, wallet, errorMessage, showError, showSuccess, successMessage, isLoading };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(Index));
