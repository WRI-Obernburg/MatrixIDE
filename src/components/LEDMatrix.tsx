"use client";

import {useState} from "react";


export default function LEDMatrix(props: {leds:number[]}) {
    const [hoverLED, setHoverLED] = useState<null | number>(null);



    return <div className="self-center flex flex-col gap-4 items-center">
        <div onMouseLeave={()=>{
                setHoverLED(null);
            }} className="self-center p-2 content-center grid grid-cols-12 gap-1 bg-red-900 w-[15.75rem] h-[15.75rem]">
        {
            props.leds.map((color,i)=><div onMouseEnter={()=>{
                setHoverLED(i);
            }}  key={i} className={"w-4 h-4 bg-black"} style={{backgroundColor: '#' + ('00000' + (color | 0).toString(16)).substr(-6)}}></div>)
    }
    </div>

    { hoverLED?
    "X: " + (hoverLED%12) + " Y: "  + (11-Math.floor(hoverLED/12)):"Hover over LED"
    }


    </div>

}