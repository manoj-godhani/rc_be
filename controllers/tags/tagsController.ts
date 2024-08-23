import { handleError } from '../../utils/erroHandler'
import { Request, Response } from 'express'
import TagsService from '../../services/tags/tagsService'

const tagsService = new TagsService()

class TagsController {
	async createTag(req: Request, res: Response) {
		try {
			const { userId, name, color } = req.body
			if (!userId || !name || !color) {
				return res.status(400).json({ message: 'Missing required fields' })
			}

			const result = await tagsService.createTag(userId, name, color)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error creating tag' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async deleteTag(req: Request, res: Response) {
		try {
			const { tagId } = req.params
			const result = await tagsService.deleteTag(tagId)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error deleting tag' })
			}
		} catch (error) {
			const statusCode = 500
			const message = 'Internal Server Error'
			return res.status(statusCode).json({ message })
		}
	}

	async getTags(req: Request, res: Response) {
		try {
			const { userId } = req.params
			const result = await tagsService.getTagsForUser(userId)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error retrieving tags' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async updateTag(req: Request, res: Response) {
		try {
			const { tagId } = req.params
			const { name, color } = req.body
			if (!name || !color) {
				return res.status(400).json({ message: 'Missing required fields' })
			}

			const result = await tagsService.updateTag(tagId, name, color)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error updating tag' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async addTagToFile(req: Request, res: Response) {
		try {
			const { fileId, tagId } = req.body
			if (!fileId || !tagId) {
				return res.status(400).json({ message: 'Missing required fields' })
			}

			const result = await tagsService.addTagToFile(fileId, tagId)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error adding tag to file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async removeTagFromFile(req: Request, res: Response) {
		try {
			const { fileId, tagId } = req.body
			if (!fileId || !tagId) {
				return res.status(400).json({ message: 'Missing required fields' })
			}

			const result = await tagsService.removeTagFromFile(fileId, tagId)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error removing tag from file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}
}

export default new TagsController()
