import favoritesController from '../controllers/favorites/favoritesController'
import express from 'express'

const router = express.Router()

router.get('/user/:userId', favoritesController.getAllFavorites)
router.post('/', favoritesController.addToFavorites)
router.delete('/:favoriteId', favoritesController.deleteFromFavorites)

export default router
