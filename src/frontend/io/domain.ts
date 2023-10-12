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


export { Domain, removeValue, addValue }