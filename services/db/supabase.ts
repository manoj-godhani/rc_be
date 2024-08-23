import dotenv from "dotenv";
// @ts-ignore
import {createClient, SupabaseClient as SupabaseClientType } from "@supabase/supabase-js";
import {EnvConfig,Database} from "../../types/types";


// const {SUPABASE_URL, SUPABASE_KEY} = dotenv.configDotenv().parsed as unknown as EnvConfig;

class SupabaseClient {
    private static instance: SupabaseClient;
    private client!: SupabaseClientType

    constructor() {
        if (!SupabaseClient.instance) {
            this.client = createClient<Database>('https://shyulpexykcgruhbjihk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeXVscGV4eWtjZ3J1aGJqaWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMjE0NDcsImV4cCI6MjAzNjY5NzQ0N30.cw4xtAzFpnYOuUtlPAuybfCz1o3UKg-AoZxHkMuH2HI');
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