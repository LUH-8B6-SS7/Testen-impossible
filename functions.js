/**
 * sets a value
 * @param {string} key: key of the value
 * @param {object} value: the new value
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
 * @param {string} key: key of the value
 * @returns {object | null} Value on success | null on failure
 */
async function get(key){
    var response = await getRaw(key);
    if(response == null) return null;
    else return response[key];
}

/**
 * adds a value to a list safely
 * @param {string} key: key of the value
 * @param {object} value: the new value
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
 * @param {string} key: key of the value
 * @param {object} value: the object to remove
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

var interval = setInterval(update, 1000);
var intervalFunctionList = [];

/**
 * subscribes a function to be called repeatedly
 * @param {function} f: a function (void -> void)
 */
function intervalSubscribe(f){
    intervalFunctionList.push(f);
}

/**
 * unsubscribes a function from being called repeatedly
 * @param {function} f 
 */
function intervalWithdraw(f){
    var index = intervalFunctionList.indexOf(f);
    if(index == -1) return;  //value not in list
    intervalFunctionList.splice(index, 1);
}

/**
 * is called on interval, calls the subscribed functions
 */
function update(){
    for(i = 0; i < intervalFunctionList.length; i++){
        intervalFunctionList[i]();
    }
}