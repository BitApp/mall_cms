'use strict';

/**
 * OnSale.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  findProducts: async function(params) {
    // This `User` global variable will always make a reference the User model defining in your `./api/xxx/models/User.settings.json`.
    return strapi.query("product").find(params)
  }
};
