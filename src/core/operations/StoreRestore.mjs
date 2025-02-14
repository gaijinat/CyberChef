/**
 * @author gaijinat [web@gaijin.at]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Dish from "../Dish.mjs";

/**
 * StoreRestore operation
 */
class StoreRestore extends Operation {

    static variables = {};

    /**
     * StoreRestore constructor
     */
    constructor() {
        super();

        this.name = "Store / Restore";
        this.flowControl = true;
        this.module = "Default";
        this.description = "Stores the input value and restores it later as output.<br><br><code>Store</code> stores the input under the given name.<br><code>Restore</code> restores the input with the given name as output.<br><code>Clear</code> removes the stored input with the given name. Without a name, all stored inputs will be removed.<br><br>You should deactivate 'Auto Bake' for this operation.";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Mode",
                type: "option",
                value: ["Clear", "Store", "Restore"]
            },
            {
                name: "Name",
                type: "string",
                value: ""
            },
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    async run(state) {
        const ings = state.opList[state.progress].ingValues;
        const [mode, varName] = ings;
        const input = await state.dish.get(Dish.STRING);

        let firstOpIndex = -1;

        // Find the first index that matches this operation and clear the variables
        for (let i = 0; i < state.opList.length; i++) {
            if (state.opList[i].name === this.name) {
                firstOpIndex = i;
                break;
            }
        }
        if (state.progress === firstOpIndex) {
            StoreRestore.variables = {};
        }

        if (mode === "Clear") {

            if (varName === "") {
                StoreRestore.variables = {};
            } else {
                if (StoreRestore.variables[varName] !== undefined) {
                    delete StoreRestore.variables[varName];
                }
            }

        } else if (varName && (mode === "Store")) {

            StoreRestore.variables[varName] = input;

        } else if (varName && (mode === "Restore")) {

            if (StoreRestore.variables[varName] !== undefined) {
                state.dish.set(StoreRestore.variables[varName], Dish.STRING);
                return state;
            }

        }

        // console.log(StoreRestore.variables);

        return state;
    }

}

export default StoreRestore;
