import {useEffect, useState} from "react";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {RotateCw} from "lucide-react";

export default function MatrixConnection(props: { program: Blob | null }) {

    const [connected, setConnected] = useState(false);
    const [version, setVersion] = useState("");
    const [bootCode, setBootCode] = useState(0);
    const [isFetching, setIsFetching] = useState(true);


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
        fetch("http://matrix.local/api", {
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


        const requestOptions = {
            method: "POST", headers: myHeaders, body: props.program,
            // @ts-ignore
            targetAddressSpace: "private"

        };

        fetch("http://matrix.local/pushDevCode", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
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
            {connected ? "Connected to "+buildEmojiCode(bootCode)+" with version " + version : "No connection"}

            {(connected && props.program) && <div className={"flex flex-row gap-2 flex-grow self-center w-full flex-1"}>
                <Button onClick={sendProgramToMatrix} className={"flex-grow"}>Send to Matrix</Button>
                <Button className={"flex-grow"} asChild><Link href={"http://matrix.local/"}
                                                              target={"_blank"}>Controller</Link></Button>
                <Button className={"flex-grow"} asChild><Link href={"http://matrix.local/update"}
                                                              target={"_blank"}>Update</Link></Button>
            </div>}
        </CardContent>
    </Card>
}