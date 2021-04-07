const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.find().lean();
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses,
    });
});

router.get('/:id/edit', async (req, res) => {
    // console.log('router.get ===> req.params.', req.params);
    if (!req.query.allow) {
        return res.redirect('/');
    }

    const course = await Course.findOne({ _id: req.params.id }).lean();
    // console.log('router.get ===> course', course);

    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course,
    });
});

router.post('/edit', async (req, res) => {
    // console.log('===> router.post ===> req.body ===>', req.body);
    const { _id } = req.body;
    // console.log('===> router.post ===> id ===>', _id);
    delete req.body.id; //удаляем id, чтоб не попадал в req.body
    const updatedCourse = await Course.findByIdAndUpdate(_id, req.body, {
        new: true,
    }).lean();
    console.log('router.post ===> updatedCourse', updatedCourse);
    res.redirect('/courses');
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean();
    // console.log('router.get -> course', req.params.id);
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course,
    });
});

module.exports = router;
