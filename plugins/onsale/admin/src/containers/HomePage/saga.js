import { takeLatest, takeEvery, put, fork, call, take, cancel } from 'redux-saga/effects';
import { request } from 'strapi-helper-plugin';
import { findProductsSucceed, findProductsError, onSaleSucceed, onSaleError } from './actions';
import { BASE_URL, FIND_PRODUCTS, ON_SALE } from './constants';
// import { LOCATION_CHANGE } from 'react-router-redux';

export function* findProducts(action) {
  try {
    let paramString = "";
    if(action.params) {
      paramString = "?" + (Object.keys(action.params).map((item, index) => {
        if(index > 0){
          return "&" + item + "=" +action.params[item]
        } else {
          return item + "=" +action.params[item]
        }
      }).join(""))
    }
    const requestUrl = `${BASE_URL}/products${paramString}`;
    const countRequestUrl = `${BASE_URL}/products/count${paramString}`;
    const opts = {
      method: 'GET'
    };
    // Fetch data
    const response = yield call(request, requestUrl, opts);
    const countResponse = yield call(request, countRequestUrl, opts);
    // Pass the response to the reducer
    yield put(findProductsSucceed(response, countResponse));
  } catch (error) {
    yield put(findProductsError(error));
  }
}

export function* onSale({ params }) {
  try {
    const requestUrl = `${BASE_URL}/products/${params.item.id}`;
    const opts = {
      method: 'PUT',
      body: {
        onsale: params.value
      }
    };
    // Fetch data
    const response = yield call(request, requestUrl, opts);
    // Pass the response to the reducer
    yield put(onSaleSucceed(response));
  } catch (error) {
    yield put(onSaleError(error));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  // Listen to DATA_FETCH event
  yield takeEvery(FIND_PRODUCTS, findProducts);
  yield takeEvery(ON_SALE, onSale);
  // Cancel watcher
  // yield take(LOCATION_CHANGE);
  // yield cancel(fetchDataWatcher);
}

export default defaultSaga;