//Var
const moodTimeout = 10000;  //ms

/**
 * sets a value
 * @param {string} key: key of the value
 * @param {object} value: the new value
 */
async function dbSet(key, value) {
    while(true){
        var msg = await getRaw(key);
        if(msg == null){
            msg = {};
        }

        msg[key] = value;

        if( await put(key, msg) ) break;
        console.log("Put failed. Trying again!");
    }
}

/**
 * loads a value
 * @param {string} key: key of the value
 * @returns {object | null} Value on success | null on failure
 */
async function dbGet(key){
    var response = await getRaw(key);
    if(response == null) return null;
    else return response[key];
}

/**
 * adds a value to a list safely
 * @param {string} key: key of the value
 * @param {object} value: the new value
 */
async function dbAdd(key, value){
    while(true){
        var msg = await getRaw(key);
        if(msg == null){
            msg = {};
            msg[key] = [];
        }

        msg[key].push(value);

        if( await put(key, msg) ) break;
        console.log("Put failed. Trying again!");
    }
}

/**
 * removes a value from a list safely
 * @param {string} key: key of the value
 * @param {object} value: the object to remove
 */
async function dbRemove(key, value){
    while(true){
        var msg = await getRaw(key);
        if(msg == null) break;

        /*
        //find index not good
        var index = -1;
        for(i = 0; i < msg[key].length; i++){
            if(JSON.stringify(msg[key][i]) === JSON.stringify(value)){ index = i; break; }
        }
        if(index == -1) break;

        msg[key].splice(index, 1);
        */
        
        if(removeFromList(msg[key], value) == null) break;

        if( await put(key, msg) ) break;
        console.log("Put failed. Trying again!");
    }
}



//--------- update on interval ---------
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
    /*
    var index = intervalFunctionList.indexOf(f);
    if(index == -1) return;
    intervalFunctionList.splice(index, 1);
    */
    removeFromList(intervalFunctionList, f);
}

/**
 * is called on interval, calls the subscribed functions
 */
function update(){
    for(i = 0; i < intervalFunctionList.length; i++){
        intervalFunctionList[i]();
    }
}



//--------- other util ---------
/**
 * removes the given item from the list, if it is in it. The list itself will be modified.
 * @param {any[]} list 
 * @param {any} item 
 * @returns {any} the removed item, null on failure
 */
function removeFromList(list, item){
    var index = -1;
    for(i = 0; i < list.length; i++){
        if(JSON.stringify(list[i]) === JSON.stringify(item)){ index = i; break; }
    }
    if(index == -1) return null;

    return list.splice(index, 1);
}

/**
 * the current time in ms from 1.1.1970
 * @returns {long} Timestamp
 */
function getTimestamp(){
    return (new Date).getTime();
}