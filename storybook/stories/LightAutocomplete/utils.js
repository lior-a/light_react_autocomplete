/**
 * useful utility function to throttle the execution of code to avoid overloading and killing the performance 
 * @param {function} fnc execute this function at later time unless a new one comes in
 * @param {number} delay how long to wait between each execution time
 * @returns 
 */
export const debounce = (fnc, delay) => {
    let time;

    return function toBeExecuted(...args) {
        const later = () => {
            clearTimeout(time);
            fnc(...args);
        };

        clearTimeout(time);
        time = setTimeout(later, delay);
    };
};

/**
 * helpful function to search a query(keyword) inside a provided string
 * @param {string} the word apply the search on
 * @param {string} query which keyword are we looking for
 * @returns {boolean}
 */
export const matchQuery = (str, query = '') => {
    const reg = new RegExp(query, 'gi');
    return reg.test(str);
}

export const autocompleteDefaultStyle = {
    maxHeight: 400,
    width: 300
}
export const listDefaultStyle = {
    maxHeight: 400,
    width: 330
}