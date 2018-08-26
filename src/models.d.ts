export interface IGoogleLink {
    title: string;
    link: string;
    page: number;
    terms: string[];
    searchTerms: string[];
    description: string;
}

export interface IStartupInput {
    name: string;
    searchTerms: string[];
}

export interface IQueueNode {
    resolve: any;
    // uri: string;
    action: (node: IQueueNode) => void;
}

export interface HPage {
    page: puppeteer.Page;
    $: CheerioStatic;
}

