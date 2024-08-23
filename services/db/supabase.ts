import dotenv from "dotenv";
import {createClient, SupabaseClient as SupabaseClientType } from "@supabase/supabase-js";
import {EnvConfig,Database} from "../../types/types";


const {SUPABASE_URL, SUPABASE_KEY} = dotenv.configDotenv().parsed as unknown as EnvConfig;

class SupabaseClient {
    private static instance: SupabaseClient;
    private client!: SupabaseClientType

    constructor() {
        if (!SupabaseClient.instance) {
            this.client = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
            SupabaseClient.instance = this;
        }

        return SupabaseClient.instance;
    }

    getClient() {
        return this.client;
    }
}

const instance = new SupabaseClient();
Object.freeze(instance);

export default instance;