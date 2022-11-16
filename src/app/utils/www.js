


/**
 * Takes a dictionary as parameters and returns a query string
 * @param {Object} obj 
 */
export const urlencode = (obj) => {
    return Object.keys(obj).map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }).join("&");
}



export const parseURIParams = (query) => {   
    query = query.split('?')[1];
    let parameters = {};
    for ( const [ name, value ] of new URLSearchParams( query ) ) parameters[name] = value;
    return parameters;
}
