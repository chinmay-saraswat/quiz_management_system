const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Quiz = require('../models/quiz');
const auth = require('../routes/auth'); 
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); 
    },
  });
  const upload = multer({ storage });
// @route POST /api/admin/courses
// @desc Create a new course

router.post('/courses', upload.fields([{ name: 'thumbnail' }, { name: 'videos' }]), async (req, res) => {
  const { title, description } = req.body;
  const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : req.body.thumbnailUrl;
  const videoUrls = Array.isArray(req.body.videoUrls) ? req.body.videoUrls : [req.body.videoUrls]; 
  const videoFiles = req.files.videos ? req.files.videos.map(video => video.path) : [];

  const videos = [...videoFiles, ...videoUrls.filter(Boolean)]; 

  try {
    const newCourse = new Course({
      title,
      description,
      thumbnail,
      videos,
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});


  
// @route GET /api/admin/courses
// @desc Get all courses

router.get('/courses', auth, async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
});

// @route PUT /api/admin/courses/:id
// @desc Update a course

router.put('/courses/:id', auth, async (req, res) => {
    const { title, description, thumbnail, videos } = req.body;
  
    try {
      let course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
    
      course.title = title || course.title;
      course.description = description || course.description;
      course.thumbnail = thumbnail || course.thumbnail;
      course.videos = videos || course.videos;
  
      course = await course.save();
      res.json(course);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
});

// @route DELETE /api/admin/courses/:id
// @desc Delete a course

router.delete('/courses/:id', auth, async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
     
      await Course.findByIdAndDelete(req.params.id);
      res.status(204).json({ msg: 'Course deleted' });  // 204 No Content
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  });

// @route POST /api/admin/courses/:courseId/quizzes
// @desc Create a new quiz for a course
// @access Admin (Protected)
router.post('/courses/:courseId/quizzes', auth, async (req, res) => {
    const { questions } = req.body;
  
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      const newQuiz = new Quiz({ course: req.params.courseId, questions });
      const quiz = await newQuiz.save();
  
      // Add quiz to course's quizzes array
      course.quizzes.push(quiz._id);
      await course.save();
  
      res.status(201).json(quiz);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
});

// @route GET /api/admin/courses/:courseId/quizzes
// @desc Get all quizzes for a course
// @access Admin (Protected)
router.get('/courses/:courseId/quizzes', auth, async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId).populate('quizzes');
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      res.json(course.quizzes);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
});

// @route PUT /api/admin/quizzes/:quizId
// @desc Update a quiz
// @access Admin (Protected)
router.put('/quizzes/:quizId', auth, async (req, res) => {
    const { questions } = req.body;
  
    try {
      let quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ msg: 'Quiz not found' });
      }
  
      // Update quiz questions
      quiz.questions = questions || quiz.questions;
  
      quiz = await quiz.save();
      res.json(quiz);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
});

// @route DELETE /api/admin/quizzes/:quizId

// @desc Delete a quiz
router.delete('/quizzes/:quizId', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        // Remove the quiz document
        await Quiz.findByIdAndDelete(req.params.quizId); // Corrected here
        res.status(204).json({ msg: 'Quiz deleted' });  // 204 No Content
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route GET /api/quizzes/:quizId
// @desc Get a single quiz by ID

router.get('/quizzes/:quizId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get course details by ID
router.get('/course-details/:id', async (req, res) => {
  try {
      const course = await Course.findById(req.params.id);
      if (!course) {
          return res.status(404).json({ msg: 'Course not found' });
      }
      res.status(200).json(course);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
