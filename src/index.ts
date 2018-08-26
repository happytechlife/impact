import { HappyBot } from "./HappyBot";
import { loadFromFile } from "./storage/files";
import { IGoogleLink } from "./models";

// import { saveInFile } from './storage/files';


export function mergeArrayOfArray<T>(src: any[][]) {
    return [].concat.apply([], src) as T[];
}


type LinkMap = { [key: string]: IGoogleLink[] }

export function display() {
    const startups = loadFromFile<IGoogleLink[]>('google');
    if (startups) {
        // let links = mergeArrayOfArray<any>(startups);
        const links = startups;
        // links = mergeArrayOfArray<any>(links);
        // console.log(links.length);
        const init: LinkMap = {};
        const map: LinkMap = links.reduce((acc, value) => {
            if (value.searchTerms) {
                const key = value.searchTerms.join('||');
                const list = acc[key] || [];
                list.push(value);
                acc[key] = list;
                return acc;
            } else {
                // console.log(value);
            }
            return init;
        }, init);
        Object.keys(map).forEach(key => {
            console.log(key, map[key].length);
            const excludes = ['facebook.com', 'pinterest', 'linkedin.com'];
            const links = map[key].filter(v => excludes.filter(e => v.link && v.link.indexOf(e) > -1).length === 0);
            console.log(links.map(l => `${l.link}|${l.searchTerms.join(':')}|${l.terms.join(':')}`));
        })
    }
}
const search = async () => {
    const bot = new HappyBot();
    await bot.born();
    await bot.walk();
    bot.die();

    // display();

}


search();
