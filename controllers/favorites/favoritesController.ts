import { handleError } from '../../utils/erroHandler'
import { Request, Response } from 'express'
import FavoritesService from '../../services/favorites/favoritesService'

const favoritesService = new FavoritesService()

class FavoritesController {
	async getAllFavorites(req: Request<{ userId: string }>, res: Response) {
		try {
			const { userId } = req.params
			const result = await favoritesService.getUserFavorites(userId)

			if (result.success) {
				return res.status(200).json(result.data)
			} else {
				return res.status(404).json({ message: 'Error getting favorites' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return res.status(statusCode).json({ message })
		}
	}

	async addToFavorites(req: Request, res: Response) {
		try {
			const { userId, itemId, itemType } = req.body
			if (!userId || !itemId || !itemType) {
				return res.status(400).json({ message: 'Missing required fields' })
			}

			const result = await favoritesService.addToFavorites(
				userId,
				itemId,
				itemType
			)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ message: 'Error adding to favorites' })
			}
		} catch (error) {
			const statusCode = 500
			const message = 'Internal Server Error'
			return res.status(statusCode).json({ message })
		}
	}

	async deleteFromFavorites(req: Request, res: Response) {
		try {
			const { favoriteId } = req.params
			const result = await favoritesService.deleteFromFavorites(favoriteId)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res
					.status(404)
					.json({ message: 'Error deleting from favorites' })
			}
		} catch (error) {
			const statusCode = 500
			const message = 'Internal Server Error'
			return res.status(statusCode).json({ message })
		}
	}
}

export default new FavoritesController()
