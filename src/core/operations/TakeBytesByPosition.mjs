/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * TakeBytesByPosition operation
 */
class TakeBytesByPosition extends Operation {

    /**
     * TakeBytesByPosition constructor
     */
    constructor() {
        super();

        this.name = "Take bytes by position";
        this.module = "Default";
        this.description = "Takes a slice of the specified number of bytes from the data. Negative values are allowed.<br><br>The data's start position (offset) is taken from a position in the data. The postion must be a Byte, Word, DWord or QWord integer value. QWords are converted to a signed integer.<br><br>Example:<br>A file header contains the position of a UNIX timestamp at offset 40 as a 16-bit integer. With <code>40</code> as <code>Position Start</code>, <code>2 (Word)</code> as <code>Position Length</code> and the <code>Length</code> <code>4</code>, the timestamp is output.";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "Position Start",
                "type": "number",
                "value": 0
            },
            {
                name: "Position Length",
                type: "option",
                value: ["1 (Byte)", "2 (Word)", "4 (DWord)", "8 (QWord)"],
                defaultIndex: 2
            },
            {
                name: "Position Endianness",
                type: "option",
                value: ["Little Endian (Intel)", "Big Endian (Motorola)"],
                defaultIndex: 2
            },
            {
                "name": "Length",
                "type": "number",
                "value": 0
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const length = parseInt(args[1].substring(0, 1), 10),
            endianness = args[2].split(" ")[0].toLowerCase();

        let start = args[0];
        // A negative value counts from behind
        if (start < 0) start = input.byteLength + start;

        let dataLength = args[3];
        // A negative value takes all remaining data
        if (dataLength < 1) dataLength = input.byteLength - start;

        const bytes = new Uint8Array(input.slice(start, start + length));
        const dataOffset = Utils.byteArrayToInt(bytes, endianness);

        return new Uint8Array(input.slice(dataOffset, dataOffset + dataLength)).buffer;
    }

}

export default TakeBytesByPosition;
