// index.js
const express = require('express');
const setupSwagger = require('./swagger');
const jwt = require('jsonwebtoken')

const authenticateToken = require('./auth.js');

const app = express();
app.use(express.json());

const users = [
  {
    id: 1,
    username: 'Admin',
    password: '1234',

  },
  {
    id: 2,
    username: 'Victor',
    password: 'victor1234',

  },
  {
    id: 1,
    username: 'Marco',
    password: '1234',

  }
]

const students = [
  {
    "id": 1,
    "firstName": "Jose",
    "lastName": "Montaño",
    "age": 21,
    "email": "Jose@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 2,
    "firstName": "Victor",
    "lastName": "Sanchez",
    "age": 21,
    "email": "victor@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 3,
    "firstName": "Marco",
    "lastName": "Mejia",
    "age": 21,
    "email": "marco@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Data base",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  }
]

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of items
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items', authenticateToken, (req, res) => {
  res.status(200).json(students);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     security: 
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 */
app.post('/items', authenticateToken, (req, res) => {
  const {firstName, lastName, age, email, enrollmentNumber, courses, status} = req.body;
  const studentObject = {
    id: students.length + 1,
    firstName,
    lastName,
    age,
    email,
    enrollmentNumber,
    courses,
    status
  }
  students.push(studentObject)
  res.status(201).json(
    {
      message: 'Se ha agregado un estudiante',
      estudiante: studentObject
    });
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     security: 
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single item
 */
app.get('/items/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const studentObject = students.find(student => student.id === parseInt(id));
  if(studentObject) {
    res.status(200).json(studentObject);
  } else {
    res.status(404).json({message: `No se encontro algun estudiante con ID ${id}`});
  }
  
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     security: 
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 */
app.put('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  const studentIndex = students.findIndex(student => student.id === id);
  if(studentIndex !== -1) {
    students.studentIndex = {...students[studentIndex], ...updateData};
    res.status(200).json(updateData);
  } else {
    res.status(404).json({message: `No se encontro algun estudiante con ID ${id}`});
  }
  
  
  
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     security: 
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
app.delete('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(student => student.id === id);
  if(studentIndex !== -1) {
    const removedStudent = students.splice(studentIndex, 1)[0];
    res.status(200).json(removedStudent);
  } else {
    res.status(404).json({message: `No se encontro algun estudiante con ID ${id}`});
  }
});

// Setup Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
