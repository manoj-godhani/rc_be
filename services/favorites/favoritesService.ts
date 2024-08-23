import supabase from '../db/supabase'
import FileService from '../file/fileService'
import FolderService from '../folder/folderService'

interface UserFile {
	id: string
	file_name: string
	user_id: string
	created_at: string
	// Add other fields if necessary
}

interface Folder {
	id: string
	folder_name: string
	parent_id: string | null
	user_id: string
	created_at: string
	// Add other fields if necessary
}

export default class FavoritesService {
	private fileService: FileService
	private folderService: FolderService

	constructor() {
		this.fileService = new FileService()
		this.folderService = new FolderService()
	}

	async addToFavorites(userId: string, itemId: string, itemType: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('favorites')
				.insert([
					{
						user_id: userId,
						item_id: itemId,
						item_type: itemType,
						created_at: new Date().toISOString(),
					},
				])
				.select() // Select to get the inserted record

			if (error) {
				throw error
			}

			return { success: true, data: data[0] }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async deleteFromFavorites(favoriteId: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('favorites')
				.delete()
				.eq('item_id', favoriteId)
				.select() // Select to get the deleted record

			if (error) {
				throw error
			}

			return { success: true, data: data[0] }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async getUserFavorites(userId: string) {
		try {
			const { data: favorites, error } = await supabase
				.getClient()
				.from('favorites')
				.select('*')
				.eq('user_id', userId)

			if (error) {
				throw error
			}

			const files: UserFile[] = []
			const folders: Folder[] = []

			for (const favorite of favorites) {
				if (favorite.item_type === 'file') {
					const fileInfo = await this.fileService.getFileInfo(favorite.item_id)
					if (fileInfo) {
						files.push({
							id: fileInfo.data.id,
							file_name: fileInfo.data.file_name,
							user_id: fileInfo.data.user_id,
							created_at: fileInfo.data.created_at,
							// Add other required fields from FileInfo
						})
					}
				} else if (favorite.item_type === 'folder') {
					const folderContents = await this.folderService.getFolderContents(
						userId,
						favorite.item_id
					)
					if (folderContents.success) {
						const folderData = folderContents.folder
						folders.push({
							id: folderData.id,
							folder_name: folderData.folder_name,
							parent_id: folderData.parent_id,
							user_id: folderData.user_id,
							created_at: folderData.created_at,
						})
					}
				}
			}

			const resultData = {
				id: 'root',
				folder_name: 'Favorites',
				parent_id: null,
				user_id: userId,
				created_at: '',
				files: files,
				folders: folders,
			}

			return { success: true, data: resultData }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}
}
