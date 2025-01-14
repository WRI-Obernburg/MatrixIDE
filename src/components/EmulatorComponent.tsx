import LEDMatrix from "@/components/LEDMatrix";
import {useState} from "react";
import {destroyGame, drawGame, getLEDArray, initGame, loopGame} from "@/components/Compiler";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function EmulatorComponent() {
    const [leds, setLeds] = useState<number[]>(Array(144).fill(0));
    const [open, setOpen] = useState(false);
    const [intervalID, setIntervalID] = useState(0);
    let ledArray:number[] = [];

    function openChange(open:boolean) {
        setOpen(open);
        if(open) {
            ledArray = getLEDArray();
            emulate();
        }else{
            destroyGame();
            clearInterval(intervalID);
        }
    }



    function emulationStep() {
        const newLeds = [...leds];
        loopGame();
        drawGame();
        for (let i = 0; i < 144; i++) {
            const red = ledArray[i * 4];     // Red is the first byte
            const green = ledArray[i * 4 + 1]; // Green is the second byte
            const blue = ledArray[i * 4 + 2];  // Blue is the third byte

            // Combine into a 3-byte number
            newLeds[i] = (blue << 16) | (green << 8) | red;
        }
        console.log(ledArray);
        setLeds(newLeds);
    }

    function emulate() {
        initGame();
       let newIntervalID = window.setInterval(() => {
           emulationStep();
        }, 100);
       setIntervalID(newIntervalID);
    }

    function restart() {
        destroyGame();
        clearInterval(intervalID);
        ledArray = getLEDArray();
        emulate();
    }

    return <Dialog open={open} onOpenChange={openChange}>
        <DialogTrigger asChild><Button className={"m-8"}>Emulate</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Matrix Emulator</DialogTitle>
                <DialogDescription asChild>
                    <div className={"flex flex-col"}>
                        <LEDMatrix leds={leds}/>
                        <Button onClick={restart}>Restart</Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>


}