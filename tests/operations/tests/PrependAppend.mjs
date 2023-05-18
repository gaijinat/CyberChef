/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Prepend / Append: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "Prepend / Append",
                args: [{string: "", option: "Simple string"}, {string: "", option: "Simple string"}, "Input"]
            },
        ],
    },
    {
        name: "Prepend / Append: Simple string",
        input: "TEST",
        expectedOutput: "Start_TEST_End",
        recipeConfig: [
            {
                op: "Prepend / Append",
                args: [{string: "Start_", option: "Simple string"}, {string: "_End", option: "Simple string"}, "Input"]
            },
        ],
    },
    {
        name: "Prepend / Append: Extended",
        input: "TEST",
        expectedOutput: "\tTEST\r\n",
        recipeConfig: [
            {
                op: "Prepend / Append",
                args: [{string: "\\t", option: "Extended (\\n, \\t, \\x...)"}, {string: "\\r\\n", option: "Extended (\\n, \\t, \\x...)"}, "Input"]
            },
        ],
    },
    {
        name: "Prepend / Append: with characters",
        input: "TEST",
        expectedOutput: "#T\t#E\t#S\t#T\t",
        recipeConfig: [
            {
                op: "Prepend / Append",
                args: [{string: "#", option: "Simple string"}, {string: "\\t", option: "Extended (\\n, \\t, \\x...)"}, "Characters"]
            },
        ],
    },
]);
