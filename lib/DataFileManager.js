const fs = require("node:fs");
const FileManager = require("./FileManager");

class DataFileManager extends FileManager {
    #data = {};
    #dataReady = false;
    #filePath;

    /**
     * File manager specifically for JSON data files.
     * 
     * @param { fs.PathLike } path - Path to file.
     * @param { Object } defContent - Default content if file does not exist. 
     */
    constructor(path, defContent) {
        super(path, JSON.stringify(defContent ?? {}));
        this.#filePath = path;

        this.read(defContent).then((data) => {
            this.#data = data;
            this.#dataReady = true;
        });
    }

    /**
     * Reads data from file.
     * 
     * @param { any } def - Default value to return if reading / parsing fails.
     * @returns { Promise<Object> }
     */
    async read(def) {
        try {
            const txt = await fs.promises.readFile(this.#filePath, "utf-8");
            return JSON.parse(txt);
        } catch {
            return def ?? {};
        }
    }

    /**
     * Gets data from cache.
     */
    get() {
        return JSON.parse(JSON.stringify(this.#data));
    }

    /**
     * Saves cached data to file.
     */
    async save() {
        return this.write(JSON.stringify(this.#data));
    }

    /**
     * Sets a property.
     * 
     * @param { String } prop - Property name
     * @param { any } value - Value to set.
     * @param { Boolean? } shallowOnly - Only check surface / shallow level for property name - i.e. any fullstops in the name will be taken literally.
     */
    setProperty(prop, value, shallowOnly = false) {
        let atLevel = this.#data;
        const props = prop.split(".");
        
        // No need to go object deep, just set shallow value.
        if (props.length === 1 || shallowOnly) {
            this.#data[prop] = value;
            return this.save();
        }

        for (let i = 0; i < props.length; i++) {
            const lvl = props[i];

            // If this is the last 'level', set the value to the value given.
            if (i == props.length-1) {
                atLevel[lvl] = value;
            // Otherwise, go down a level deeper by setting as object.
            } else {
                atLevel[lvl] = atLevel[lvl] || {};
                atLevel = atLevel[lvl];
            }
        }

        return this.save();
    }

    /**
     * Gets the value of a set property.
     * 
     * @param { String } prop - Property name
     * @param { Boolean? } shallowOnly - Only check surface / shallow level for property name - i.e. any fullstops in the name will be taken literally.
     * @returns { any }
     */
    getProperty(prop, shallowOnly = false) {
        let atLevel = this.#data;
        const props = prop.split(".");

        // No need to go object deep, just return the value at the property.
        if (props.length === 1 || shallowOnly) {
            return this.#data[prop];
        }

        for (let i = 0; i < props.length; i++) {
            const lvl = props[i];

            // If this is the last 'level', return the value.
            if (i == props.length-1) {
                return atLevel[lvl];
            } else {
                // If there is a value set here, return it instead of going deeper.
                if (!!atLevel[lvl] && typeof atLevel[lvl] !== "object") {
                    return atLevel[lvl];
                }

                atLevel[lvl] = atLevel[lvl] || {};
                atLevel = atLevel[lvl];
            }
        }
    }
}

module.exports = DataFileManager;