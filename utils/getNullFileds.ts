import {JSONStructure} from "types/types";


export function getNullFields(json: JSONStructure, prefix = ''): string[] {
    let nullFields: string[] = [];

    for (const key in json) {
        const value = json[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value === null || value === "<null>") {
            nullFields.push(fullKey);
        } else if (typeof value === 'object' && value !== null) {
            nullFields = nullFields.concat(getNullFields(value, fullKey));
        }
    }

    return nullFields;
}
