const { Router } = require('express');
const Course = require('../models/courseSchm');
const router = Router();
const auth = require('../middleware/auth');

// function isOwner(course, req) {
//     return course.userId.toString() === req.user._id.toString();
// }

router
    .get('/', async (req, res, next) => {
        try {
            const courses = await Course.find()
                .populate('userId', 'email name')
                .select('title price img')
                .lean();
            res.render('courses', {
                title: 'Курсы',
                isCourses: true,
                userId: req.user ? req.user._id.toString() : null,
                courses,
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    })

    // открывает выбранный из списка на редакцию
    .get('/:id/edit', auth, async (req, res, next) => {
        if (!req.query.allow) {
            return res.redirect('/');
        }
        try {
            const course = await Course.findOne({ _id: req.params.id }).lean();
            // console.log(course.userId.toString());
            if (course.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/courses');
            }
            // if (!isOwner(course, req)) {
            //     return res.redirect('/courses');
            // }
            res.render('course-edit', {
                title: `Редактировать ${course.title}`,
                course,
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    })

    // редактирует в новом окне , возвращает обновленный курс
    .post('/edit', auth, async (req, res, next) => {
        try {
            const { _id } = req.body;
            delete req.body.id;
            const course = await Course.findById(_id); //удаляем id, чтоб не попадал в req.body
            if (course.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/courses');
            }

            Object.assign(course, req.body);
            await course.save();
            // await Course.findByIdAndUpdate(_id, req.body, {
            //     new: true,
            // }).lean();
            res.redirect('/courses');
        } catch (error) {
            next(error);
            console.log(error);
        }
    })

    // удаление
    .post('/remove', auth, async (req, res, next) => {
        try {
            const { _id } = req.body;
            await Course.deleteOne({ _id, userId: req.user._id });
            res.redirect('/courses');
        } catch (error) {
            next(error);
            console.log(error);
        }
    })

    // отрывает курс в новом окне
    .get('/:id', async (req, res, next) => {
        try {
            const course = await Course.findById(req.params.id).lean();
            res.render('course', {
                layout: 'empty',
                title: `Курс ${course.title}`,
                course,
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    });

module.exports = router;
