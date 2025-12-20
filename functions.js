/**
 * sets a value
 * @param key: string: key of the value
 * @param value: any: the new value
 */
async function set(key, value) {
    while(true){
        var msg = await getRaw(key);
        if(msg == null){
            msg = {};
        }

        msg[key] = value;

        if( await put(key, msg) ) break;
    }
}

/**
 * loads a value
 * @param key: string: key of the value
 * @returns Value on success | null on failure
 */
async function get(key){
    var response = await getRaw(key);
    if(response == null) return null;
    else return response[key];
}

/**
 * adds a value to a list safely
 * @param key: string: key of the value
 * @param value: any: the new value
 */
async function add(key, value){
    while(true){
        var msg = await getRaw(key);
        if(msg == null){
            msg = {};
            msg[key] = [];
        }

        msg[key].push(value);

        if( await put(key, msg) ) break;
    }
}

/**
 * removes a value from a list safely
 * @param key: string: key of the value
 * @param value: the object to remove
 */
async function remove(key, value){
    while(true){
        var msg = await getRaw(key);
        if(msg == null) break;

        var index = msg[key].indexOf(value);
        if(index == -1) break;  //value not in list
        msg[key].splice(index, 1);

        if( await put(key, msg) ) break;
    }
}
