// import * as request from 'request';
import * as cheerio from 'cheerio';
import { IGoogleLink } from '../models';
import * as puppeteer from 'puppeteer';


interface IQueueNode {
    resolve: any;
    // uri: string;
    action: () => Promise<string>;
}

export class CrawlerPromise {
    page?: puppeteer.Page;
    queue: IQueueNode[];
    current: IQueueNode | null;
    constructor() {
        this.current = null;
        this.queue = [];
        // this.c = new crawler({ rateLimit: 1000 });
    }

    start = async () => {
        const browser = await puppeteer.launch({ headless: false, devtools: true });
        this.page = await browser.newPage();
        this.processQueue();
    }

    addToQueue = <T>(action: () => Promise<string>) => {
        // console.log('this.addToQueue', uri);
        const promise = new Promise<T>(async resolve => {
            this.queue.push({ action, resolve });
        });
        return promise;
        // return uri;
    }

    runCurrentNode = async () => {
        if (this.current) {
            const { action, resolve } = this.current;
            const result = await action();
            this.current = null;
            resolve(result);
        }
    }

    processQueue = () => {
        setTimeout(async () => {
            console.log('process queue', this.queue.length, this.current);
            if (this.current === null) {
                if (this.queue.length > 0) {
                    this.current = this.queue.shift() || null;
                    await this.runCurrentNode();
                }
            }
            this.processQueue();
        }, 800 + Math.floor(Math.random() * 600))
    }

    getCheerio = async (searchTerms: string[], currentPage: number) => {
        // return null;
        // const s = `https://www.google.fr/search?q=${q}&start=${start}`;
        const { page } = this;
        const html = await this.addToQueue<Promise<string>>(async () => {
            if (page) {
                const m = getActionForPage(page, searchTerms, currentPage);
                const res = await m();
                return res;
            }
            return 'body';
        });
        return cheerio.load(html);
    }
}

const getActionForPage = (page: puppeteer.Page, searchTerms: string[], currentPage: number) => {
    const action = async (): Promise<string> => {
        const q = searchTerms.map(t => t.indexOf(' ') !== -1 ? `"${t}"` : t).join(' ').toLocaleLowerCase();
        console.log('')
        if (page) {
            await page.goto('http://www.google.fr/');
            await page.waitFor('input#lst-ib');
            await page.type('input#lst-ib', q, { delay: 25 });
            await page.click('input[name="btnK"]');
            await page.waitFor('.g');
            let body = await page.evaluate(() => document.body.innerHTML);
            return body;
        }
        return '<no_string>';
    };
    return action;
}

// const getCheerioFromHtml = async (html: string) => {
//     const $ = cheerio.load(html);
//     return $;
// }

// const getCheerioFromRequest = async (html: string) => {
//     return new Promise<CheerioStatic>(r => {
//         request.get(url, {
//             headers: {
//                 'content-type': 'text/html; charset=utf-8',
//                 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
//             }
//         }, (err, resp, html) => {
//             if (!err) {
//                 console.log(html)
//                 const $ = cheerio.load(html);
//                 r($);
//             }
//         });
//     })
// }

export const getAllLinks = async (c: CrawlerPromise, terms: string[], number: number): Promise<IGoogleLink[]> => {
    const count = 10;
    let allPairLinks: IGoogleLink[] = [];
    console.log(terms);
    for (let start = 0; start < number; start += count) {
        const links = await getLinks(c, terms, start / 10);
        // const links: IGoogleLink[] = await Promise.all(linksPromeses);
        // console.log(links);
        allPairLinks = allPairLinks.concat(links);
    }
    return allPairLinks;
}

const getLinksFromCheero = ($: CheerioStatic, searchTerms: string[], page: number): IGoogleLink[] => {
    const links: IGoogleLink[] = [];
    console.log($('.g').length);
    $('.g').each((i, e) => {
        const title = $(e).find('h3:first-child').text();
        const link = $(e).find('a:first-child').attr('href');
        const description = $(e).find('span.st').text();
        const terms: string[] = $(e).find('span.st em').toArray().map(e => $(e).text().toLowerCase())
        console.log('title', title, link);
        if (title) {
            const allSearchTermsAreInTerms = terms.length > 0 && searchTerms.filter(st => terms.find(t => st === t))
            // const allSearchTermsAreInTerms = true;
            if (allSearchTermsAreInTerms) {
                const googlePage = { title, link, page, terms, description, searchTerms }
                // console.log(googlePage);
                links.push(googlePage);
            }
        } else {
            return null;
        }
    });
    // console.log(links);
    return links;
}
// Promise < string | undefined
export const getLinks = async (c: CrawlerPromise, searchTerms: string[], page: number) => {
    console.log('get links', searchTerms);
    const $ = await c.getCheerio(searchTerms, page);
    if ($) {
        return getLinksFromCheero($, searchTerms, page);
    }
    return [];
}