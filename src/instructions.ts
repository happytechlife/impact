import { SmsParser } from "./SmsParser";
import { getPublicIp } from "./publicIp";
import { tuyaSetState } from "./tuya";

export interface Instruction {
    name: string;
    action: () => Promise<string>;
}

export const help = {
    name: 'help',
    action: async () => {
        const parser = new SmsParser();
        return parser.instructionList();
    }
};
const stopBox = {
    name: 'stop box',
    action: async () => { console.log('stop box'); return tuyaSetState(false) }
};
const startBox = {
    name: 'start box',
    action: async () => { console.log('start box'); return tuyaSetState(true); }
};

const publicIpInstruction = {
    name: 'public ip',
    action: getPublicIp
}
export const instructions: Instruction[] = [help, publicIpInstruction, startBox, stopBox];