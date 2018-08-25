// import { tuyaConnect } from "./tuya";

// import { tuyaLinkDevice } from "./tuya";

// import { sendSms } from './server';
// import { numbers } from './places';
// import { setDaikinTemperature } from './daikin';
// import { tuyaLinkDevice } from './tuya';
// import { updatePublicIpOnDomain } from './mydns';
// import { batteryCheck } from './battery';
// import { getWeather } from './weather';
// import { places } from './places';

// setup();
// sendSms(numbers.pouya, "Tu peux changer mon nom en Alfred De LaPoum 3.")

// (async () => {
//     setInterval(async () => {
//         const a = await getWeather(places.rognes);
//         const message = `Salut Jeanne, voici la temperature à Rognes ${a.main.temp}°c`;
//         console.log(message);
//         sendSms('0668755503', message);
//     }, 60 * 1000 * 10)
// })()

// start();

// updatePublicIpOnDomain('origamix.fr', 'rognes');
// batteryCheck(2000, (states) => {
//     console.log('states', states);
//     const time = states.map(s => `${Math.round(s.diff / 1000)}s`).join(', ');
//     const message = `Votre appareil est hors tension depuis plus de ${time}`;
//     sendSms('0668755503', message);
// });

// tuyaConnect();
// tuyaLinkDevice();


// updateDaikinPower('192.168.0.161', 1)
// setDaikinTemperature('192.168.0.161', 25);
