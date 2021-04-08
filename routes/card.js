const { Router } = require('express');
const router = Router();
const Course = require('../models/courseSchm');

function mapCartItems(cart) {
    return cart.items.map(item => ({
        ...item.courseId._doc,
        count: item.count,
    }));
}
function computePrice(courses) {
    return courses.reduce((total, course) => {
        return (total += course.price * course.count);
    }, 0);
}

router
    .post('/add', async (req, res, next) => {
        const { _id } = req.body;
        const course = await Course.findById(_id).lean();
        await req.user.addToCard(course);
        res.redirect('/card');
    })

    .delete('/remove/:id', async (req, res) => {
        await req.user.removeFromCart(req.params.id);
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();

        const courses = mapCartItems(user.cart);

        // console.log('.delete ===> courses', courses);
        const cart = {
            courses,
            price: computePrice(courses),
        };
        res.status(200).json(cart);
    })

    //  все курсы в корзине
    .get('/', async (req, res) => {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();
        console.log('.get ===> req.user', req.user);
        console.log('.get ===> user.cart.items', user.cart.items);
        const courses = mapCartItems(user.cart);
        // console.log('.get ===> courses', courses);

        res.render('card', {
            title: 'Корзина',
            isCard: true,
            courses: courses,
            price: computePrice(courses),
        });
    });

module.exports = router;
