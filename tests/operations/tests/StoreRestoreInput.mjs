/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Store / Restore Input: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "Store / Restore Input",
                args: ["Clear", ""]
            },
        ],
    },
    {
        name: "Store / Restore Input: Store and Restore",
        input: "TEST",
        expectedOutput: "TEST",
        recipeConfig: [
            {
                op: "Store / Restore Input",
                args: ["Store", "test"]
            },
            {
                op: "To Hex",
                args: ["Space", "0"] // Output is "54 45 53 54"
            },
            {
                op: "Store / Restore Input",
                args: ["Restore", "test"]
            },
        ],
    },
]);
