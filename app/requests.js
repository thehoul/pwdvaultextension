/**
 * Send a request to the given URL with the given method and data
 * @param {string} method (GET, POST, PUT, DELETE) 
 * @param {string} url 
 * @param {*} data JSON name value mappings for the request
 * @returns a promise of a fetch request
 */
async function requestBody(method, url, data){
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });
}

/**
 * Send a request to the given URL with the given method without a body
 * @param {string} method 
 * @param {string} url 
 * @returns 
 */
async function request(method, url){
    return fetch(url, {
        method: method,
        credentials: 'include'
    });
}