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
        console.log('router.post ===> req.body ===>', req.body);
        const { _id } = req.body;
        const course = await Course.findById(_id).lean();
        console.log('router.post ===> course ===>', course);
        await req.user.addToCard(course);
        res.redirect('/card');
    })

    .delete('/remove/:id', async (req, res) => {
        const card = await Card.remove(req.params.id);
        res.status(200).json(card);
    })

    .get('/', async (req, res) => {
        // console.log('.get ===> req.user', req.user);
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();

        // console.log('.get ===> user', user);
        // console.log('.get ===> user.cart.items', user.cart.items);
        // const courses = user.cart.items.map();
        const courses = mapCartItems(user.cart);

        res.render('card', {
            title: 'Корзина',
            isCard: true,
            courses: courses,
            price: computePrice(courses),
        });
    });

module.exports = router;
