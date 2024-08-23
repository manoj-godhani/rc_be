import supabase from '../db/supabase'

export default class TagsService {
	async createTag(userId: string, name: string, color: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('tags')
				.insert([
					{
						user_id: userId,
						name: name,
						color: color,
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

	async deleteTag(tagId: string) {
		try {
			const { error } = await supabase
				.getClient()
				.from('tags')
				.delete()
				.eq('id', tagId)

			if (error) {
				throw error
			}

			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async getTagsForUser(userId: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('tags')
				.select('*')
				.eq('user_id', userId)

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async updateTag(tagId: string, name: string, color: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('tags')
				.update({ name: name, color: color })
				.eq('id', tagId)

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async addTagToFile(fileId: string, tagId: string) {
		try {
			const { data: fileData, error: fileError } = await supabase
				.getClient()
				.from('files')
				.select('file_tags')
				.eq('id', fileId)
				.single()

			if (fileError) {
				throw fileError
			}

			let currentTags = fileData.file_tags || []

			if (!currentTags.includes(tagId)) {
				currentTags.push(tagId)
			}

			const { data, error } = await supabase
				.getClient()
				.from('files')
				.update({ file_tags: currentTags })
				.eq('id', fileId)

			if (error) {
				throw error
			}

			return { success: true, data }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	async removeTagFromFile(fileId: string, tagId: string) {
		try {
			const { data, error } = await supabase
				.getClient()
				.from('files')
				.select('file_tags')
				.eq('id', fileId)
				.single()

			if (error) {
				throw error
			}

			const fileTags = data.file_tags || []
			const updatedTags = fileTags.filter((id: string) => id !== tagId)

			const { error: updateError } = await supabase
				.getClient()
				.from('files')
				.update({ file_tags: updatedTags })
				.eq('id', fileId)

			if (updateError) {
				throw updateError
			}

			return { success: true, data: updatedTags }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}
}
