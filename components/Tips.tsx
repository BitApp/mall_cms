import { WithTranslation } from "next-i18next";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { withTranslation } from "../i18n";
import {
  closeAlert,
  showErrorMessage,
  showSuccessMessage,
} from "../store/actions";

interface IProps extends WithTranslation {
  errorMessage: string;
  showError: boolean;
  showSuccess: boolean;
  successMessage: string;
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;
  closeAlert: () => void;
}

class Tips extends React.Component<IProps> {
  public render() {
    const {
      showSuccess,
      showError,
      errorMessage,
      successMessage,
      t} = this.props;

    return <div>
    {
      showSuccess &&
      <div
      className="z-50 bg-green-100 border border-green-400 text-green-700 px-16 py-3 rounded fixed mx-4 mt-4" role="alert">
        <span className="block sm:inline">{ successMessage }</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => { this.props.closeAlert(); }}>
          <svg
          className="fill-current h-6 w-6 text-green-500"
          role="button" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </span>
      </div> }
      {showError &&
      <div
      className="z-50 bg-red-100 border border-red-400 text-red-700 px-16 py-3 rounded fixed mx-4 mt-4"
      role="alert">
        <span className="block sm:inline">{ errorMessage }</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => { this.props.closeAlert(); }}>
          <svg
          className="fill-current h-6 w-6 text-red-500"
          role="button" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </span>
      </div> }
    </div>;
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      closeAlert,
      showErrorMessage,
      showSuccessMessage,
    },
    dispatch,
  );
}

function mapStateToProps(state: any) {
  const { errorMessage, showError, showSuccess, successMessage } = state;
  return { errorMessage, showError, showSuccess, successMessage };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("common")(Tips));
