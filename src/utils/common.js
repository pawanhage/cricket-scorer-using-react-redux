export const cloneDeep = (source, destination = {}) => {
    if (Array.isArray(source)) {
        destination = [];
        source.forEach(element => {
            destination.push(cloneDeep(element));
        });
    } else {
        for (let key in source) {
            if (Array.isArray(source[key])) {
                source[key].forEach(element => {
                    destination[key].push(element);
                });
            } else if (typeof source[key] === 'object') {
                destination[key] = {};
                cloneDeep(source[key], destination[key]);
            } else {
                destination[key] = source[key];
            }
        }
    }
    return destination;
}

export const isN = (number) => {
    return !isNaN(number);
}
