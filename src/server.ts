import * as express from 'express';
import * as bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as path from 'path';





// const page1 = (req: express.Request, res: express.Response) => {
//     const indexPath = path.join(__dirname, '../src/public/page1.html');
//     console.log('indexPath', __dirname, indexPath);
//     res.sendFile(indexPath);
// };

const home = (req: express.Request, res: express.Response) => {
    res.send('hi')
};


const PORT = 80;
export const setup = () => {
    const app = express();
    const publicPath = path.join(__dirname, '../dist/public');
    console.log('publicPath', publicPath);
    app.use(express.static(publicPath));
    app.use(bodyParser.urlencoded({ extended: false }));

    // app.get('page1', page1);
    app.get('/', home);


    app.listen(PORT, () => {
        console.log(`Poum app listening on port ${PORT}!`)
    });
}

// export function getUrlFromServerHost(serverHost: ServerHost) {
//     return `${serverHost.protocol}://${serverHost.host}:${serverHost.port}`;
// }

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
