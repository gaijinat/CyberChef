/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Take bytes by position",
        input: " !123456789012345678901234567890abcdefghi", // "\x20\x2112345..."
        expectedOutput: "abc",
        recipeConfig: [
            {
                op: "Take bytes by position",
                args: [0, "1 (Byte)", "Little Endian (Intel)", 3]
            },
        ],
    },
]);
