import * as fs from 'fs';
import { IStartupInput } from '../models';

export const getStartups = () => {
    const content = fs.readFileSync('./files/Startups - startupSearchTerms.csv').toString();

    const startups: IStartupInput[] = content.split('\r\n').slice(1).map(row => {
        const terms = row.split(',').filter(t => t);
        return { name: terms[0], searchTerms: terms.map(t => t.toLocaleLowerCase()) };
    })
    // console.log(startups);
    return startups;
    // .slice(0, 2);
}