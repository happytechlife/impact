// import * as request from 'request';
import { IGoogleLink, IQueueNode } from '../models';
import * as puppeteer from 'puppeteer';
import { PuppeteerQueue } from './PuppeteerQueue';
import { append } from '../storage/files';

async function findLinks(page: puppeteer.Page, searchTerms: string[]) {
    const q = searchTerms.map(t => t.indexOf(' ') !== -1 ? `"${t}"` : t).join(' ').toLocaleLowerCase();
    await page.goto('http://www.google.fr/', { waitUntil: 'networkidle2' });
    await page.waitFor('input#lst-ib');
    await page.type('input#lst-ib', q, { delay: 25 });
    await rwait();
    await page.click('input[name="btnK"]');
    await waitToGooglePage(page);
}

async function waitToGooglePage(page: puppeteer.Page) {
    await page.waitFor('.g');
    await page.waitFor('h3:first-child');
    await page.waitFor('#navcnt')
}

export const wait = (seconds: number) => {
    return new Promise(r => {
        setTimeout(r, seconds * 1000);
    })
}

export const rwait = (seconds?: number) => {
    seconds = seconds || 4;
    const ms = seconds * 1000;
    const range = ms / 2;
    const r = range + Math.random() * range * 2;
    const random = Math.floor(r);
    return new Promise(r => {
        setTimeout(r, random);
    })
}


export const goGoogleAndSearchTermAndGetLinks = (queue: PuppeteerQueue, searchTerms: string[], currentPage: number) => {
    const action = async (node: IQueueNode) => {
        let page = await queue.getPage();
        let allLinks: IGoogleLink[] = [];
        if (page) {
            await findLinks(page, searchTerms);
            let hasStillPages = true;
            while (hasStillPages && currentPage < 20) {
                const $ = await queue.get$(page);
                const links = getLinksFromGooglePage($, searchTerms, currentPage);
                append('google', links);
                allLinks = allLinks.concat(links);
                await rwait();
                const nextPageNumber = currentPage + 1;
                const nextPage = `a[aria-label="Page ${nextPageNumber}"]`;
                const stillHasPage = $(nextPage).length > 0;
                console.log(searchTerms, stillHasPage, currentPage, nextPageNumber);
                if (stillHasPage) {
                    await page.click(nextPage);
                    await waitToGooglePage(page);
                } else {
                    hasStillPages = false;
                }
                currentPage += 1;
            }
            await rwait();
            page.close();
            return allLinks;
        }
        return [];
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


const getLinksFromGooglePage = ($: CheerioStatic, searchTerms: string[], currentPage: number): IGoogleLink[] => {
    return $('.g').toArray().map((e) => {
        const title = $(e).find('h3:first-child').text();
        const link = $(e).find('a:first-child').attr('href');
        const description = $(e).find('span.st').text();
        const terms: string[] = $(e).find('span.st em').toArray().map(e => $(e).text().toLowerCase())
        if (title) {
            const allSearchTermsAreInTerms = terms.length > 0 &&
                searchTerms.filter(st => terms.find(t => st === t)).length === searchTerms.length
            if (allSearchTermsAreInTerms) {
                console.log(allSearchTermsAreInTerms, terms, searchTerms);
                const googlePage: IGoogleLink = { title, link, page: currentPage, terms, description, searchTerms }
                return googlePage;
            }
        }
    }).filter(f => f) as IGoogleLink[];
}
// Promise < string | undefined
