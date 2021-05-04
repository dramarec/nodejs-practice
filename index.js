const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const db = require('./db');
require('dotenv').config();

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersdRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

const app = express();

const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
});
const store = new MongoStore({
    collection: 'sessions',
    uri: process.env.DB_HOST,
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'some secret value',
        resave: false,
        saveUninitialized: false,
        store,
    }),
);

app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersdRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);

app.use((_, res) => {
    res.status(404).json({
        status: 'error',
        code: 404,
        message: `Use api on routes: http://localhost:3000/`,
        data: 'Not found',
    });
});
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        status: 'fail',
        code: 500,
        message: `${err.message.replace(/"/g, '')}`,
        data: 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 3000;

db.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running. Use our API on port: ${PORT}`);
    });
}).catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
);
