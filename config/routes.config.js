const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');
const gptController = require('../controllers/gpt.controller');
const productsController = require('../controllers/products.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/storage.config');

// misc
router.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to the API' });
});

// auth
router.post('/register', upload.single('profilePicture'), authController.register);
router.post('/login', authController.login);

// users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser);

// products
router.post('/products', authMiddleware.isAuthenticated, productsController.create);
router.get('/products', authMiddleware.isAuthenticated, productsController.list);
router.get('/products/:id', authMiddleware.isAuthenticated, productsController.getProduct);
router.post('/products/checkout', authMiddleware.isAuthenticated, productsController.createCheckoutSession);

// GPT
router.get('/gpt/tip', gptController.getGptData);
router.get('/gpt/recipe', gptController.getGptData);

module.exports = router;
