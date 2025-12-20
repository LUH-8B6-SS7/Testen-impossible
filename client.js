async function example(){
    await set("myVar", 5);

    var list = await get("myList");
    var length = 0;
    if(list != null) length = list.length;
    await add("myList", "list element " + length);

    console.log(await get("myVar"));
    console.log(await get("myList"));
};