const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const database = require('./config/database');

const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');

const systemConfig = require('./config/system');

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(express.static(`${__dirname}/public`));
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
database.connect();

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log('Listen to ', port);
});
