//Var
const dbname = "gmci";
const dburl = "http://127.0.0.1:5984/" + dbname + "/";
const loginname = 'admin'
const loginpass = 'admin'



/**
 * Retruns a new request with set des
 * @param {string} methode: HTTP request methode
 * @param {string} dest: the subpage - selects the varible on the server
 * @returns {XMLHttpRequest} a new request
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
 * @param {string} key: key of the value
 * @returns {object} Object on success | null on failure
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
 * @param {string} key: key of the value
 * @param {object} msg: Object with the new value and latest _rev (revision number)
 * @returns {boolean} true on success | false on failure
 */
async function put(key, msg){
    return new Promise(function(promise){
        var request = getXMLHttpRequestPreset("PUT", key);
        request.setRequestHeader("Content-type", "application/json");

        //Response handling
        request.onreadystatechange = function(){
            if(this.readyState == this.DONE){
                if(this.status == 200 || this.status == 201){ promise(true); }  //success
                else{ promise(false); }
                //400 = Bad Request
                //409 = Conflict - _rev is most likly old
            }
        };
        
        request.send(JSON.stringify(msg));
        //console.log("put had msg: "  + JSON.stringify(msg));
    });
}
