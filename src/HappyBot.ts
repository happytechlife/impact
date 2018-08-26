import { getStartups } from "./scrap/loadStartups";
import { PuppeteerQueue } from "./scrap/PuppeteerQueue";
import { IGoogleLink, IStartupInput } from "./models";
import { goGoogleAndSearchTermAndGetLinks } from "./scrap/scrap";
import { append, loadFromFile } from "./storage/files";

export class HappyBot {

    queue: PuppeteerQueue;
    constructor() {
        this.queue = new PuppeteerQueue();
    }

    goSearchFor = async (terms: string[]): Promise<IGoogleLink[]> => {
        console.log('search for terms', terms);
        const links = await this.queue.addToQueue<IGoogleLink[]>(goGoogleAndSearchTermAndGetLinks(this.queue, terms, 1))
        return links;
    }

    getStartupLinks = async (startup: IStartupInput) => {
        const startups = loadFromFile<string[]>('startups') || [];
        if (startups.indexOf(startup.name) !== -1) {
            return [];
        }
        const pairs = startup.searchTerms.reduce((acc, searchTerm) => {
            const terms = ['happytech', searchTerm];
            return [...acc, terms]
        }, []);
        const links = await Promise.all(pairs.map(async pair => this.goSearchFor(pair)));

        append('startups', [startup.name])
        return links;
    }

    born = async () => {
        this.queue.start(true);
    }

    die = async () => {
        this.queue.close();
    }

    walk = async () => {
        const startups = getStartups();
        const links = await Promise.all(startups.map(s => this.getStartupLinks(s)));
        return links;
    }

}