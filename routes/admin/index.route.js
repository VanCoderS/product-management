const routerDashboard = require('./dashboard.route');
const routerProduct = require('./product.route');
const routerProductCategory = require('./product-category.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
  const prefixAdmin = systemConfig.prefixAdmin;

  app.use(prefixAdmin + '/dashboard', routerDashboard);

  app.use(prefixAdmin + '/products', routerProduct);

  app.use(`${prefixAdmin}/products-category`, routerProductCategory);
};
