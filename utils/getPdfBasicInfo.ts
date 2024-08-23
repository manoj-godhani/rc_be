import pdf from "pdf-parse";

export async function getPdfBasicInfo(dataBuffer: Buffer): Promise<{ text:string,pageNumbers: number }> {
    try {
        let data = await pdf(dataBuffer);
        return {text: data.text, pageNumbers: data.numpages};
    } catch (error) {
        throw error;
    }
}