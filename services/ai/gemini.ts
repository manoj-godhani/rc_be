import dotenv from "dotenv";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {EnvConfig} from "../../types/types";

const {GEMINI_API_KEY_SECRET} = dotenv.configDotenv().parsed as unknown as EnvConfig;


class GeminiClient {
    private static instance: GeminiClient;
    private readonly model!: GenerativeModel;

    constructor() {
        if (!GeminiClient.instance) {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY_SECRET);
            this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            GeminiClient.instance = this;
        }

        return GeminiClient.instance;
    }

    getModel() {
        return this.model;
    }
}

const instance = new GeminiClient();
Object.freeze(instance);

export default instance;