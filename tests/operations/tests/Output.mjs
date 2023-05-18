/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Output: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "Output",
                args: [{string: "", option: "Extended (\\n, \\t, \\x...)"}]
            },
        ],
    },
    {
        name: "Output: Simple string",
        input: "",
        expectedOutput: "TEST",
        recipeConfig: [
            {
                op: "Output",
                args: [{string: "TEST", option: "Simple string"}]
            },
        ],
    },
    {
        name: "Output: Extended",
        input: "",
        expectedOutput: "\tTEST\r\n",
        recipeConfig: [
            {
                op: "Output",
                args: [{string: "\\tTEST\\r\\n", option: "Extended (\\n, \\t, \\x...)"}]
            },
        ],
    },
    {
        name: "Output: Extended with Register",
        input: "123",
        expectedOutput: "TEST G 123\n",
        recipeConfig: [
            {
                op: "Register",
                args: ["([\\s\\S]*)", true, false, false]
            },
            {
                op: "Output",
                args: [{string: "TEST \\x47 $R0\\n", option: "Extended (\\n, \\t, \\x...)"}]
            },
        ],
    },
]);
