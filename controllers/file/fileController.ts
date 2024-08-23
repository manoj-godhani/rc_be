import { handleError } from '../../utils/erroHandler'
import { Request, Response } from 'express'
import fileServiceClass from '../../services/file/fileService'
import { FileMoveParams } from '../../types/types'

const fileService = new fileServiceClass()

interface FileParams {
	fileId: string
}

class FileController {
	async uploadFile(req: Request, res: Response) {
		try {
			const userId = req.body.user_id
			const result = await fileService.uploadFile(req, res)
			if (result) {
				res
					.status(200)
					.json({ success: true, message: 'File uploaded successfully' })
			} else {
				res.status(404).json({ message: 'Error uploading file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}

	async moveFile(
		req: Request<{ fileId: string }, {}, {}, { toFolderId: string }>,
		res: Response
	) {
		try {
			const { fileId } = req.params
			const { toFolderId } = req.query

			if (!toFolderId) {
				return res
					.status(400)
					.json({ message: 'Missing required field: toFolderId' })
			}

			const result = await fileService.moveFile(fileId, toFolderId)
			if (result) {
				res
					.status(200)
					.json({ success: true, message: 'File moved successfully' })
			} else {
				res.status(404).json({ message: 'Error moving file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}

	async copyFile(
		req: Request<FileParams, {}, {}, FileMoveParams>,
		res: Response
	) {
		try {
			const { fromPath, toPath } = req.query
			const { fileId } = req.params

			const result = await fileService.copyFile(fromPath, toPath, fileId)
			if (result) {
				res
					.status(200)
					.json({ success: true, message: 'File copy successfully' })
			} else {
				res.status(404).json({ message: 'Error copying file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}

	async deleteFile(
		req: Request<FileParams, {}, {}, Omit<FileMoveParams, 'toPath'>>,
		res: Response
	) {
		try {
			const { fromPath } = req.query
			const { fileId } = req.params

			const result = await fileService.deleteFile(fromPath, fileId)
			if (result) {
				res
					.status(200)
					.json({ success: true, message: 'File deleted successfully' })
			} else {
				res.status(404).json({ message: 'Error deleting file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}

	async downloadFile(req: Request<FileParams, {}, {}, {}>, res: Response) {
		try {
			const { fileId } = req.params
			const result = await fileService.downloadFile(fileId)

			if (result) {
				res.status(200).send(result.data)
			} else {
				res.status(404).json({ message: 'Error downloading file' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}

	async getFileInfo(
		req: Request<FileParams, {}, {}, { file_id: string }>,
		res: Response
	) {
		try {
			const { fileId } = req.params
			const result = await fileService.getFileInfo(fileId)

			if (result) {
				res.status(200).json(result.data)
			} else {
				res.status(404).json({ message: 'Error getting file info' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}
	async getUserFiles(req: Request<{ userId: string }>, res: Response) {
		try {
			const { userId } = req.params
			const result = await fileService.getUserFiles(userId)

			if (result) {
				res.status(200).json(result.data)
			} else {
				res.status(404).json({ message: 'Error getting user files' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
	}
}

export default new FileController()
