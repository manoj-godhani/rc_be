import { FolderDB, FolderInsert } from 'types/types'
import supabase from '../db/supabase'

export default class FolderDBService {
	async createFolder(folder: FolderInsert) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('folders')
				.insert([
					{
						id: folder.id,
						folder_name: folder.folder_name,
						parent_id: folder.parent_id || null,
						user_id: folder.user_id,
						created_at: new Date().toISOString(),
					},
				])
				.select()
				.single()

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async getFolder(folder_id: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('folders')
				.select('*')
				.eq('id', folder_id)
				.single()

			if (error) {
				throw error
			}

			return { success: true, data: data as FolderDB }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async updateFolder(folderId: string, updates: Partial<FolderInsert>) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('folders')
				.update(updates)
				.eq('id', folderId)
				.single()

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async deleteFolder(folder_id: string) {
		try {
			const { error } = await supabase
				.getClient()
				.from('folders')
				.delete()
				.eq('id', folder_id)

			if (error) {
				throw error
			}

			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async getUserFolders(user_id: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('folders')
				.select('*')
				.eq('user_id', user_id)

			if (error) {
				throw error
			}

			return { success: true, data: data as FolderDB[] }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}
}
