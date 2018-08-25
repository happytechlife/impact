import * as puppeteer from 'puppeteer';

async function getJson<T>(page: puppeteer.Page, selector: string): Promise<T> {
    return page.evaluate(({ selector }) => {
        const i = document.querySelector(selector);
        return i && i.textContent && JSON.parse(i.textContent) as T;
    }, { selector });
};

interface BatteryState {
    state: boolean;
    diff: number;
}

export const batteryCheck = async (stopTimeSurvey: number, stopAction: (states: BatteryState[]) => void) => {
    // const options = { headless: false, devtools: true };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost/battery');
    await page.waitFor("#content");

    let saveList: BatteryState[] = [];
    setInterval(async () => {
        const list = await getJson<BatteryState[]>(page, '#content').catch(err => console.error(err));
        if (list) {
            if (saveList.length !== list.length) {
                const newValues = list.slice(saveList.length)
                // console.log('battery list new values', newValues)
                const powerStops = newValues.filter(bs => bs.state === true && bs.diff > stopTimeSurvey);
                if (powerStops.length > 0) {
                    // console.log(`battery cut for more than ${stopTimeSurvey} miliseconds`, powerStops)
                    stopAction(powerStops);
                }
                saveList = list;
            }
        }
    }, 5000);

    // await browser.close();
};