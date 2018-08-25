require('dotenv').config();


export interface ServerHost {
    host: string;
    port: number;
    protocol: 'http' | 'https'
}
interface Keys {
    weather?: string;
    smsServer: ServerHost;
    cloudflare: {
        email?: string;
        key?: string;
    }
}

const configuration: Keys = {
    weather: process.env.WEATHER_KEY,
    smsServer: {
        host: "192.168.0.151",
        port: 5554,
        protocol: 'http'
    },
    cloudflare: {
        email: process.env.CLOUDFLARE_EMAIL,
        key: process.env.CLOUDFLARE_APIKEY
    }
}
export default configuration;