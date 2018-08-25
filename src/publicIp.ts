import * as publicIp from 'public-ip';

export const getPublicIp = () => {
    return new Promise<string>(resolve => {
        publicIp.v4().then((ip: string) => {
            console.log('public ip is', ip)
            return resolve(ip);
        });
    })
}