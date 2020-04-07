import { FIND_PRODUCTS, FIND_PRODUCTS_SUCCEED, FIND_PRODUCTS_ERROR, ON_SALE, ON_SALE_SUCCEED, ON_SALE_ERROR } from './constants';
import { fromJS, List } from 'immutable';

const initialState = fromJS({
  products: List([]),
  error: false,
  errorMessage: '',
  loading: true,
});

function onSaleReducer(state = initialState, action) {
  if(action.type === FIND_PRODUCTS) {
    return state
      .set('error', false)
      .set('errorMessage', '')
      .set('loading', true);
  }
  else if(action.type === FIND_PRODUCTS_ERROR) {
    return state
      .set('error', true)
      .set('errorMessage', action.errorMessage)
      .set('loading', false);
  } else if (action.type === FIND_PRODUCTS_SUCCEED) {
    return state
      .set('products', List(action.products))
      .set('error', false)
      .set('errorMessage', '')
      .set('loading', false);
  } else if (action.type === ON_SALE) {
    return state
      .set('error', false)
      .set('errorMessage', '')
  } else if (action.type === ON_SALE_SUCCEED) {
    const products = state
    .get('products')
    .update(state.get('products')
    .findIndex(i => i.id === action.product.id), 
    item => Object.assign({}, item, { onsale: action.product.onsale }))
    return state
      .set('products', products)
      .set('error', false)
      .set('loading', false)
  } else if (action.type === ON_SALE_ERROR) {
    return state
      .set('error', true)
      .set('errorMessage', action.errorMessage)
      .set('loading', false);
  } else {
    return state;
  }
}

export default onSaleReducer