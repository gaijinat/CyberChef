/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {URL_REGEX, DOMAIN_REGEX} from "../lib/Extract.mjs";

/**
 * RefangURL operation
 */
class RefangURL extends Operation {

    /**
     * RefangURL constructor
     */
    constructor() {
        super();

        this.name = "Refang URL";
        this.module = "Default";
        this.description = "Takes a defanged Universal Resource Locator (URL) and 'Refangs' it. This is the opposite of the operation 'Defang URL'.<br><br>Additionaly, <code>[DOT]</code> and <code>[AT]</code> can be replaced and spaces can be removed.";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Unescape [.]",
                type: "boolean",
                value: true
            },
            {
                name: "Unescape hxxp",
                type: "boolean",
                value: true
            },
            {
                name: "Unescape [://]",
                type: "boolean",
                value: true
            },
            {
                name: "Unescape [DOT] and [AT]",
                type: "boolean",
                value: true
            },
            {
                name: "Remove spaces",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [dots, http, slashes, dotats, spaces] = args;

        input = refangURL(input, dots, http, slashes, dotats, spaces);

        return input;
    }

}


/**
 * Refangs a given URL
 *
 * @param {string} url
 * @param {boolean} dots
 * @param {boolean} http
 * @param {boolean} slashes
 * @param {boolean} dotats
 * @param {boolean} spaces
 * @returns {string}
 */
function refangURL(url, dots, http, slashes, dotats, spaces) {
    if (spaces) {
        if (dots) url = url.replace(/ *\[ *\. *\] */g, ".");
        if (http) url = url.replace(/hxxp/gi, "http");
        if (slashes) url = url.replace(/ *\[ *:\/\/ *\] */g, "://");
        if (dotats) {
            url = url.replace(/ *\[ *DOT *\] */gi, ".");
            url = url.replace(/ *\[ *AT *\] */gi, "@");
        }
    } else {
        if (dots) url = url.replace(/\[\.\]/g, ".");
        if (http) url = url.replace(/hxxp/gi, "http");
        if (slashes) url = url.replace(/\[:\/\/\]/g, "://");
        if (dotats) {
            url = url.replace(/\[DOT\]/gi, ".");
            url = url.replace(/\[AT\]/gi, "@");
        }
    }
    return url;
}

export default RefangURL;
