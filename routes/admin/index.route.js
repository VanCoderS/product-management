const routerDashboard = require('../../routes/admin/dashboard.route');
const routerProduct = require('../../routes/admin/product.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
  const prefixAdmin = systemConfig.prefixAdmin;

  app.use(prefixAdmin + '/dashboard', routerDashboard);

  app.use(prefixAdmin + '/products', routerProduct);
};
