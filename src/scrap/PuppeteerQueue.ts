import * as cheerio from 'cheerio';
import { IQueueNode } from '../models';
import * as puppeteer from 'puppeteer';


type ActionNodeType<T> = (node: IQueueNode) => T | Promise<T> | undefined;
export class PuppeteerQueue {
    browser?: puppeteer.Browser;
    queue: IQueueNode[];
    current: IQueueNode | null;

    running: boolean;
    constructor() {
        this.current = null;
        this.queue = [];
        // this.c = new crawler({ rateLimit: 1000 });
    }
    start = async (browser: boolean) => {
        if (browser) {
            this.browser = await puppeteer.launch({ headless: false, devtools: false });
        }
        this.running = true;
        this.processQueue();
    }
    getPage = async () => {
        const { browser } = this;
        if (browser) {
            return await browser.newPage();
        }
    }
    get$ = async (page: puppeteer.Page) => {
        const body = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(body);
        return $;
    }

    close() {
        if (this.browser) {
            this.browser.close();
        }
    }

    addToQueue = <T>(action: ActionNodeType<T>, page?: puppeteer.Page) => {
        const promise = new Promise<T>(async resolve => {
            let node: IQueueNode = { action, resolve };
            this.queue.push(node);
        });
        return promise;
    }

    private runCurrentNode = async () => {
        if (this.current) {
            const { action, resolve } = this.current;
            try {
                const result = await action(this.current);
                this.current = null;
                resolve(result);
            } catch (error) {
                console.log(error);
                this.running = false;
                console.log('stop running');
            }
            this.current = null;
            resolve(null);
        }
    }

    private processQueue = () => {
        if (!this.running) {
            return;
        }
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
}