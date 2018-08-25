
import { getAllLinks, CrawlerPromise } from './scrap/scrap';
import { getStartups } from './scrap/loadStartups';
import { IStartupInput, IGoogleLink } from './models';
import { saveInFile } from './storage/files';


export function mergeArrayOfArray<T>(src: any[][]) {
    return [].concat.apply([], src) as T[];
}

export const getStartupLink = async (c: CrawlerPromise, startup: IStartupInput) => {
    const listP = startup.searchTerms.map(async searchTerm => {
        const terms = ['happytech', searchTerm];
        return getAllLinks(c, terms, 10);
    });
    const links = await Promise.all(listP);
    const allLinks = mergeArrayOfArray<IGoogleLink>(links);
    return allLinks;
}

async function getLinksFromDbBeforeScrap() {
    // let links = loadFromFile<IGoogleLink[]>('google');
    // if (links === null) {

    const c = new CrawlerPromise();
    c.start();


    const linksPromeses = startups.map(s => getStartupLink(c, s));
    const a = await Promise.all(linksPromeses);
    return a;


    // }
    // return links;
}

const search = async (startups: IStartupInput[]) => {
    //  startups.map(getStartupLink);
    const links = await getLinksFromDbBeforeScrap();

    saveInFile('google', links);
    console.log(links);
    // console.log(s1, s1.length);
    // fs.writeFileSync('./files/google.json', JSON.stringify(links, undefined, 4), { encoding: 'utf-8' });
}

const startups = getStartups();
search(startups);
