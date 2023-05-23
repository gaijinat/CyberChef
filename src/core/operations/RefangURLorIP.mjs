/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * RefangURLorIP operation
 */
class RefangURLorIP extends Operation {

    /**
     * RefangURLorIP constructor
     */
    constructor() {
        super();

        this.name = "Refang URLs or IP Addresses";
        this.module = "Default";
        this.description = "Takes a defanged Universal Resource Locator (URL) or IP address and 'Refangs' it. This is the counterpart to the 'Defang URL' and 'Defang IP Addresses' operations.<br><br>Additionaly, <code>[DOT]</code> and <code>[AT]</code> can be replaced and spaces can be removed.";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Unescape dots",
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
                value: false
            },
            {
                name: "Process",
                type: "option",
                value: ["Valid domains, IP addresses and full URLs", "Only full URLs", "Only IP addresses", "Everything"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [dots, http, slashes, dotats, spaces, process] = args;

        // URL regular expression
        const protocol = "[A-Z]+(?:://| *\\[ *:// *\\] *)",
            hostname = "[-\\w]+(?:(?:\\.| *\\[ *(?:\\.|DOT) *\\] *)\\w[-\\w]*)+",
            port = ":\\d+",
            path = "/[^.!,?\"<>\\[\\]{}\\s\\x7F-\\xFF]*" + "(?:[.!,?]+[^.!,?\"<>\\[\\]{}\\s\\x7F-\\xFF]+)*";
        const URL_REGEX_REFANG = new RegExp(protocol + hostname + "(?:" + port + ")?(?:" + path + ")?", "ig");

        // Domain name regular expression
        const DOMAIN_REGEX_REFANG = /\b((?=[a-z0-9-]{1,63}(?:\\.| *\[ *(?:\.|DOT) *\] *))(xn--)?[a-z0-9]+(-[a-z0-9]+)*(?:\\.| *\[ *(?:\.|DOT) *\] *))+[a-z]{2,63}\b/ig;

        // IPv4 regular expression
        const IPV4_REGEX_REFANG = new RegExp("(?:(?:\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])(?:\\.| *\\[ *(?:\\.|DOT) *\\] *)){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d|\\d)(?:\\/\\d{1,2})?", "g");

        // IPv6 regular expression
        // const IPV6_REGEX = new RegExp("((?=.*::)(?!.*::.+::)(::)?([\\dA-Fa-f]{1,4}:(:|\\b)|){5}|([\\dA-Fa-f]{1,4}:){6})((([\\dA-Fa-f]{1,4}((?!\\3)::|:\\b|(?![\\dA-Fa-f])))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})", "g");
        const IPV6_REGEX_REFANG = new RegExp("((?=.*(?:::| *\\[ *:: *\\] *| *\\[ *: *\\] *\\[ *: *\\] *))(?!.*(?:::| *\\[ *:: *\\] *| *\\[ *: *\\] *\\[ *: *\\] *).+(?:::| *\\[ *:: *\\] *| *\\[ *: *\\] *\\[ *: *\\] *))((?:::| *\\[ *:: *\\] *| *\\[ *: *\\] *\\[ *: *\\] *))?([\\dA-Fa-f]{1,4}(?::| *\\[ *: *\\] *)((?::| *\\[ *: *\\] *)|\\b)|){5}|([\\dA-Fa-f]{1,4}(?::| *\\[ *: *\\] *)){6})((([\\dA-Fa-f]{1,4}((?!\\3)(?:::| *\\[ *:: *\\] *| *\\[ *: *\\] *\\[ *: *\\] *)|(?::| *\\[ *: *\\] *)\\b|(?![\\dA-Fa-f])))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])(?:\\.| *\\[ *(?:\\.|DOT) *\\] *)?\\b){4})", "g");

        switch (process) {
            case "Valid domains, IP addresses and full URLs":
                input = input.replace(URL_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                input = input.replace(DOMAIN_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                input = input.replace(IPV4_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                input = input.replace(IPV6_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                break;
            case "Only full URLs":
                input = input.replace(URL_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                break;
            case "Only IP addresses":
                input = input.replace(IPV4_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                input = input.replace(IPV6_REGEX_REFANG, x => {
                    return RefangURLorIP.refangURL(x, dots, http, slashes, dotats, spaces);
                });
                break;
            case "Everything":
                return RefangURLorIP.refangURL(input, dots, http, slashes, dotats, spaces);
        }

        return input;
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
    static refangURL(url, dots, http, slashes, dotats, spaces) {
        if (spaces) {
            if (dots) {
                url = url.replace(/ *\[ *\. *\] */g, ".");
                url = url.replace(/ *\[ *:: *\] */g, "::"); // for IPv6
                url = url.replace(/ *\[ *: *\] */g, ":"); // for IPv6
            }
            if (http) url = url.replace(/hxxp/gi, "http");
            if (slashes) url = url.replace(/ *\[ *:\/\/ *\] */g, "://");
            if (dotats) {
                url = url.replace(/ *\[ *DOT *\] */gi, ".");
                url = url.replace(/ *\[ *(?:AT|@) *\] */gi, "@");
            }
        } else {
            if (dots) {
                url = url.replace(/\[\.\]/g, ".");
                url = url.replace(/\[::\]/g, "::"); // for IPv6
                url = url.replace(/\[:\]/g, ":"); // for IPv6
            }
            if (http) url = url.replace(/hxxp/gi, "http");
            if (slashes) url = url.replace(/\[:\/\/\]/g, "://");
            if (dotats) {
                url = url.replace(/\[DOT\]/gi, ".");
                url = url.replace(/\[(?:AT|@)\]/gi, "@");
            }
        }
        return url;
    }

}

export default RefangURLorIP;
