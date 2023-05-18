/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Trim: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "Trim",
                args: ["Both"]
            },
        ],
    },
    {
        name: "Trim: Start",
        input: "\n\t TEST \t\n",
        expectedOutput: "TEST \t\n",
        recipeConfig: [
            {
                op: "Trim",
                args: ["Start"]
            },
        ],
    },
    {
        name: "Trim: End",
        input: "\n\t TEST \t\n",
        expectedOutput: "\n\t TEST",
        recipeConfig: [
            {
                op: "Trim",
                args: ["End"]
            },
        ],
    },
    {
        name: "Trim: Both",
        input: "\n\t TEST \t\n",
        expectedOutput: "TEST",
        recipeConfig: [
            {
                op: "Trim",
                args: ["Both"]
            },
        ],
    },
]);
