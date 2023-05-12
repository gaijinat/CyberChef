/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * ByteAnalyser operation
 */
class ByteAnalyser extends Operation {

    /**
     * ByteAnalyser constructor
     */
    constructor() {
        super();

        this.name = "Byte Analyser";
        this.module = "Default";
        this.description = "Analyses the bytes in the input and displays statistics about them.<br><br>The histogram shows the distribution of the individual bytes.";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                "name": "Show histogram",
                "type": "boolean",
                "value": true,
            },
            {
                "name": "Show 0%s",
                "type": "boolean",
                "value": false,
            },
            {
                "name": "Sort by count",
                "type": "boolean",
                "value": true,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        const data = new Uint8Array(input),
            byteTable = [],
            byteCount = data.length;

        let byteRepresented = 0,
            byteRepresentedPercent = 0.0,
            byteNotRepresented = 256,
            byteNotRepresentedPercent = 0.0,
            asciiCharsRepresented = "",
            asciiRegExCharRange = "",
            maxCount = 0,
            i;

        // Initialisation of byte information data
        for (i = 0; i < 256; i++) {
            byteTable[i] = {
                dec: i,
                char: this.printableChar(i),
                hex: i.toString(16).toUpperCase().padStart(2, "0"),
                bin: i.toString(2).padStart(8, "0"),
                count: 0,
                percent: 0.0,
                proportion: 0.0,
            };
        }

        // Count bytes in data
        for (i = 0; i < byteCount; ++i) {
            byteTable[data[i]].count++;
        }

        // Get the count of the most represented byte (100% in statistics)
        for (i = 0; i < byteTable.length; ++i) {
            if (byteTable[i].count > maxCount) maxCount = byteTable[i].count;
        }

        // Calculate percentage occurrence of bytes
        const divPercent = (100 / byteCount);
        const divProportion = (100 / maxCount);
        for (i = 0; i < byteTable.length; ++i) {
            byteTable[i].percent = (byteTable[i].count * divPercent).toFixed(4);
            byteTable[i].proportion = (byteTable[i].count * divProportion).toFixed(2);

            if (byteTable[i].count > 0) {
                // Collect represented bytes
                byteRepresented++;
                // Collect represented printable ASCII characters
                if ((i >= 32) && (i <= 127)) {
                    asciiCharsRepresented += byteTable[i].char;
                }
            }
        }

        byteRepresentedPercent = (byteRepresented * (100 / 256)).toFixed(2);
        byteNotRepresented = 256 - byteRepresented;
        byteNotRepresentedPercent = (byteNotRepresented * (100 / 256)).toFixed(2);

        asciiRegExCharRange = this.getRegExCharRange(asciiCharsRepresented);

        // console.log(byteTable);

        return {
            "byteTable": byteTable,
            "byteCount": byteCount,
            "byteRepresented": byteRepresented,
            "byteRepresentedPercent": byteRepresentedPercent,
            "byteNotRepresented": byteNotRepresented,
            "byteNotRepresentedPercent": byteNotRepresentedPercent,
            "asciiCharsRepresented": asciiCharsRepresented,
            "asciiRegExCharRange": asciiRegExCharRange,
        };
    }

    /**
     * Displays the statistics for web apps.
     *
     * @param {json} statistics
     * @returns {html}
     */
    present(stat, args) {
        const [showHistogram, showZeros, sortCount] = args;

        let output = "",
            i;

        const clsc = ' class="text-center" style="background-color: var(--secondary-background-colour);"',
            clsr = ' class="text-right"';

        // Histogram
        if (showHistogram) {
            output += '<div style="border:1px solid var(--table-border-colour);">';
            output += '<table style="border:0; table-layout:fixed; border-collapse:collapse; border-spacing:0; padding:0; width:100%;">';
            for (i = 0; i < 256; i++) {
                output += '<td title="';
                output += `Character ${stat.byteTable[i].dec.toString()} (0x${stat.byteTable[i].hex}) &quot;${this.htmlEntities(stat.byteTable[i].char)}&quot;\nCount: ${stat.byteTable[i].count.toLocaleString("en")} (${stat.byteTable[i].percent.toLocaleString("en")}%)`;
                output += '" style="vertical-align:bottom; padding:0; background-color: var(--';
                if (i % 2) output += "primary"; else output += "secondary";
                output += `-background-colour);"><div style="height:${(stat.byteTable[i].proportion * 2).toString()}px;background-color:var(--primary-font-colour);"></div></td>`;
            }
            output += "</tr></table></div>\n";
        }

        // Overview
        output += '<table class="table table-hover table-sm table-bordered" style="table-layout:fixed; width:auto;">';
        output += `<tr><td${clsr}>Number of bytes total:</td><td colspan="2"><b>${stat.byteCount.toLocaleString("en")}</b></td></tr>`;
        output += `<tr><td${clsr}>Number of bytes represented:</td><td${clsr}><b>${stat.byteRepresented.toLocaleString("en")}</b></td><td${clsr}>(${stat.byteRepresentedPercent.toLocaleString("en")}%)</td></tr>`;
        output += `<tr><td${clsr}>Number of bytes not represented:</td><td${clsr}><b>${stat.byteNotRepresented.toLocaleString("en")}</b></td><td${clsr}>(${stat.byteNotRepresentedPercent.toLocaleString("en")}%)</td></tr>`;
        output += "</table>\n";

        output += "<dl><dt>Represented printable ASCII characters:</dt><dd>" + this.htmlEntities(stat.asciiCharsRepresented) + "</dd>";
        output += "<dt>ASCII Character Range for regular expressions:</dt><dd>[" + this.htmlEntities(stat.asciiRegExCharRange) + "]</dd></dl>\n";

        // Details
        if (sortCount) {
            stat.byteTable.sort(this.compareByteTableItemsCount);
        }
        output += '<table class="table table-hover table-sm table-bordered" style="table-layout:fixed; width:auto;">';
        output += `<tr><th${clsc}>Binary</th><th${clsc}>Hex</th><th${clsc}>Code</th><th${clsc}>Char</th><th${clsc}>Count</th><th${clsc}>Percent</th></tr>`;
        for (i = 0; i < 256; i++) {
            if (!showZeros && (stat.byteTable[i].count === 0)) continue;
            output += `<tr><td${clsr}>${stat.byteTable[i].bin}</td><td${clsr}>${stat.byteTable[i].hex}</td>`;
            output += `<td${clsr}>${stat.byteTable[i].dec.toString()}</td><td${clsc}><b>${this.htmlEntities(stat.byteTable[i].char)}</b></td>`;
            output += `<td${clsr}>${stat.byteTable[i].count.toLocaleString("en")}</td><td${clsr}>${stat.byteTable[i].percent.toLocaleString("en")}</td></tr>`;
        }
        output += "</table>\n";

        return output;
    }


    /**
     * Gets the printable character for a byte.
     *
     * @param {UInt8} charCode
     * @returns {html}
     */
    printableChar(charCode) {
        if (charCode < 32) return " ";
        if (charCode === 127) return " ";

        return String.fromCharCode(charCode);
    }

    /**
     * Compare byteTable items by count.
     */
    compareByteTableItemsCount(a, b) {
        if (a.count > b.count) {
            return -1;
        } else if (a.count < b.count) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Converts reserved characters to HTML entities.
     *
     * @param {string} string
     * @returns {string}
     */
    htmlEntities(string) {
        return String(string).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /**
     * Gets a regular expression character range for the ASCII character in the string.
     *
     * @param {string} string - must contain only unique characters sorted by character code
     * @returns {string}
     */
    getRegExCharRange(string) {
        if (string.length < 3) return string;

        let current,
            next,
            last = string.charCodeAt(0),
            result = "",
            resultRange = "",
            inRange = false;

        for (let i = 0; i < string.length; i++) {
            current = string.charCodeAt(i);

            // Byte is not a digit or letter ("0-9A-Za-z")
            // A regex range with other characters is confusing, e.g. "!-7" or "X-c"
            if (!this.byteIsDigitOrLetter(current)) {
                result += string[i];
                last = 0;
                inRange = false;
                continue;
            }

            // Get next byte and check if it is a digit or letter
            if (i < string.length) {
                next = string.charCodeAt(i + 1);
                if (!this.byteIsDigitOrLetter(next)) next = 0;
            } else {
                next = 0;
            }

            // Check if the current byte is directly between the last and next byte
            if (last + 1 === current) {
                if (current + 1 === next) {
                    if (!inRange) resultRange += "-";
                    last = current;
                    inRange = true;
                    continue;
                }
            }

            // Char is a digit or letter and not in a range
            resultRange += string[i];
            last = current;
            inRange = false;
        }

        result = this.escapeRegExSpecialChars(result);

        return resultRange + result;
    }

    /**
     * Escapes special characters used in regular expressions.
     *
     * @param {string} string
     * @returns {string}
     */
    escapeRegExSpecialChars(string) {
        const specialChars = "\\^$?*+-.|()[]{}";
        let result = "";

        for (let i = 0; i < string.length; i++) {
            if (specialChars.indexOf(string[i]) === -1) {
                result += string[i];
            } else {
                result += "\\" + string[i];
            }
        }

        return result;
    }

    /**
     * Checks if a byte (character code) is a digit or letter.
     *
     * @param {byte} byte
     * @returns {boolean}
     */
    byteIsDigitOrLetter(byte) {
        // 0-9 = 48-57, A-Z = 65-90, a-z = 97-122
        return ((byte >= 48 && byte <= 57) || (byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122));
    }

}

export default ByteAnalyser;
