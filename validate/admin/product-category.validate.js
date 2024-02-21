const systemConfig = require('../../config/system');

module.exports.validateTitleProductCategory = (req, res, next) => {
  if (!req.body.title || req.body.title.length < 5) {
    req.flash('error', 'Vui lòng nhập tiêu (>5 ký tự) đề sản phẩm');
    res.redirect(`${systemConfig.prefixAdmin}/products-category/create`);
    return;
  }
  next();
};
