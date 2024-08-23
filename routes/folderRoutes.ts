import { Router } from 'express'
import folderController from '../controllers/folder/folderController'

const router = Router()

router.get('/path/:folderId', folderController.getFolderPath)
router.post('/', folderController.createFolder)
router.get('/:userId/', folderController.getFolderContents)
router.get('/:userId/:folderId', folderController.getFolderContents)
router.delete('/:folderId', folderController.deleteFolder)
router.put('/:folderId/move', folderController.moveFolder)

export default router
