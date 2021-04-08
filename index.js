const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const db = require('./db');
require('dotenv').config();
const uirDb = process.env.DB_HOST;
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersdRoutes = require('./routes/orders');
const User = require('./models/userSchm');

const app = express();

//Handlebars
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('606d8cf4ed0c90ef0662abf9');
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersdRoutes);

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

// async function start() {
//     try {
//         await mongoose.connect(uirDb, {
//             promiseLibrary: global.Promise,
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false,
//         });
//         const candidate = await User.findOne();
//         if (!candidate) {
//             const user = new User({
//                 email: 'user@mail.ru',
//                 name: 'user',
//                 cart: { items: [] },
//             });
//             await user.save();
//         }
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (err) {
//         console.log(`Server not running. Error message: ${err.message}`);
//     }
// }
// start();

db.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running. Use our API on port: ${PORT}`);
    });
}).catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
);
