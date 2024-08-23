import supabase from "../db/supabase";
import {generateUuid} from "../../utils/uuid";
import {FileDB, FileInsert} from "../../types/types";

export default class FileDBService {
	async uploadFile(file: FileInsert) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('files')
				.insert([
					{
						id: file.id,
						file_name: file.file_name,
						file_url: file.file_url,
						folder_id: file.folder_id || null,
						user_id: file.user_id,
						created_at: new Date().toISOString(),
					},
				])

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	// TODO Add folder_id update
	async moveFile(toPath: string, file_id: string, folder_id: string) {
		try {
			const { error } = await supabase
				.getClient()
				.from('files')
				.update({ file_url: toPath, folder_id })
				.eq('id', file_id)

			if (error) {
				throw error
			}

			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async copyFile(toPath: string, file_id: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('files')
				.select('*')
				.eq('id', file_id)

			if (error) {
				throw error
			}

			if (data.length !== 0) {
				const file = data[0] as FileDB
				const updatedFile: FileDB = {
					...file,
					file_url: toPath,
					id: generateUuid(),
				}
				const uploadResult = await this.uploadFile(updatedFile)
				if (uploadResult.success) {
					return { success: true, data }
				}
				return { success: false, error: uploadResult.error }
			} else {
				return { success: false, error: 'No file found' }
			}
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async deleteFile(file_id: string) {
		try {
			const response = await supabase
				.getClient()
				.from('files')
				.delete()
				.eq('id', file_id)

			if (response.error) {
				throw new Error('Error deleting file')
			}
			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async getFile(file_id: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('files')
				.select('*, file_data(*)')
				.eq('id', file_id)

			if (error) {
				throw error
			}

			return { success: true, data: data[0] as FileDB }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}
	async getUserFiles(user_id: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('files')
				.select('*, file_data(*)')
				.eq('user_id', user_id)

			if (error) {
				throw error
			}

			return { success: true, data: data as FileDB[] }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}
	async updateFileFolder(fileId: string, folderId: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('files')
				.update({ folder_id: folderId })
				.eq('id', fileId)

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error }
		}
	}
}
