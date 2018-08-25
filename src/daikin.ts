import { getTextFromUri } from "./server";


interface DMandatoryControl {
    pow: 0 | 1;
    mode: 2 | 3 | 4 | 6;
    stemp: number;
    shum: number;
    f_rate: number;
    f_dir: number;
}

interface DOtherControls {

}
type DaikinControls = DMandatoryControl & DOtherControls;

export const getDaikinControls = async (ip: string): Promise<DaikinControls> => {
    const infosText = await getTextFromUri(`http://${ip}/aircon/get_control_info`);
    const res = infosText.split(',').reduce((controls: any, param) => {
        const res = param.split('=');
        controls[res[0]] = res[1];
        return controls;
    }, {})
    return res;
}


function getStringParamsFromControls(controls: any) {
    return Object.keys(controls).map(c => {
        return `${c}=${controls[c]}`;
    }).join('&');
}

export const setDaikinControls = async (ip: string, controls: DaikinControls) => {
    const url = `http://${ip}/aircon/set_control_info?${getStringParamsFromControls(controls)}`;
    console.log('set daiking with', url);
    const res = await getTextFromUri(url);
    console.log('daikin result', ip, res)
    return res;
}



function getMandatoryControls(controls: DaikinControls): DMandatoryControl {
    return {
        pow: controls.pow,
        mode: controls.mode,
        stemp: controls.stemp,
        shum: controls.shum,
        f_rate: controls.f_rate,
        f_dir: controls.f_dir
    }
}

export const updateDaikinPower = async (ip: string, pow: 0 | 1) => {
    const controls: any = await getDaikinControls(ip);
    const order = getMandatoryControls(controls);
    order.pow = pow;
    setDaikinControls(ip, order);
}

export const setDaikinTemperature = async (ip: string, stemp: number) => {
    const controls: any = await getDaikinControls(ip);
    const order = getMandatoryControls(controls);
    order.stemp = stemp;
    setDaikinControls(ip, order);
}