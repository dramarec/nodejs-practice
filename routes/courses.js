const { Router } = require('express');
const Course = require('../models/courseSchm');
const router = Router();

router
    .get('/', async (req, res) => {
        // console.log('req.params :===>', req.params);
        // console.log('router.post ===> req.body ===>', req.body);

        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('title price img')
            .lean();
        // console.log('.get ===> courses', courses);
        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            courses,
        });
        // res.json({
        //     message: 'All courses',
        //     status: 'SUCCES',
        //     code: 200,
        //     data: { courses },
        // });
    })

    // открывает выбранный из списка на редакцию
    .get('/:id/edit', async (req, res) => {
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
    })

    // редактирует в новом окне , возвращает обновленный курс
    .post('/edit', async (req, res) => {
        // console.log('===> router.post ===> req.body ===>', req.body);
        const { _id } = req.body;
        // console.log('===> router.post ===> id ===>', _id);
        delete req.body.id; //удаляем id, чтоб не попадал в req.body
        const updatedCourse = await Course.findByIdAndUpdate(_id, req.body, {
            new: true,
        }).lean();
        // console.log('router.post ===> updatedCourse', updatedCourse);
        res.redirect('/courses');
    })

    // удаление
    .post('/remove', async (req, res) => {
        // console.log('router.post ===> req.body', req.body);
        const { _id } = req.body;
        // console.log('router.post ===> _id', _id);
        try {
            await Course.deleteOne({ _id });
            res.redirect('/courses');
        } catch (e) {
            console.log(e);
        }
    })

    // отрывает курс в новом окне
    .get('/:id', async (req, res) => {
        // console.log('router.get -> req.params.id', req.params.id);
        const course = await Course.findById(req.params.id).lean();
        // console.log('router.get ===> course', course);
        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course,
        });
    });

module.exports = router;
