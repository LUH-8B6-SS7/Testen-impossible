//Var
const moodTimeout = 10000;  //ms
sendRequestRetries = 10;  //max attempts to send a message
const role = "§VALUE§role§";


/**
 * sends a request to the Database
 * @param {string} requestType 
 * @param {string} key 
 * @param {string} value 
 * @returns {string | null} data as string | null on fail
 */
function send(requestType, key, value){
    return new Promise(function(promise){
        var request = new XMLHttpRequest();
        request.open(requestType, "api/" + key, true);
        
        request.onreadystatechange = function(){
            if(this.readyState == this.DONE){
                //console.log("get " + key + " is done. status " + this.status + ". response: " + this.response);
                if(this.status >= 200 && this.status < 300){ promise(this.responseText); }
                else{ promise(null); }
            }
        };

        request.send(value);
    });
}

/**
 * sets a value
 * @param {string} key: key of the value
 * @param {string} value: the new value
 */
async function dbSet(key, value) {
    for(i = 0; i < sendRequestRetries; i++){
        if(await send("PUT", key, value) != null) break;
    }
}

/**
 * loads a value
 * @param {string} key: key of the value
 * @returns {string | null} Value on success | null on failure
 */
async function dbGet(key){
    return await send("GET", key, "");
}

/**
 * adds a value to a list safely
 * @param {string} key: key of the value
 * @param {string} value: the new value
 */
async function dbAdd(key, value){
    for(i = 0; i < sendRequestRetries; i++){
        if(await send("POST", key, value) != null) break;
    }
}

/**
 * removes a value from a list safely
 * @param {string} key: key of the value
 * @param {string} value: the object to remove
 */
async function dbRemove(key, value){
    for(i = 0; i < sendRequestRetries; i++){
        if(await send("DELETE", key, value) != null) break;
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
/*
function removeFromList(list, item){
    var index = -1;
    for(i = 0; i < list.length; i++){
        if(JSON.stringify(list[i]) === JSON.stringify(item)){ index = i; break; }
    }
    if(index == -1) return null;

    return list.splice(index, 1);
}
*/

/**
 * the current time in ms from 1.1.1970
 * @returns {long} Timestamp
 */
function getTimestamp(){
    return (new Date).getTime();
}