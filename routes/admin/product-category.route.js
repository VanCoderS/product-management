const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product-category.controller');

const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/uploadCloud');

const validate = require('../../validate/admin/product-category.validate');

router.get('/', controller.index);

router.patch('/:status/:id', controller.changeStatusItem);

router.get('/create', controller.createItem);
router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.validateTitleProductCategory,
  controller.createItemPost
);

module.exports = router;
