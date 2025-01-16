import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {LoaderCircle, RefreshCw} from "lucide-react";

export default function UpdateProcess() {


    const [isInUpdateProcess, setIsInUpdateProcess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isBinaryDownloading, setIsBinaryDownloading] = useState(false);
    const [updateFile, setUpdateFile] = useState<Blob | null>(null);
    const [isMatrixConnected, setIsMatrixConnected] = useState<boolean>(false);
    const [isReloading, setIsReloading] = useState<boolean>(false);
    const [bootCode, setBootCode] = useState<string>("");
    const [isBinaryUploading, setIsBinaryUploading] = useState<boolean>(false);
    const [isUpdateDone, setIsUpdateDone] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    function checkMatrixConnection() {
        setIsReloading(true);
        fetch("http://192.168.0.1/api", {
            // @ts-ignore
            targetAddressSpace: "private",
        }).then(e => e.json()).then((data) => {
            setBootCode(buildEmojiCode(data.bootCode));
            setIsMatrixConnected(true);
            window.onbeforeunload = ()=>{
                return "Bist du sicher, dass du die Seite verlassen willst?";
            }
            setIsReloading(false);
        }).catch((error) => {
            setIsMatrixConnected(false);
            setIsReloading(false);
            window.onbeforeunload = null;
            console.error(error);
        });
    }

    function buildEmojiCode(bootCode: number): string {
        const emojis = ["🟥", "🟩", "🟦", "🟨"]; // Index corresponds to 0x00, 0x01, 0x02, 0x03
        const getEmoji = (code: number): string => emojis[code & 0x03] || "";

        const emoji1 = getEmoji(bootCode);
        const emoji2 = getEmoji(bootCode >> 2);
        const emoji3 = getEmoji(bootCode >> 4);
        const emoji4 = getEmoji(bootCode >> 6);

        return `Matrix ${emoji1}${emoji2}${emoji3}${emoji4}`;
    }

    function updateDialog(newState: boolean) {
        if (!isInUpdateProcess) {
            setIsOpen(newState);
        }
    }

    function uploadBinary() {
        setIsInUpdateProcess(true);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/octet-stream");
        setIsBinaryUploading(true);

        const requestOptions = {
            method: "POST", headers: myHeaders, body: updateFile,
            // @ts-ignore
            targetAddressSpace: "private"

        };

        fetch("http://192.168.0.1/ota/upload", requestOptions)

            .then((response) => response.text())
            .then((result) => {
                setIsBinaryUploading(false);
                setIsUpdateDone(true)
                setIsUpdateDone(true);
            }).catch((error) => {
            console.error(error);
            setIsBinaryUploading(false);
            setIsInUpdateProcess(false);
            setError("An error occoured! Try again!")

        });

    }

    function downloadBinary() {
        setIsBinaryDownloading(true);
        setTimeout(() => {
            const updateFile = fetch("/firmware.bin").then(e => e.blob()).then((blob) => {
                setUpdateFile(blob);
                setIsBinaryDownloading(false);
            }).catch((error) => {
                console.error(error);
                setIsBinaryDownloading(false);
            });
        }, 1000);
    }

    return <Dialog open={isOpen} onOpenChange={updateDialog}>
        <DialogTrigger asChild><Button>Update</Button></DialogTrigger>
        <DialogContent className={isInUpdateProcess ? "[&>button]:hidden" : ""}>
            <DialogHeader>
                <DialogTitle>Update LED Matrix</DialogTitle>
                <DialogDescription asChild className={"flex flex-col"}>
                    <div className={"flex flex-col gap-4"}>
                        {
                          !isUpdateDone && !updateFile && downloadBinaryUI()
                        }

                        {
                            !isUpdateDone &&  !isMatrixConnected && updateFile && establishMatrixConnection()
                        }

                        {
                            !isUpdateDone &&  isMatrixConnected && updateFile && uploadBinaryUI()
                        }

                        {
                            isUpdateDone && updateDoneUI()
                        }
                    </div>

                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>

    function updateDoneUI() {
        return <>
            <div>Update done. LED Matrix will now restart
            </div>



        </>
    }

    function uploadBinaryUI() {
        return <>
            <div>Connection to {bootCode} established. Now start update process.
            </div>

            {
                error&&<div className={"font-bold text-red-600"}>{error}</div>
            }

            <Button disabled={isBinaryUploading} className={"flex flex-row gap-2"} onClick={uploadBinary} >
                {
                    isBinaryUploading ?
                        <div className={"flex flex-row gap-2 align-center items-center "}><LoaderCircle
                            className={"animate-spin flex items-center justify-center w-fit h-full"}/> Updating
                        </div> : <>Update<RefreshCw/></>
                }
            </Button>
        </>
    }

    function establishMatrixConnection() {
        return <>
            <div>Firmware downloaded successfully. Now connect to the matrix wifi.
            </div>

            <Button disabled={isReloading} className={"flex flex-row gap-2"} onClick={checkMatrixConnection} >
                {
                    isReloading ?
                        <div className={"flex flex-row gap-2 align-center items-center "}><LoaderCircle
                            className={"animate-spin flex items-center justify-center w-fit h-full"}/> Reloading
                        </div> : <>Reload<RefreshCw/></>
                }
            </Button>
        </>
    }


    function downloadBinaryUI() {
        return <>
            <div>This process will update you LED Matrix to the newest version.
                It is important that in the first step you aren't connected to the led matrix.
            </div>

            <Button disabled={isBinaryDownloading} className={"self-center"}
                    onClick={downloadBinary}>{isBinaryDownloading ?
                <div className={"flex flex-row gap-2 align-center items-center "}><LoaderCircle
                    className={"animate-spin flex items-center justify-center w-fit h-full"}/> Downloading
                </div> : "Prepare update"}</Button></>
    }
}