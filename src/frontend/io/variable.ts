import { Domain, addValue, containsValue } from './domain';

type Variable<T> = T | null;

function setValue<T>(variable: Variable<T>, value: T): Variable<T> {
    return variable = value;
}

function unsetValue<T>(variable: Variable<T>): Variable<T> {
    return variable = null;
}

function toJson<T>(variable: Variable<T>, domain: Domain<T>): JSON {
    return JSON.parse(JSON.stringify({ variable: variable, domain: Array.from(domain.values()) }));
}

function formJSON<T>(jsonData: { variable: Variable<T>, domain: Domain<T> }, domain: Domain<T>): Variable<T> {
    const variable = jsonData.variable;
    for (const value of jsonData.domain) {
        addValue(domain, value);
    }
    return variable;
}

export { Variable, setValue, unsetValue, toJson, formJSON }