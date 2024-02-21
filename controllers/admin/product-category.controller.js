const ProductCategory = require('../../models/product-category.model');

const filterStatusHelper = require('../../helpers/filter-status');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const createTreeHelper = require('../../helpers/createTree');

const systemConfig = require('../../config/system');

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.body);

  const find = {
    deleted: false,
  };

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const count = await ProductCategory.countDocuments();
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    count
  );

  const records = await ProductCategory.find(find).sort({ position: 'desc' });
  const newRecords = createTreeHelper.tree(records);
  console.log(newRecords);
  res.render('admin/pages/products-category/index', {
    pageTitle: 'Danh mục sản phẩm',
    categories: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

module.exports.changeStatusItem = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  await ProductCategory.updateOne({ _id: id }, { status: status });
  res.redirect('back');
};

module.exports.createItem = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render('admin/pages/products-category/create', {
    records: newRecords,
  });
};

module.exports.createItemPost = async (req, res) => {
  try {
    if (req.body.position === '') {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const productCategory = new ProductCategory(req.body);
    productCategory.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    // res.send('Ok');
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category/create`);
    // res.send('No');
  }
};
