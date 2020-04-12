/*
 *
 * HomePage
 *
 */
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import React, { memo } from 'react';
import { bindActionCreators, compose } from 'redux'
import pluginId from '../../pluginId';
import reducer from './reducers';
import saga from './saga';
import selectHomePage from './selectors';
import { Header } from '@buffetjs/custom';
import { GlobalContext, HeaderNav } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import { HomePageContextProvider } from '../../contexts/HomePage';
import ProductTable from '../../components/Table';
import Wrapper from './Wrapper';
import {  CONTRACT_ADDRESS } from './constants';
import {
  PageFooter,
} from 'strapi-helper-plugin';
import {
  findProducts,
  onSale
} from './actions'

export class Offline extends React.Component {
  componentDidMount() {
    this.props.findProducts({
      status: "offline",
      _sort: "startTime:DESC",
      _start: this._limit * (this._page - 1),
      _limit: this._limit
    })
    this.initIwallet()
  }

  headerNavLinks = [
    {
      name: '未上架',
      to: `/plugins/${pluginId}/offline`,
    },
    {
      name: '已成交',
      to: `/plugins/${pluginId}/deal`,
    },
    {
      name: '全部',
      to: `/plugins/${pluginId}/all`,
    }
  ];

  walletAccount = '';
  _page = 1;
  _limit = 10;

  render () {
    const { products } = this.props;
    return (
      <Wrapper className="container-fluid">
        <HomePageContextProvider
          emitEvent={this.context.emitEvent}
          pathname={this.props.location.pathname}
          push={this.props.history.push}
          setDataToEdit={this.props.setDataToEdit}
          unsetDataToEdit={this.props.unsetDataToEdit}
        >
          <Header
            title={{
              label: "上链",
            }}
            content="拍卖商品上链"
          />
          <HeaderNav
            links={this.headerNavLinks}
            style={{ marginTop: '4.6rem' }}
          />
          <ProductTable data={products} onSale={this.onSale} showLoaders={this.showLoaders()}/>
          <div className="col-md-12">
            <PageFooter
              count={ this.props.count }
              context={{ emitEvent: () => {} }}
              onChangeParams={this.handleChangeParams}
              params={{_page: this._page, _limit: this._limit}}
            />
          </div>
        </HomePageContextProvider>
      </Wrapper>
    );
  }

  showLoaders = () => {
    const { loading } = this.props
    return loading
  }

  handleChangeParams = (e) => {
    if(e.target.name === 'params._limit'){
      this._limit = e.target.value;
    } else if(e.target.name === 'params._page') {
      this._page = e.target.value;
    }

    this.props.findProducts({
      status: "offline",
      _sort: "startTime:DESC",
      _start: this._limit * (this._page - 1),
      _limit: this._limit
    });
  }

  onSale = (item) => {
    const { findProducts } = this.props;
    const iost = window.IWalletJS.newIOST(IOST);
    const tx = iost.callABI(
      CONTRACT_ADDRESS,
      "addProduct",
      [
        item.id,
        item.name,
        (new Date(item.startTime).getTime() * 1000000).toString(),
        (item.duration * 1000000000).toString(),
        (item.timeStep * 1000000000).toString(),
        item.basePrice.toString(),
        item.priceStep.toString()
      ]
    )
    tx.gasLimit = 300000
    iost.signAndSend(tx).on('pending', (trx) => {
      console.info(trx)
    })
    .on('success', (result) => {
      // _this.props.onSale(item, value)
      strapi.notification.success(item.name + "上链成功");
      findProducts({
        status: "offline",
        _sort: "startTime:DESC",
        _start: this._limit * (this._page - 1),
        _limit: this._limit
      });
    })
    .on('failed', (failed) => {
      // _this.props.onSale(item, value)
      strapi.notification.error((failed.message ? failed.message.split('throw')[1] : failed.message) || failed);
    })
  }

  initIwallet = () => {
    const _this = this
    var timeInterval = setInterval(() => {
      if (window.IWalletJS) {
        window.IWalletJS.enable().then((account) => {
        if(!account) {
          _this.walletAccount = null
        } else {
          clearInterval(timeInterval)
          _this.walletAccount = account
        }
      })
      }
    }, 1000);
  }
};

// HomePage.propTypes = {
//   data: PropTypes.object.isRequired,
//   dataFetch: PropTypes.func.isRequired,
//   error: PropTypes.bool.isRequired,
//   errorMessage: PropTypes.string.isRequired,
// };

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      findProducts,
      onSale
    },
    dispatch
  );
}
const mapStateToProps = selectHomePage();
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = strapi.injectReducer({
  key: 'homePage',
  reducer,
  pluginId,
});
const withSaga = strapi.injectSaga({
  key: 'homePage',
  saga,
  pluginId
});

export default memo(compose(
  withReducer,
  withSaga,
  withConnect
)(injectIntl(Offline)));
