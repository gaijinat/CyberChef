/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * BytesToDecimal operation
 */
class BytesToDecimal extends Operation {

    /**
     * BytesToDecimal constructor
     */
    constructor() {
        super();

        this.name = "Bytes to Decimal";
        this.module = "Default";
        this.description = "Converts one or more bytes to a decimal number.<br><br>The bytes at the specified offset are converted to an unsigned integer depending on their length (Byte, Word or DWord). QWords are converted to a signed integer.";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Start",
                "type": "number",
                "value": 0
            },
            {
                name: "Length",
                type: "option",
                value: ["1 (Byte)", "2 (Word)", "4 (DWord)", "8 (QWord)"],
                defaultIndex: 2
            },
            {
                name: "Endianness",
                type: "option",
                value: ["Little Endian (Intel)", "Big Endian (Motorola)"],
                defaultIndex: 2
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

        const bytes = new Uint8Array(input.slice(start, start + length));

        return Utils.byteArrayToInt(bytes, endianness).toString();
    }

}

export default BytesToDecimal;
