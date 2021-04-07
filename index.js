const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const db = require('./db');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');

const app = express();

//Handlebars
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);

// app.use((_, res) => {
//     res.status(404).json({
//         status: 'error',
//         code: 404,
//         message: `Use api on routes: ${req.baseUrl} /api/contacts`,
//         data: 'Not found',
//     });
// });

// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     res.status(500).json({
//         status: 'fail',
//         code: 500,
//         message: `${err.message.replace(/"/g, '')}`,
//         data: 'Internal Server Error',
//     });
// });

const PORT = process.env.PORT || 3000;

// async function start() {
//     try {
//         const url = `mongodb+srv://dramarec:bass@cluster0.nxfb5.mongodb.net/drmrc-nodemn`;
//         await mongoose.connect(url, { useNewUrlParser: true });
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (e) {
//         console.log(e);
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
