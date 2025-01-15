export function compile(str: string) {
    // @ts-ignore
    const ptr_from_wasm  = Module.ccall(
        "compile", // name of C function
        "number", // return type
        ['string'], // argument types
        [str], // arguments
    );


    // @ts-ignore
    const size  = Module.ccall(
        "getSize", // name of C function
        "number", // return type
        null, // argument types
        null, // arguments
    );

    console.log(size);

    if(size == 0) {
        throw new Error("Unable to compile");
    }

    // @ts-ignore
    let js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + size);

    console.log(js_array);

    let output = "const static unsigned char prg[] = {";
    //convert to hex with leading zero and uppercase and without last ,
    for (let i = 0; i < js_array.length; i++) {
        output += "0x" + js_array[i].toString(16).padStart(2, '0').toUpperCase() + ", ";
    }

    output = output.slice(0, -2);

    output += "};";
    const blob = new Blob([js_array]);

    return {
        "string": output,
        "blob": blob

    };
}

export function getLEDArray(): number[] {
    // @ts-ignore
    const ptr_from_wasm  = Module.ccall(
        "get_leds", // name of C function
        "number", // return type
        null, // argument types
        null, // arguments
    );

    // @ts-ignore
    let js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + (144*4));
    return js_array;


}

export function sendEvent(id: number) {
    // @ts-ignore
   Module.ccall(
        "sendEvent", // name of C function
        null, // return type
        ["number"], // argument types
        [id], // arguments
    );
}

export function initGame():boolean {
   try {
        // @ts-ignore
       Module.ccall(
           "init", // name of C function
           null, // return type
           null, // argument types
           null, // arguments
       );
   }catch (e) {
       // @ts-ignore
       alert("Eine Funktion konnte in INIT nicht gefunden werden!")
       return false;
   }

   return true;
}

export function drawGame() {
    // @ts-ignore
    try {
        // @ts-ignore
       Module.ccall(
            "draw", // name of C function
            null, // return type
            null, // argument types
            null, // arguments
        );
    }catch (e) {
        // @ts-ignore
        alert("Eine Funktion konnte in DRAW nicht gefunden werden!")
        return false;
    }

    return true;
}

export function loopGame() {
    // @ts-ignore
    try {
        // @ts-ignore
        Module.ccall(
            "game_loop", // name of C function
            null, // return type
            null, // argument types
            null, // arguments
        );
    }catch (e) {
        // @ts-ignore
        alert("Eine Funktion konnte in GAME_LOOP nicht gefunden werden!")
        return false;
    }

    return true;
}

export function destroyGame() {
    // @ts-ignore
    Module.ccall(
        "destroy", // name of C function
        null, // return type
        null, // argument types
        null, // arguments
    );
}

export function get_tps(): number {
    //@ts-ignore
    return Module.ccall(
        "get_tps",
        "number",
        null,
        null,
    )
}

export function get_controls(): number {
    //@ts-ignore
    return Module.ccall(
        "get_controls",
        "number",
        null,
        null,
    )
}

