import {useEffect, useState} from "react";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function MatrixConnection(props: {program:Blob | null}) {

    const [connected, setConnected] = useState(false);
    const [version, setVersion] = useState("");

    useEffect(()=>{
        fetchMatrixData();
    }, []);

    function fetchMatrixData() {
            fetch("http://matrix.local/api").then(e=>e.json()).then((data)=>{
                setVersion(data.version);
                setConnected(true);
            }).catch((error) => {
                setConnected(false);
                console.error(error);
            });


    }

    function sendProgramToMatrix() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/octet-stream");


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: props.program,
        };

        fetch("http://matrix.local/pushDevCode", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    return <Card className={"m-4"}>

        <CardTitle className={"m-4"}>
         Matrix Connection
        </CardTitle>

        <CardContent className={"flex flex-col gap-2"}>
            {
                connected? "Connected to matrix with version "+ version : "No connection"
            }

            {
                (connected && props.program) &&
                <div className={"flex flex-row gap-2 flex-grow self-center w-full flex-1"}>
                    <Button  onClick={sendProgramToMatrix} className={"flex-grow"}>Send to Matrix</Button>
                    <Button className={"flex-grow"} asChild><Link href={"http://matrix.local/update"}  target={"_blank"}>Update</Link></Button>
                </div>
            }
        </CardContent>
    </Card>
}