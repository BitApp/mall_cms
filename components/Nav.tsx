import cookies from "js-cookie";
import { WithTranslation } from "next-i18next";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { withTranslation } from "../i18n";
import {
  updateAccountInfo,
} from "../store/actions";
import { ACTIONS } from "../utils/constant";

interface IProps extends WithTranslation {
  updateAccountInfo: (accountInfo: any) => Promise<void>;
  accountInfo: any;
}

class Nav extends React.Component<IProps> {

  public componentDidMount() {
    const name = cookies.get("name");
    const token = cookies.get("token");
    this.props.updateAccountInfo({
      name,
      token,
    });
  }

  public render() {
    const { accountInfo } = this.props;

    return (<nav className="bg-gray-900 pt-2 md:pt-1 pb-1 px-1 mt-0 h-auto fixed w-full z-20 top-0">
      <div className="flex w-full pt-2 content-center justify-between md:w-3/3 md:justify-end">
        <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
            <li className="flex-1 md:flex-none md:mr-3">
              <div className="relative inline-block">
                <button className="drop-button text-white focus:outline-none">
                  <span className="pr-2"><i className="em em-robot_face"></i></span>
                  Hi {", " + accountInfo.name ? accountInfo.name : ""}
                  { accountInfo.name &&
                  <svg className="h-3 fill-current inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg> }
                </button>
                { accountInfo.name && <div id="myDropdown" className="dropdownlist absolute bg-gray-900 text-white right-0 mt-3 p-3 overflow-auto z-30" >
                  <div className="border border-gray-800"></div>
                  <a className="p-2 hover:bg-gray-800 text-white text-sm no-underline hover:no-underline block">
                    <i className="fas fa-sign-out-alt fa-fw"></i>
                    退出
                  </a>
                </div> }
              </div>
          </li>
        </ul>
      </div>
    </nav>);
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      updateAccountInfo,
    },
    dispatch,
  );
}

function mapStateToProps(state: any) {
  const { accountInfo } = state;
  return { accountInfo };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(Nav));
