import * as fs from 'fs';


function getPath(name: string) {
    return `./db/${name}.json`
}


export const append = <T>(name: string, list: T[]) => {
    const db = loadFromFile<T[]>(name) || [];
    saveInFile(name, db.concat(list));
}
export const saveInFile = (name: string, content: any) => {
    fs.writeFileSync(getPath(name), JSON.stringify(content, undefined, 4), { encoding: 'utf-8' });
}

export const loadFromFile = <T>(name: string): T | null => {
    const file = getPath(name);
    if (fs.existsSync(file)) {
        const res = fs.readFileSync(file, { encoding: 'utf-8' });
        return JSON.parse(res) as T;
    }
    return null;
}