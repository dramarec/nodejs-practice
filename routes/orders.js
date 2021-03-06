const { Router } = require('express');
const Order = require('../models/orderSchm');
const auth = require('../middleware/auth');
const router = Router();

router
    .get('/', auth, async (req, res) => {
        const { _id } = req.user;
        try {
            const orders = await Order.find({
                'user.userId': _id,
            }); /* .populate('user.userId'); */
            // .lean();
            console.log('.get ===> orders', orders);

            console.log(
                '.get ===> orders',
                orders.map(i => i.courses),
            );

            res.render('orders', {
                isOrder: true,
                title: 'Заказы',
                orders: orders.map(order => ({
                    ...order._doc,
                    price: order.courses.reduce((total, c) => {
                        return (total += c.count * c.course.price);
                    }, 0),
                })),
                // orders,
            });
        } catch (error) {
            console.log(error);
        }
    })

    .post('/', auth, async (req, res) => {
        try {
            const user = await req.user
                .populate('cart.items.courseId')
                .execPopulate();

            const courses = user.cart.items.map(item => ({
                course: { ...item.courseId._doc },
                count: item.count,
            }));

            // console.log('router.post ===> courses', courses);

            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
                courses: courses,
            });

            await order.save();
            await req.user.clearCart();
            res.redirect('/orders');
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;
