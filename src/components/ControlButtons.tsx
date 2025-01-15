import {ReactNode, useEffect, useState} from "react";
import {sendEvent} from "@/components/Compiler";

export default function ControlButtons(props: {click: (id:number) => void, controls:number}, ) {

    const [isUpEnabled, setIsUpEnabled] = useState(true);
    const [isLeftEnabled, setIsLeftEnabled] = useState(true);
    const [isMiddleEnabled, setIsMiddleEnabled] = useState(true);
    const [isRightEnabled, setIsRightEnabled] = useState(true);
    const [isDownEnabled, setIsDownEnabled] = useState(true);
    const [isAEnabled, setIsAEnabled] = useState(true);
    const [isBEnabled, setIsBEnabled] = useState(true);
    const [isCEnabled, setIsCEnabled] = useState(true);

    useEffect(()=>{
        document.addEventListener('keydown', checkKey);


        return ()=>{
            document.removeEventListener('keydown', checkKey);
        }

    },[]);

    useEffect(() => {

        setIsUpEnabled((props.controls    & 0b00000001)!=0);
        setIsLeftEnabled((props.controls   & 0b00000010)!=0);
        setIsMiddleEnabled((props.controls & 0b00000100)!=0);
        setIsRightEnabled((props.controls  & 0b00001000)!=0);
        setIsDownEnabled((props.controls   & 0b00010000)!=0);
        setIsAEnabled((props.controls      & 0b00100000)!=0);
        setIsBEnabled((props.controls      & 0b01000000)!=0);
        setIsCEnabled((props.controls      & 0b10000000)!=0);
    }, [props.controls]);


    function checkKey(e:any) {

            if (e.keyCode == '38') {
                // up arrow
                sendEvent(0)
                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode == '40') {
                // down arrow
                sendEvent(1)

                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode == '37') {
                // left arrow
                sendEvent(2)

                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode == '39') {
                // right arrow
                sendEvent(3)

                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode == '32') {
                sendEvent(4)
                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode == '65') {
                sendEvent(5)
                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode == '65') {
                sendEvent(5)
                e.preventDefault();
                e.stopPropagation();
            }else if (e.keyCode == '66') {
                sendEvent(6)
                e.preventDefault();
                e.stopPropagation();
            }else if (e.keyCode == '67') {
                sendEvent(7)
                e.preventDefault();
                e.stopPropagation();
            }


    }


    return <div className={"flex flex-col gap-2 justify-center align-middle items-center m-8"}>
        {isUpEnabled ? <CB id={0} click={props.click}>UP</CB> :null}
        <div className={"flex flex-row gap-2"}>
            {isLeftEnabled ? <CB id={2} click={props.click}>LEFT</CB> :null}
            {isMiddleEnabled ? <CB id={4} click={props.click}>MIDDLE</CB> :null}
            {isRightEnabled ? <CB id={3} click={props.click}>RIGHT</CB> :null}

        </div>
        {isDownEnabled ? <CB id={1} click={props.click}>DOWN</CB> :null}

        <div className={"flex flex-row gap-2 mt-2"}>
            {isAEnabled ? <CB id={5} click={props.click}>A</CB> :null}
            {isBEnabled ? <CB id={6} click={props.click}>B</CB> :null}
            {isCEnabled ? <CB id={7} click={props.click}>C</CB> :null}
        </div>
    </div>
}

function CB(props: {id:number, click: (id:number) => void, children: ReactNode},) {
    return <div onClick={()=>{
        props.click(props.id);
    }} className={"h-14 w-14 bg-purple-500 text-white flex flex-col justify-center items-center align-middle select-none cursor-pointer "}>
        {props.children}
    </div>
}