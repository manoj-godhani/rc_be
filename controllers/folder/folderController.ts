import { handleError } from '../../utils/erroHandler'
import { Request, Response } from 'express'
import folderServiceClass from '../../services/folder/folderService'
import { generateUuid } from '../../utils/uuid'

const folderService = new folderServiceClass()

class FolderController {
	async getFolderContents(
		req: Request<{ userId: string; folderId: string }>,
		res: Response
	) {
		try {
			const { userId, folderId } = req.params

			if (!folderId) {
				const result = await folderService.getRootFolder(userId)

				if (result.success) {
					return res.status(200).json(result.folder)
				} else {
					return res
						.status(404)
						.json({ message: 'Error getting folder contents' })
				}
			}

			const result = await folderService.getFolderContents(userId, folderId)

			if (result.success) {
				return res.status(200).json(result.folder)
			} else {
				return res
					.status(404)
					.json({ message: 'Error getting folder contents' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async createFolder(req: Request, res: Response) {
		try {
			const id = generateUuid()
			const folder = { ...req.body, id }

			const result = await folderService.createFolder(folder)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error creating folder' })
			}
		} catch (error) {
			const statusCode = 500
			const message = 'Internal Server Error'
			return res.status(statusCode).json({ message })
		}
	}

	async deleteFolder(req: Request, res: Response) {
		try {
			const { folderId } = req.params
			const result = await folderService.deleteFolder(folderId)

			if (result.success) {
				return res.status(200).json({ message: 'Folder deleted successfully' })
			} else {
				return res.status(404).json({ message: 'Error deleting folder' })
			}
		} catch (error) {
			const statusCode = 500
			const message = 'Internal Server Error'
			return res.status(statusCode).json({ message })
		}
	}

	async getFolderPath(req: Request<{ folderId: string }>, res: Response) {
		try {
			const { folderId } = req.params
			const path = await folderService.getFolderPath(folderId)

			return res.status(200).json({ path })
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async moveFolder(
		req: Request<{ folderId: string }, {}, {}, { toParentId: string }>,
		res: Response
	) {
		try {
			const { folderId } = req.params
			const { toParentId } = req.query

			if (!toParentId) {
				return res
					.status(400)
					.json({ message: 'Missing required field: toParentId' })
			}

			const result = await folderService.moveFolder(folderId, toParentId)
			if (result) {
				res
					.status(200)
					.json({ success: true, message: 'Folder moved successfully' })
			} else {
				res.status(404).json({ message: 'Error moving folder' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}
}

export default new FolderController()
