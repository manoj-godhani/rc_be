import gemini from "../../services/ai/gemini";
import {metadataDefaultTemplate} from "./aiTemplates";
import {AIBasicPDFInformation} from "../../types/types";
import {getPdfBasicInfo} from "../getPdfBasicInfo";
import {createPrompt} from "./createPrompt";

// TODO Replace with the correct types
export async function getPDFMetadataAI(dataBuffer: Buffer): Promise<AIBasicPDFInformation> {
    try {
        const {text, pageNumbers} = await getPdfBasicInfo(dataBuffer);
        let data = await gemini.getModel().generateContent(createPrompt(metadataDefaultTemplate, text));

        const response = data.response.text();
        const cleanedJsonString = response.trim().replace(/^```json/, '').replace(/```$/, '').trim();
        const jsonEndIndex = cleanedJsonString.indexOf('```')
        const jsonString =
            jsonEndIndex !== -1
                ? cleanedJsonString.substring(0, jsonEndIndex).trim()
                : cleanedJsonString

        const parsedDocument = JSON.parse(jsonString);
        parsedDocument["Basic Information"]["Number Of Pages"] = pageNumbers;

        return parsedDocument["Basic Information"]; // TMP SOLUTION JUST TO CHECK
    } catch (error) {
        throw error;
    }
}