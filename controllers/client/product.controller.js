const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: false,
  }).sort({ position: 'desc' });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  console.log(newProducts);

  res.render('client/pages/products/index', {
    pageTitle: 'Danh sách sản phẩm',
    products: newProducts,
  });
};

module.exports.detailItem = async (req, res) => {
  try {
    const slug = req.params.slug;
    let find = {
      deleted: false,
      status: 'active',
      slug: slug,
    };
    const product = await Product.findOne(find);
    if (product !== null) {
      res.render('client/pages/products/detail', {
        pageTitle: product.title,
        product: product,
      });
    } else {
      res.redirect('/products');
    }
  } catch (error) {
    res.redirect('/products');
  }
};
