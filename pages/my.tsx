import { WithTranslation } from "next-i18next";
import { SingletonRouter, withRouter } from "next/router";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import Layout from "../components/Layout";
import { withTranslation } from "../i18n";
import { LANGS, TABS } from "../utils/constant";

interface IProps extends WithTranslation {
  router: SingletonRouter;
}

class My extends React.Component<IProps> {

  public static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"],
    };
  }

  constructor(props) {
    super(props);
  }

  public render() {
    const { router, i18n, t } = this.props;
    return (
      <Layout active={ TABS.my } title={t("my")} withBack={ false } withSearch={false}>
        <ul className="p-4">
          <li>
            <button onClick={() => router.push("/deal/index")} className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded flex justify-between items-center w-full">
              <span>{t("myDeal")}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#bbb" d="M11 10L7.859 6.58a.695.695 0 0 1 0-.978.68.68 0 0 1 .969 0l3.83 3.908a.697.697 0 0 1 0 .979l-3.83 3.908a.68.68 0 0 1-.969 0 .695.695 0 0 1 0-.978L11 10z"/>
              </svg>
            </button>
          </li>
          <li className="mt-2">
            <button onClick={() => router.push("/bidding/index")} className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded flex justify-between items-center w-full">
              <span>{t("myAuction")}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#bbb" d="M11 10L7.859 6.58a.695.695 0 0 1 0-.978.68.68 0 0 1 .969 0l3.83 3.908a.697.697 0 0 1 0 .979l-3.83 3.908a.68.68 0 0 1-.969 0 .695.695 0 0 1 0-.978L11 10z"/>
              </svg>
            </button>
          </li>
          <li className="mt-4">
            <label className="block text-gray-500 text-sm font-bold mb-2 ml-1">
              {t("language")}
            </label>
            <div className="inline-block relative w-full">
              <select defaultValue={i18n.language} onChange={ (evt) => this.selectLang(evt)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                <option value={LANGS.cn}>中文</option>
                <option value={LANGS.en}>English</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </li>
          <li>
            <p className="text-center text-gray-500 text-xs mt-4">
              { t("version") }
            </p>
          </li>
        </ul>
      </Layout>
    );
  }

  public selectLang(evt) {
    const lang = evt.target.value;
    this.props.i18n.changeLanguage(lang);
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
    },
    dispatch,
  );
}

function mapStateToProps(state: any) {
  const { } = state;
  return { };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(My)));
