"use client";

import { useState } from "react";

export default function LEDMatrix() {
    const [hoverLED, setHoverLED] = useState<null | number>(null);
    const data = [...Array(144)]
    return <div className="self-center flex flex-col gap-4 items-center">
        <div className="self-center font-bold">Matrix Emulator</div>
        <div onMouseLeave={()=>{
                setHoverLED(null);
            }} className="self-center p-2 content-center grid grid-cols-12 gap-1 bg-red-900 w-[15.75rem] h-[15.75rem]">
        {
            data.map((_,i)=><div onMouseEnter={()=>{
                setHoverLED(i);
            }}  key={i} className="w-4 h-4 hover:bg-green-500 bg-white"></div>)
    }
    </div>

    { hoverLED?
    "X: " + (hoverLED%12) + " Y: "  + (11-Math.floor(hoverLED/12)):"Hover over LED"
    }
    </div>

}