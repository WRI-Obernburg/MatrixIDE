import LEDMatrix from "@/components/LEDMatrix";
import {useEffect, useState} from "react";
import {
    destroyGame,
    drawGame,
    get_controls,
    get_tps,
    getLEDArray,
    initGame,
    loopGame,
    sendEvent
} from "@/components/Compiler";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ControlButtons from "@/components/ControlButtons";

export default function EmulatorComponent() {
    const [leds, setLeds] = useState<number[]>(Array(144).fill(0));
    const [open, setOpen] = useState(false);
    const [timeoutID, setTimeoutID] = useState(0);
    const [intervalID, setIntervalID] = useState(0);
    const [controls, setControls] = useState(255);
    let ledArray:number[] = [];



    function openChange(open:boolean) {
        setOpen(open);
        if(open) {
            ledArray = getLEDArray();
            emulate();
        }else{
            destroyGame();
            clearTimeout(timeoutID);
            clearInterval(intervalID);
        }
    }



    function emulationStep() {
        if(!loopGame()) {
            console.log("interrupt");
            return;
        }

        setControls(get_controls());

        let newTimeoutID = window.setTimeout(emulationStep, 1000/get_tps());
        setTimeoutID(newTimeoutID);
    }

    function emulate() {
        if(!initGame()) {
            return;
        }
       let newTimeoutID = window.setTimeout(() => {
           emulationStep();
        }, 30);
       setTimeoutID(newTimeoutID);

       let newIntervalID = window.setInterval(()=>{
            const newLeds = [...leds];
           if(!drawGame()) {
               return;
           }
           for (let i = 0; i < 144; i++) {
               const red = ledArray[i * 4];     // Red is the first byte
               const green = ledArray[i * 4 + 1]; // Green is the second byte
               const blue = ledArray[i * 4 + 2];  // Blue is the third byte

               // Combine into a 3-byte number
               newLeds[i] = (blue << 16) | (green << 8) | red;
           }
           setLeds(newLeds);
       }, 33);

       setIntervalID(newIntervalID);
    }

    function restart() {
        destroyGame();
        clearTimeout(timeoutID);
        clearInterval(intervalID);
        ledArray = getLEDArray();
        emulate();
    }

    return <Dialog open={open} onOpenChange={openChange}>
        <DialogTrigger asChild><Button variant={"destructive"}  className={"w-[40%] bg-green-500 hover:bg-green-600"}>Emulate</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Matrix Emulator</DialogTitle>
                <DialogDescription asChild>
                    <div className={"flex flex-col "}>
                        <LEDMatrix leds={leds}/>

                        <ControlButtons key={controls} controls={controls} click={(id:number)=>{
                            sendEvent(id);
                        }}></ControlButtons>
                        <Button onClick={restart}>Restart</Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>


}