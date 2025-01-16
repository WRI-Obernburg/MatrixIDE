import React, {useEffect, useState} from "react";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LoaderCircle, RotateCw} from "lucide-react";

export default function MatrixConnection(props: { program: Blob | null, changeMade: boolean }) {

    const [connected, setConnected] = useState(false);
    const [version, setVersion] = useState("");
    const [bootCode, setBootCode] = useState(0);
    const [isFetching, setIsFetching] = useState(true);
    const [isSendingToMatrix, setIsSendingToMatrix] = useState(false);
    const [isPreparingUpdate, setIsPreparingUpdate] = useState(false);
    const [updateFile, setUpdateFile] = useState<Blob | null>(null);
    const [isUpdateDone, setIsUpdateDone] = useState(false);
    const [isUpdateSending, setIsUpdateSending] = useState(false);

    function prepareUpdate() {
        setIsPreparingUpdate(true);
        const updateFile = fetch("/firmware.bin").then(e => e.blob()).then((blob) => {
            setUpdateFile(blob);
            setIsPreparingUpdate(false);
        }).catch((error) => {
            console.error(error);
            setIsPreparingUpdate(false);
        });
    }

    function sendUpdateToMatrix() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/octet-stream");
        setIsUpdateSending(true);

        const requestOptions = {
            method: "POST", headers: myHeaders, body: updateFile,
            // @ts-ignore
            targetAddressSpace: "private"

        };

        fetch("http://192.168.0.1/ota/upload", requestOptions)

            .then((response) => response.text())
            .then((result) => {
                setIsUpdateSending(false);
                setIsUpdateDone(true);
            }).catch((error) => {
                console.error(error);
                setIsUpdateSending(false);
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

    useEffect(() => {
        fetchMatrixData();

        // @ts-ignore
        navigator.connection.addEventListener('change', fetchMatrixData);

        return () => {
            // @ts-ignore
            navigator.connection.removeListener('change', fetchMatrixData);
        }

    }, []);



    function fetchMatrixData() {
        setIsFetching(true);
        fetch("http://192.168.0.1/api", {
            // @ts-ignore
            targetAddressSpace: "private",
        }).then(e => e.json()).then((data) => {
            setVersion(data.version);
            setBootCode(data.bootCode);
            setConnected(true);
            window.onbeforeunload = ()=>{
                return "Bist du sicher, dass du die Seite verlassen willst?";
            }
            setIsFetching(false);
        }).catch((error) => {
            setConnected(false);
            setIsFetching(false);
            window.onbeforeunload = null;
            console.error(error);
        });


    }

    function sendProgramToMatrix() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/octet-stream");
        setIsSendingToMatrix(true);

        const requestOptions = {
            method: "POST", headers: myHeaders, body: props.program,
            // @ts-ignore
            targetAddressSpace: "private"

        };

        fetch("http://192.168.0.1/pushDevCode", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setIsSendingToMatrix(false);
            })
            .catch((error) => console.error(error));
    }

    return <Card className={"m-4"}>

        <CardTitle className={"m-4 flex flex-row justify-between"}>
            <div>Matrix Connection</div>
            {
                !isFetching ? <RotateCw className={"cursor-pointer"} size={16} onClick={fetchMatrixData}/>: "Loading..."
            }
        </CardTitle>

        <CardContent className={"flex flex-col gap-2"}>
            {connected ? "Connected to "+buildEmojiCode(bootCode)+" with version " + version : <div className={"flex flex-row gap-2 align-middle items-center"}>
                <div>
                    No connection
                </div>

                <Button onClick={prepareUpdate} disabled={isPreparingUpdate || updateFile!=null}>

                    {
                        updateFile?<>
                            Update ready!
                        </>:
                        isPreparingUpdate?<>
                            <LoaderCircle className={"animate-spin flex items-center justify-center w-fit h-full"}/>
                            Preparing Update...
                        </>:"Prepare Softwareupdate"
                    }

                </Button>

            </div>}

            { connected && <div className={"flex flex-row gap-2 flex-grow self-center w-full flex-1"}>
                 {( props.program) && <Button disabled={isSendingToMatrix} onClick={sendProgramToMatrix} className={`flex-grow ${props.changeMade && "opacity-60"}`}>
                    {
                        isSendingToMatrix?<>
                            <LoaderCircle className={"animate-spin flex items-center justify-center w-fit h-full"}/>
                            Sending...
                        </>:"Send to Matrix"

                    }


                </Button>}
                <Button className={"flex-grow"} asChild><Link href={"http://192.168.0.1/"}
                                                              target={"_blank"}>Controller</Link></Button>
                {

                    updateFile!=null?
                        <Button disabled={isUpdateSending || isUpdateDone} onClick={sendUpdateToMatrix} className={"flex-grow"}>

                            {

                                isUpdateDone?"Update done":
                                isUpdateSending?"Updating...":"Auto Update"

                            }

                        </Button>
                        : <Button className={"flex-grow"} asChild><Link href={"http://192.168.0.1/update"}
                                                                                     target={"_blank"}>Manual Update</Link></Button>

                }
            </div>}
        </CardContent>
    </Card>
}