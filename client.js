//non-function code is executed on loading this file
//add a function to be called periodically
intervalSubscribe(updateMyVar);  

var localCounter = 0;
/**
 * this function is only responsible for a minimum scope. Here: for logging a message to the console
 */
function updateMyVar(){
    console.log("Hello there! " + localCounter);
    localCounter++;
    if(localCounter >= 10){
        intervalWithdraw(updateMyVar);
    }
}

/**
 * this function shows a short example on how to use the functions get/set and add/remove
 */
async function example(){
    await set("myVar", 5);

    var list = await get("myList");
    var length = 0;
    if(list != null) length = list.length;
    await add("myList", "list element " + length);

    console.log(await get("myVar"));
    console.log(await get("myList"));
};