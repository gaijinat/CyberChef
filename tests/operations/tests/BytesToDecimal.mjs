/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Bytes to Decimal: DWord LE",
        input: "\x01\x02\x03\x04",
        expectedOutput: "67305985",
        recipeConfig: [
            {
                op: "Bytes to Decimal",
                args: [0, "4 (DWord)", "Little Endian (Intel)"]
            },
        ],
    },
    {
        name: "Bytes to Decimal: Word BE",
        input: "\x01\x02\x03\x04",
        expectedOutput: "772",
        recipeConfig: [
            {
                op: "Bytes to Decimal",
                args: [2, "2 (Word)", "Big Endian (Motorola)"]
            },
        ],
    },
]);
