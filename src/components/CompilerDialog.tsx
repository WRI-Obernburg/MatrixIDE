import {Card, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useReducer, useState} from "react";
import EmulatorComponent from "@/components/EmulatorComponent";
import {LoaderCircle} from "lucide-react";

export function CompilerDialog(props: {
    onClick: () => void, downloadCompiledProgram: () => void, showDownloadButton: boolean, changeMade: boolean
}) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isCompiling, setIsCompiling] = useState(false);

    function compile() {
        setIsCompiling(true);
        setTimeout(()=>{
            // @ts-ignore
            window.output = "";
            props.onClick();
            forceUpdate();
            setIsCompiling(false);
        }, 800);

    }

    return <Card className={"flex flex-col items-stretch ml-4  mr-4 gap-4"}>
        <CardTitle className={"ml-4 mr-4 mt-4"}>Compiler</CardTitle>
        {//@ts-ignore
            (typeof window !== "undefined" && window.output) ? <>
                <div className={" ml-2 mr-4 font-bold self-center"}>Compiler-Ausgabe</div>
                <div className={"flex-grow overflow-y-scroll m-2 whitespace-pre-wrap"}>
                    {//@ts-ignore
                        window.output}
                </div>
            </> : ""}

        <div className={"ml-4"}>Press compile to process your current program</div>

        {
            props.changeMade && <div className={"ml-4"}>Uncompiled changes!</div>
        }
        <div className={"flex flex-col gap-2 mb-4"}>
            <Button disabled={isCompiling} onClick={compile} className={"ml-4 mr-4 flex flex-row gap-2 justify-center align-middle items-center"}>
                {isCompiling?<>
                    <LoaderCircle className={"animate-spin flex items-center justify-center w-fit h-full"}/>
                    Compiling...
                </>:"Compile"
                }
            </Button>
            {props.showDownloadButton ? <div className={"flex flex-wrap flex-row flex-1 gap-2 ml-4 mr-4"}>
                <Button className={`flex-grow ${props.changeMade&&"opacity-60"}`} onClick={props.downloadCompiledProgram}>
                    Download Program
                </Button>
                <EmulatorComponent changeMade={props.changeMade} />
            </div> : null}
        </div>
    </Card>;
}