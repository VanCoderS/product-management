const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filter-status');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

const systemConfig = require('../../config/system');

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  const products = await Product.find(find)
    .sort({ position: 'desc' })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // console.log(products);
  res.render('admin/pages/products/index', {
    pageTitle: 'Danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash('success', 'Thay đổi trạng thái sản phẩm thành công!');
  res.redirect('back');
};

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(', ');

  switch (type) {
    case 'active':
      await Product.updateMany({ _id: { $in: ids } }, { status: 'active' });
      req.flash(
        'success',
        `Thay đổi trạng thái ${ids.length} sản phẩm thành công!`
      );
      break;
    case 'inactive':
      await Product.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
      req.flash(
        'success',
        `Thay đổi trạng thái ${ids.length} sản phẩm thành công!`
      );
      break;
    case 'delete-all':
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash('success', `Xóa ${ids.length} sản phẩm thành công!`);
      break;
    case 'change-position':
      for (const item of ids) {
        const [id, position] = item.split('-');
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        'success',
        `Thay đổi vị trí ${ids.length} sản phẩm thành công!`
      );
      break;
    default:
      break;
  }
  res.redirect('back');
  // res.send('ok');
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); Xóa vĩnh viễn => Không nên áp dụng
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  req.flash('success', `Xóa sản phẩm thành công!`);
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.createItem = async (req, res) => {
  res.render('admin/pages/products/create');
};

module.exports.createItemPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position === '') {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const product = new Product(req.body);
  product.save();

  console.log(req.file);

  req.flash('success', 'Tạo sản phẩm thành công');
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.editItem = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ _id: id });
    res.render('admin/pages/products/edit', { product: product });
  } catch (error) {
    req.flash('error', 'Vui lòng nhập đúng id');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    return;
  }
};

module.exports.editItemPatch = async (req, res) => {
  console.log(req.body.thumbnail);
  try {
    const product = await Product.findOne({ _id: req.params.id });

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position === '') {
      req.body.position = product.position;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    // if (!req.body.thumbnail) {
    //   req.body.thumbnail = '';
    // }

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    console.log(req.body);
    await Product.updateOne({ _id: req.params.id }, req.body);

    req.flash('success', 'Chỉnh sửa sản phẩm thành công');
    res.redirect('back');
  } catch (error) {
    req.flash('error', 'Chỉnh sửa sản phẩm thất bại');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.detailItem = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };
    const product = await Product.findOne(find);
    res.render('admin/pages/products/detail', {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.backupDelete = async (req, res) => {
  const products = await Product.find({});
  const listsId = products.map((item) => item.id);

  await Product.updateMany({ _id: { $in: listsId } }, { deleted: false });
  req.flash('success', `Backup trạng thái deleted = false`);

  res.redirect('http://localhost:3000/admin/products');
};
