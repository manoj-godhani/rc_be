import dotenv from 'dotenv'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })
console.log(`Loading environment variables from: ${envPath}`)

export default {
    port: process.env.PORT,
    baseUrl: process.env.BASE_URL,
    frontEndUrl: process.env.FRONT_END_URL,
    mongoDB: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        dbName: process.env.MONGODB_DB_NAME,
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
    },
    supabaseDB: {
        connectionstring: process.env.SUPABASE_CONNECTION_STRING,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,

    },
    secrets: {
        jwtSecretKey: process.env.JWT_SECRET,
        jwtTokenExp: process.env.JWT_TOKEN_EXPIRE,
        jwtRefreshExp: process.env.JWT_REFRESH_EXPIRE,
        jwtForgotExp: process.env.JWT_FORGOT_EXPIRE,
    },
    saltWorkFactor: 10,
    awsRegion: process.env.AWS_REGION,
    awsParameterStorePath: process.env.AWS_PARAMETER_STORE_PATH,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    email: {
        apiKey: process.env.EMAIL_API_KEY,
        userKey: process.env.EMAIL_USER_KEY,
        apiUrl: process.env.EMAIL_API_URL

    },
    sms: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
    },
    emailVerifyExpiry: 10 * 60 * 1000,   
    socketClientUrl: process.env.SOCKET_IO_URL,
    clientUrl: process.env.CLIENT_URL

}
