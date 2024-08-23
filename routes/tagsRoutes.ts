import express from 'express'
import tagsController from '../controllers/tags/tagsController'

const router = express.Router()

// Get all user tags
router.get('/user/:userId', tagsController.getTags)

// Create tag
router.post('/', tagsController.createTag)

// Update tag
router.put('/:tagId', tagsController.updateTag)

// Delete tag
router.delete('/:tagId', tagsController.deleteTag)

// Add tag to file
router.post('/addTagToFile', tagsController.addTagToFile)

// Remove tag from file
router.post('/removeTagFromFile', tagsController.removeTagFromFile)

export default router
