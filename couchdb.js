//Var
const dbname = "gmci";
const dburl = "http://127.0.0.1:5984/" + dbname + "/";
const loginname = 'admin'
const loginpass = 'admin'



/**
 * Retruns a new request with set des
 * @param methode: string: HTTP request methode
 * @param dest: string: the subpage - only on specific JSON-File
 * @returns XMLHttpRequest
 */
function getXMLHttpRequestPreset(methode, dest){
    var request = new XMLHttpRequest();
    if(dest == null) dest = "";
    request.open(methode, dburl + dest, true);
    request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    return request;
}

/**
 * loads the couchdb object
 * @param key: string: key of the value
 * @returns Object on success | null on failure
 */
function getRaw(key){
    return new Promise(function(promise){
        var request = getXMLHttpRequestPreset("GET", key);

        request.onreadystatechange = function(){
            if(this.readyState == this.DONE){
                //console.log("get " + key + " is done. status " + this.status + ". response: " + this.response);
                if(this.status == 200){  promise(JSON.parse(this.responseText)); }
                else{ promise(null); }
            }
        };

        request.send();
        //console.log("get was send retrieving " + key);
        //console.log(request);
    });
}

/**
 * sets a value
 * @param key: string: key of the value
 * @param msg: Object with the new value and latest _rev (revision number)
 * @returns true on success | false on failure
 */
async function put(key, msg){
    return new Promise(function(promise){
        var request = getXMLHttpRequestPreset("PUT", key);
        request.setRequestHeader("Content-type", "application/json");

        //Response handling
        request.onreadystatechange = function(){
            if(this.readyState == this.DONE){
                if(this.status == 400){ promise(false); }  //400 = Bad Request - _rev is most likly old
                else{ promise(true); }  
            }
        };
        
        request.send(JSON.stringify(msg));
        //console.log("put had msg: "  + JSON.stringify(msg));
    });
}
