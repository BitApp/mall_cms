'use strict';

/**
 * OnSale.js controller
 *
 * @description: A set of functions called "actions" of the `onsale` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  findProducts: async (ctx) => {
    // Get parameters from the request
    const { limit, sort } = ctx.request.query;

    // Get the list of users using the plugins queries
    const users = await strapi.query('product').findProducts({ limit, sort });

    // Send the list of users as response
    ctx.send({
      data: users,
      message: 'ok'
    });
  }
};
