const { Router } = require('express');
const bcrypt = require('bcryptjs');
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
        try {
            const { email, password } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                const aresame = await bcrypt.compare(
                    password,
                    candidate.password,
                );

                if (aresame) {
                    req.session.user = candidate;
                    req.session.isAuthenticated = true;
                    req.session.save(err => {
                        if (err) {
                            throw err;
                        }
                        res.redirect('/');
                    });
                } else {
                    res.redirect('./auth/login#login');
                }
            } else {
                res.redirect('./auth/login#login');
            }
        } catch (error) {
            console.log(error);
        }
    })

    .post('/register', async (req, res) => {
        try {
            const { email, password, repeat, name } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                res.redirect('/auth/login#register');
            } else {
                const hashPassord = await bcrypt.hash(password, 10);
                const user = new User({
                    email,
                    name,
                    hashPassord,
                    cart: { items: [] },
                });
                await user.save();
                res.redirect('/auth/login#login');
            }
        } catch (e) {
            console.log(e);
        }
    });

module.exports = router;
