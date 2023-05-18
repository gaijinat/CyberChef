/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Store / Restore: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "Store / Restore",
                args: ["Clear", ""]
            },
        ],
    },
    {
        name: "Store / Restore: Store and Restore",
        input: "TEST",
        expectedOutput: "TEST",
        recipeConfig: [
            {
                op: "Store / Restore",
                args: ["Store", "test"]
            },
            {
                op: "To Hex",
                args: ["Space", "0"] // Output is "54 45 53 54"
            },
            {
                op: "Store / Restore",
                args: ["Restore", "test"]
            },
        ],
    },
]);
