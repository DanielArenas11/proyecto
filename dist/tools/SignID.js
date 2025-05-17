"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnowflake = getSnowflake;
const EPOCH = 1746075600000;
let sequence = 0;
let lastTimestamp = -1;
const machineId = 64;
function getSnowflake() {
    const current = Date.now();
    if (current === lastTimestamp) {
        sequence = (sequence + 1) & 0xfff;
        if (sequence === 0) {
            while (Date.now() === lastTimestamp)
                ;
        }
    }
    else {
        sequence = 0;
    }
    lastTimestamp = current;
    //@ts-ignore
    const timestamp = BigInt(current - EPOCH) << 22n;
    //@ts-ignore
    const machine = BigInt(machineId) << 12n;
    const seq = BigInt(sequence);
    return (timestamp | machine | seq).toString();
}
