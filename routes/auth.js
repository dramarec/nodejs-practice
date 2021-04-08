const { Router } = require('express');
const User = require('../models/userSchm');
const router = Router();

router
    .get('/login', async (req, res) => {
        res.render('auth/login', {
            title: 'Авторизация',
            isLogin: true,
        });
    })

    .get('/logout', async (req, res) => {
        req.session.destroy(() => {
            res.redirect('/auth/login#login');
        });
    })

    .post('/login', async (req, res) => {
        const user = await User.findById('606d8cf4ed0c90ef0662abf9');
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save(err => {
            if (err) {
                throw err;
            }
            res.redirect('/');
        });
    });

module.exports = router;
