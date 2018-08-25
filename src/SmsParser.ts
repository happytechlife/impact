import { instructions, Instruction, help } from "./instructions";

export class SmsParser {
    instructionList = (): string => {
        return instructions.map((ins, i) => `${i}. ${ins.name}`).join(', ');
    }
    parse = (message?: string): Instruction => {
        if (message) {
            message = message.toLowerCase();
            const words = message.split(' ');
            if (words.length === 1) {
                const number = parseInt(words[0], 10);
                if (!isNaN(number)) {
                    const instruction = instructions[number];
                    console.log('instruction found', instruction.name);
                    if (instruction) {
                        return instruction;
                    }
                }
            }
        }
        return help;
    }
}



