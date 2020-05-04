import withRedux, { MakeStore, ReduxWrapperAppProps } from "next-redux-wrapper";
import App, { AppContext } from "next/app";
import {Provider} from "react-redux";
import { createStore } from "redux";
import {  appWithTranslation } from "../i18n";
import { reducer, RootState } from "../store";
import "../styles/global.scss";
import "../styles/tailwind.scss";

/**
 * @param initialState The store's initial state (on the client side, the state of the server-side store is passed here)
 */
const makeStore: MakeStore = (initialState: RootState) => {
  return createStore(reducer, initialState);
};

class AuctionApp extends App<ReduxWrapperAppProps<RootState>> {
  // public static async getInitialProps(appContext: AppContext) {
  //   // const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  //   // return { pageProps };
  //   const appProps = await App.getInitialProps(appContext);
  //   return { ...appProps };
  // }

  public render() {
    const {Component, pageProps, store} = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withRedux(makeStore)(appWithTranslation(AuctionApp));
