import { Request, Response } from 'express'
import { SuccessStorageResponse } from '../../types/types'
import { isErrorResponse, isErrorUploadResponse } from '../../utils/erroHandler'
import { generateUuid } from '../../utils/uuid'
import FolderService from '../folder/folderService'
import FileDBService from './fileDBService'
import FileStorageService from './fileStorageService'

class FileService {
	private fileStorageService: FileStorageService
	private fileDBService: FileDBService
	private folderService: FolderService

	constructor() {
		this.fileStorageService = new FileStorageService()
		this.fileDBService = new FileDBService()
		this.folderService = new FolderService()
	}

	async uploadFile(req: Request, res: Response) {
		try {
			const id = generateUuid()
			const file_name = req.file ? req.file.originalname : req.body.file_name
			const user_id = req.body.user_id

			const folderResponse: { folder?: { id: string }, success: boolean } = await this.folderService.getOrCreateRootFolder(
				user_id
			)

			if (!folderResponse.success) {
				return false
			}

			const folderId = folderResponse?.folder?.id

			const file = {
				file_name: file_name || 'empty_name',
				file_url: file_name,
				id,
				user_id,
				folder_id: folderId,
			}


			const dbUpload = await this.fileDBService.uploadFile(file)
			if (!dbUpload.success) {
				return false
			}

			const uploadResult = await this.fileStorageService.uploadFile(
				req,
				res,
				id
			)

			return !isErrorUploadResponse(uploadResult)
		} catch (error) {
			return false
		}
	}

	async moveFile(fileId: string, folderId: string) {
		try {
			const { data, error } = await this.fileDBService.updateFileFolder(
				fileId,
				folderId
			)

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async copyFile(fromPath: string, toPath: string, file_id: string) {
		try {
			const copyResult = await this.fileStorageService.copyFile(
				fromPath,
				toPath
			)
			if (isErrorResponse(copyResult)) {
				return false
			}
			const dbCopy = await this.fileDBService.copyFile(toPath, file_id)
			return dbCopy.success
		} catch (error) {
			return false
		}
	}

	async deleteFile(fromPath: string | string[], file_id: string) {
		const addIdToPath = (path: string) => {
			return `${path}/${file_id}`
		}

		try {
			const pathToDelete = Array.isArray(fromPath)
				? fromPath.map(p => addIdToPath(p))
				: [addIdToPath(fromPath)]

			const storageResult = await this.fileStorageService.deleteFile(
				pathToDelete
			)
			if (isErrorResponse(storageResult)) {
				return false
			}

			const dbDelete = await this.fileDBService.deleteFile(file_id)
			return dbDelete.success
		} catch (error) {
			return false
		}
	}

	async downloadFile(file_id: string) {
		try {
			const dbDownload = await this.fileDBService.getFile(file_id)
			if (dbDownload.success && dbDownload.data) {
				const file = this.fileStorageService.downloadFile(
					dbDownload.data.file_url
				)

				if (isErrorResponse(file)) {
					return false
				}
				return file as SuccessStorageResponse<{ data: Blob }>
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}

	async getFileInfo(file_id: string) {
		try {
			const dbDownload = await this.fileDBService.getFile(file_id)
			return dbDownload
		} catch (error) {
			return false
		}
	}
	async getUserFiles(user_id: string) {
		try {
			const dbDownload = await this.fileDBService.getUserFiles(user_id)
			return dbDownload
		} catch (error) {
			return false
		}
	}
}

export default FileService
