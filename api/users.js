const { Router } = require('express')
const { ValidationError } = require('sequelize')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User, UserClientFields } = require('../models/user')
const { Business } = require('../models/business')
const { Photo } = require('../models/photo')
const { Review } = require('../models/review')

const router = Router()

/*
 * Route to register a new user.
 */
router.post('/', async function (req, res, next) {
  try {
    const user = await User.create(req.body, UserClientFields)
    res.status(201).send({ id: user.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

/*
 * Route to fetch info about a specific user.
 */
router.get('/:userId', async function (req, res, next) {
  const userId = req.params.userId
  const user = await User.findByPk(userId)
  if (user) {
    res.status(200).send(user)
  } else {
    next()
  }
})


/*
 * Route to allow a user to log in.
 */
router.post('/login', async function (req, res, next) {
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ where: { email: email } })
    if (user && await bcrypt.compare(password, user.password)) {
      payload = { "id": user.id }
      expiration = { "expiresIn": "24h" }
      token = jwt.sign(payload, process.env.JWT_SECRET_KEY, expiration)
      res.status(200).json({
          "status": "ok",
          "token": token,
      })
    } else {
      res.status(401).send("invalid email or password")
    }
  } catch (e) {
    throw e
  }
})

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userId/businesses', async function (req, res) {
  const userId = req.params.userId
  const userBusinesses = await Business.findAll({ where: { ownerId: userId }})
  res.status(200).json({
    businesses: userBusinesses
  })
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userId/reviews', async function (req, res) {
  const userId = req.params.userId
  const userReviews = await Review.findAll({ where: { userId: userId }})
  res.status(200).json({
    reviews: userReviews
  })
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userId/photos', async function (req, res) {
  const userId = req.params.userId
  const userPhotos = await Photo.findAll({ where: { userId: userId }})
  res.status(200).json({
    photos: userPhotos
  })
})

module.exports = router
