/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Pad: no input 3 times with X",
        input: "",
        expectedOutput: "XXX",
        recipeConfig: [
            {
                op: "Pad",
                args: ["Both", 3, {string: "X", option: "Simple string"}, "Input"]
            },
        ],
    },
    {
        name: "Pad: Start",
        input: "TEST",
        expectedOutput: "====TEST",
        recipeConfig: [
            {
                op: "Pad",
                args: ["Start", 8, {string: "=", option: "Simple string"}, "Input"]
            },
        ],
    },
    {
        name: "Pad: End",
        input: "TEST",
        expectedOutput: "TEST====",
        recipeConfig: [
            {
                op: "Pad",
                args: ["End", 8, {string: "=", option: "Simple string"}, "Input"]
            },
        ],
    },
    {
        name: "Pad: Both",
        input: "TEST",
        expectedOutput: "==TEST==",
        recipeConfig: [
            {
                op: "Pad",
                args: ["Both", 8, {string: "=", option: "Simple string"}, "Input"]
            },
        ],
    },
    {
        name: "Pad: Both extended",
        input: "TEST",
        expectedOutput: "\t\n\tTEST\t\n\t",
        recipeConfig: [
            {
                op: "Pad",
                args: ["Both", 10, {string: "\\t\\n", option: "Extended (\\n, \\t, \\x...)"}, "Input"]
            },
        ],
    },
]);
