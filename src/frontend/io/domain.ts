type Domain<T> = Array<T>;

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
    return JSON.parse(JSON.stringify(domain));
}

function Copy<T>(domain: Domain<T>): Domain<T> {
    return domain.slice();
}

export { Domain, removeValue, addValue, toJson, containsValue, Copy }