/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
global.__basedir = __dirname;
require('./config/db.js');
const listEndpoints = require('express-list-endpoints');
const passport = require('passport');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { adminPassportStrategy } = require('./config/adminPassportStrategy');
const { clientPassportStrategy } = require('./config/clientPassportStrategy');

const app = express();
const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use(cors(corsOptions));

// template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(require('./utils/response/responseHandler'));

// all routes
const routes = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

adminPassportStrategy(passport);
clientPassportStrategy(passport);

app.get('/', (req, res) => {
  res.render('index');
});

if (process.env.NODE_ENV !== 'test') {
  const seeder = require('./seeders');
  const allRegisterRoutes = listEndpoints(app);
  seeder(allRegisterRoutes).then(() => { console.log('Seeding done.'); });
  app.listen(process.env.PORT, () => {
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}
