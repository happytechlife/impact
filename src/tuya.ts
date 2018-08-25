// const apiKey = '--';
// const apiSecret = '--';
// const user = { email: '--@gmail.com', password: '--' };
// const region = 'EU';

// import fetch from 'node-fetch';

// export const tuyaLinkDevice = async () => {
// const TuyaLink = require('@tuyapi/link');
// const Cloud = require('@tuyapi/cloud');

// let api = new Cloud({ key: apiKey, secret: apiSecret, region });

// let devices = await api.linkDevice({ ssid: 'Livebox', wifiPassword: '--' }).catch((err: any) => console.error('linkDevice', err));
// console.log(devices);
// api.register(user).then(async (sid: any) => {
//     console.log(sid);
//     // let token = await api.request({ action: 'tuya.m.device.token.create', data: { 'timeZone': '-05:00' } });

//     // console.log(token) // => { secret: '0000', token: '01010101' }
// }).catch((err: any) => console.error('api register', err));;
// const register = new TuyaLink.wizard({
//     apiKey,
//     apiSecret,
//     ...user,
//     region: 'EU'
// });

// const register = new TuyaLink.manual({});
// register.init();
// console.log(register);
// const init = await api.login(user).catch((err: any) => console.error('init', err));
// console.log('init', init);
// if (init) {
//     let devices = await register.linkDevice({ ssid: 'Livebox', wifiPassword: '--' }).catch((err: any) => console.error('linkDevice', err));
//     console.log(devices);
// }


// register.init().then(async () => {
//     let devices = await register.linkDevice({ ssid: 'Livebox', wifiPassword: '--' }).catch((err: any) => console.error('linkDevice', err));
//     console.log(devices);
// }).catch((err: any) => console.error('init', err));
// }
const id = '05200288bcddc2e904d4';
const tuyaConf = {
    id,
    uid: id,
    key: 'd293a3549e692aca',
    ip: '192.168.1.33',
    version: 3.1
};

export const tuyaSetState = async (state: boolean) => {
    const TuyaDevice = require('tuyapi');
    let tuya = new TuyaDevice(tuyaConf);
    await tuya.resolveId();
    const res = await tuya.set({ set: state });
    console.log('update state on tuya', res);
    return res.toString();
}

export const tuyaConnect = () => {
    console.log('tuyaConnect');
    const TuyaDevice = require('./../dist/tuyapi');
    let tuya = new TuyaDevice(tuyaConf);
    tuya.resolveId().then(() => {
        console.log('ready!');
        tuya.get().then((status: any) => {
            console.log('Status:', status);
            // console.log('schema', schema);
            const set = tuya.set({ set: !status });
            set.then((result: any) => {
                console.log('Result of setting status to ' + !status + ': ' + result);
                tuya.get().then((status: any) => {
                    console.log('New status:', status);
                    return;
                });
            }).catch((err: any) => console.log(err));
        }).catch((err: any) => console.log(err));
    })
}