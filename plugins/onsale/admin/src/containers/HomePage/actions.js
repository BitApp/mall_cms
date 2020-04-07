/*
 * action types
 */

import { 
  FIND_PRODUCTS, 
  FIND_PRODUCTS_SUCCEED, 
  FIND_PRODUCTS_ERROR, 
  ON_SALE,
  ON_SALE_SUCCEED,
  ON_SALE_ERROR
} from './constants';

/*
 * action creators
 */

export function findProducts(params) {
  return { type: FIND_PRODUCTS, params }
}

export function findProductsError(errorMessage) {
  return {
    type: FIND_PRODUCTS_ERROR,
    errorMessage,
  };
}

export function findProductsSucceed(products) {
  return {
    type: FIND_PRODUCTS_SUCCEED,
    products,
  };
}

export function onSale(item, value) {
  return { type: ON_SALE, params: { item, value } }
}

export function onSaleError(errorMessage) {
  return {
    type: ON_SALE_ERROR,
    errorMessage,
  };
}

export function onSaleSucceed(product) {
  return {
    type: ON_SALE_SUCCEED,
    product
  };
}