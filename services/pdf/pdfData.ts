import {BasicPDFInformation} from "../../types/types";
import supabase from "../db/supabase";
import {generateUuid} from "../../utils/uuid";

export default class PdfService {
    async setBasicMetadata(file: BasicPDFInformation, file_id: string) {
        try {
            const id= generateUuid();

            const {data, error} = await supabase.getClient()
                .from('file_data')
                .insert([
                    {
                        id,
                        file_id: file_id,
                        title: file.title || null,
                        authors: file.authors || null,
                        publication_date: file.publication_date || null,
                        number_of_pages: file.number_of_pages || null,
                        file_size: file.file_size || null,
                        upload_date: new Date().toISOString(),
                    }
                ]);

            if (error) {
                throw error
            }

            return {success: true, data}

        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}
