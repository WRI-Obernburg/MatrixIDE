export function compile(str: string): string {
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

    return output;
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
    const ptr_from_wasm  = Module.ccall(
        "sendEvent", // name of C function
        null, // return type
        ["number"], // argument types
        [id], // arguments
    );
}

export function initGame() {
    // @ts-ignore
    const ptr_from_wasm  = Module.ccall(
        "init", // name of C function
        null, // return type
        null, // argument types
        null, // arguments
    );
}

export function drawGame() {
    // @ts-ignore
    const ptr_from_wasm  = Module.ccall(
        "draw", // name of C function
        null, // return type
        null, // argument types
        null, // arguments
    );
}

export function loopGame() {
    // @ts-ignore
    const ptr_from_wasm  = Module.ccall(
        "game_loop", // name of C function
        null, // return type
        null, // argument types
        null, // arguments
    );
}

export function destroyGame() {
    // @ts-ignore
    const ptr_from_wasm  = Module.ccall(
        "game_loop", // name of C function
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