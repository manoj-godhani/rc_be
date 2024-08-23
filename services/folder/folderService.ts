import { FolderInsert } from '../../types/types'
import { generateUuid } from '../../utils/uuid'
import supabase from '../db/supabase'
import FolderDBService from './folderDBService'

export default class FolderService {
	private folderDBService: FolderDBService

	constructor() {
		this.folderDBService = new FolderDBService()
	}
	async getOrCreateRootFolder(userId: string) {
		try {
			const response = await this.getRootFolder(userId)

			if (response.success) {
				return response
			} else {
				const rootFolder = {
					id: generateUuid(),
					user_id: userId,
					folder_name: 'root',
					is_root: true,
				}

				const createResponse = await this.createFolder(rootFolder)

				if (createResponse.success) {
					return createResponse
				} else {
					throw new Error('Error creating root folder')
				}
			}
		} catch (error) {
			throw new Error(`Error getting or creating root folder: ${error.message}`)
		}
	}

	async getFolderContents(userId: string, folderId: string) {
		try {
			const { data: folderData, error: folderError } = await supabase
				.getClient()
				.from('folders')
				.select('*, files(*), folders(*)')
				.eq('user_id', userId)
				.eq('id', folderId)
				.single()

			if (folderError && folderError.code !== 'PGRST116') {
				throw folderError
			}

			if (folderData) {
				return { success: true, folder: folderData }
			} else {
				throw new Error('Folder not found')
			}
		} catch (error) {
			throw new Error(`Error getting folder contents: ${error.message}`)
		}
	}

	async getRootFolder(userId: string) {
		try {
			const { data: folderData, error: folderError } = await supabase
				.getClient()
				.from('folders')
				.select('*, files(*), folders(*)')
				.eq('user_id', userId)
				.eq('is_root', true)
				.single()

			if (folderError && folderError.code !== 'PGRST116') {
				throw folderError
			}

			if (folderData) {
				return { success: true, folder: folderData }
			} else {
				return { success: false, error: 'No root folder found' }
			}
		} catch (error) {
			throw new Error(`Error getting root folder: ${error.message}`)
		}
	}

	async createFolder(folder: FolderInsert) {
		try {
			const { data: folderData, error: folderError } = await supabase
				.getClient()
				.from('folders')
				.insert([folder])
				.select()
				.single()

			if (folderError) {
				throw folderError
			}

			return { success: true, data: folderData }
		} catch (error) {
			throw new Error(`Error creating folder: ${error.message}`)
		}
	}

	async deleteFolder(folderId: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('folders')
				.delete()
				.eq('id', folderId)

			if (error) {
				return { success: false, error: error.message }
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async getFolderPath(
		folderId: string
	): Promise<{ id: string; folder_name: string }[]> {
		const path: { id: string; folder_name: string }[] = []
		let currentFolderId: string | null = folderId

		while (currentFolderId) {
			const { data: folderData, error: folderError } = await supabase
				.getClient()
				.from('folders')
				.select('id, folder_name, parent_id')
				.eq('id', currentFolderId)
				.single()

			if (folderError) {
				throw folderError
			}

			if (folderData) {
				path.push({ id: folderData.id, folder_name: folderData.folder_name })
				currentFolderId = folderData.parent_id
			} else {
				throw new Error('Folder not found')
			}
		}

		return path.reverse()
	}

	async moveFolder(folderId: string, newParentId: string) {
		try {
			const dbMove = await this.folderDBService.updateFolder(folderId, {
				parent_id: newParentId,
			})
			return dbMove.success
		} catch (error) {
			return false
		}
	}
}
