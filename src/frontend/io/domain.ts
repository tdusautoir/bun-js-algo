type Domain<T> = Array<T>;
type NativeJSONTypes = number | string | boolean | null
type JSONArray = JSON[]
type JSONObject = { [key: string]: JSON }
type JSON = NativeJSONTypes | JSONArray | JSONObject

function removeValue<T>(domain: Domain<T>, value: T): Domain<T> {
    const index = domain.indexOf(value);
    if (index !== -1) {
        domain.splice(index, 1);
    }
    return domain;
}

function addValue<T>(domain: Domain<T>, value: T): Domain<T> {
    if (domain.indexOf(value) === -1) {
        domain.push(value);
    }
    return domain;
}

function containsValue<T>(domain: Domain<T>, value: T): boolean {
    return domain.indexOf(value) !== -1;
}

function toJson<T>(domain: Domain<T>): JSON {
    return domain.map((item) => convertToJSON(item));
}

function Copy<T>(domain: Domain<T>): Domain<T> {
    return domain.slice();
}

function convertToJSON(value: any): JSON {
    if (Array.isArray(value)) {
        return value.map((item) => convertToJSON(item));
    } else if (typeof value === "object" && value !== null) {
        const jsonObject: JSONObject = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                jsonObject[key] = convertToJSON(value[key]);
            }
        }
        return jsonObject;
    } else {
        return value as NativeJSONTypes;
    }
}

function fromJSON<T>(jsonArray: JSONArray): Domain<T> {
    return jsonArray.map((json) => convertFromJSON<T>(json));
}

function convertFromJSON<T>(json: JSON): T {
    if (Array.isArray(json)) {
        return json.map((item) => convertFromJSON<T>(item)) as T;
    } else if (typeof json === "object" && json !== null) {
        const jsonObject: { [key: string]: T } = {};
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                jsonObject[key] = convertFromJSON<T>(json[key]);
            }
        }
        return jsonObject as T;
    } else {
        return json as T;
    }
}


export { Domain, removeValue, addValue, toJson, containsValue, Copy, fromJSON, convertFromJSON, convertToJSON }




