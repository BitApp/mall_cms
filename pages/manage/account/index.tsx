import axios from "axios";
import IOST from "iost";
import moment from "moment";
import cookies from "next-cookies";
import { WithTranslation } from "next-i18next";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import Slider from "react-slick";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
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
import { CHAIN_URL, CONTRACT_ADDRESS } from "../../../utils/constant";
import { chainErrorMessage } from "../../../utils/helper";

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
      accountInfo,
      t,
      i18n,
      isLoading } = this.props;
    return (
      <FrameLayout>
        <Tips/>
        <div className="p-6">
          <div className="p-2 bg-gray-200 rounded">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              新建代理账户
            </button>
          </div>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Views</th>
                <th className="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Intro to CSS</td>
                <td className="border px-4 py-2">Adam</td>
                <td className="border px-4 py-2">858</td>
                <td className="border px-4 py-2 text-center">
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Button
                  </button>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
                <td className="border px-4 py-2">Adam</td>
                <td className="border px-4 py-2">112</td>
                <td className="border px-4 py-2 text-center">
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Button
                  </button>
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Intro to JavaScript</td>
                <td className="border px-4 py-2">Chris</td>
                <td className="border px-4 py-2">1,280</td>
                <td className="border px-4 py-2 text-center">
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Button
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
