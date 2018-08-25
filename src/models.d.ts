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