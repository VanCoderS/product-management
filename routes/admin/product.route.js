const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageHelper = require('../../helpers/storage');
const upload = multer({ storage: storageHelper(multer) });

const controller = require('../../controllers/admin/product.controller');
const validate = require('../../validate/admin/product.validate');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.createItem);
router.post(
  '/create',
  upload.single('thumbnail'),
  validate.validateTitleProduct,
  controller.createItemPost
);

router.get('/edit/:id', controller.editItem);
router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  validate.validateTitleProduct,
  controller.editItemPatch
);

router.get('/detail/:id', controller.detailItem);

router.get('/backup-delete', controller.backupDelete);

module.exports = router;
