import * as express from 'express';
import { SmsParser } from './SmsParser';
import * as bodyParser from 'body-parser';
import fetch from 'node-fetch';
import configuration from './configuration';
import { ServerHost } from './configuration';
import * as path from 'path';




const smsParser = new SmsParser();

const battery = (req: express.Request, res: express.Response) => {
    const indexPath = path.join(__dirname, '../src/public/battery/battery.html');
    console.log('indexPath', __dirname, indexPath);
    res.sendFile(indexPath);
};

const home = (req: express.Request, res: express.Response) => {
    res.send(smsParser.instructionList())
};

const sms = async (req: express.Request, res: express.Response) => {
    console.log('sms params', req.url, req.query);
    console.log('message', req.query.m);
    if (req.query.m) {
        const instruction = smsParser.parse(req.query.m);
        const instructionResult = await instruction.action();
        sendSms(req.query.f, instructionResult);
        res.send(`sms ${req.query.m} : ${instructionResult}`);
    }
}

const PORT = 80;
export const setup = () => {
    const app = express();
    const publicPath = path.join(__dirname, '../dist/public');
    console.log('publicPath', publicPath);
    app.use(express.static(publicPath));
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/battery', battery);
    app.get('/', home);
    app.get('*', sms);

    app.listen(PORT, () => {
        console.log(`Poum app listening on port ${PORT}!`)
    });
}

export function getUrlFromServerHost(serverHost: ServerHost) {
    return `${serverHost.protocol}://${serverHost.host}:${serverHost.port}`;
}

export const sendSms = async (to: string, msg: string) => {
    const phone = to.replace('+336', '06');
    const encodedMessage = encodeURIComponent(msg);
    const uri = `${getUrlFromServerHost(configuration.smsServer)}/SendSMS/user=&password=123456&phoneNumber=${phone}&msg=${encodedMessage}`;
    console.log('send sms', uri);
    const res = await getTextFromUri(uri);
    console.log('send sms result', res);
}

export async function getJson<T>(uri: string): Promise<T> {
    const response = await fetch(uri);
    const json: T = await response.json();
    return json;
}


export async function getTextFromUri(uri: string): Promise<string> {
    const response = await fetch(uri).catch(err => console.error(err));
    if (response) {
        const text = await response.text();
        return text;
    }
    return '<KO>';
}


export async function postToUrl(uri: string, body: string): Promise<string> {
    const response = await fetch(uri, {
        body,
        method: "POST",
    }).catch(err => console.error(err));
    if (response) {
        const text = await response.text();
        return text;
    }
    return '<KO>';
}
