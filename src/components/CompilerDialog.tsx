import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useReducer} from "react";
import EmulatorComponent from "@/components/EmulatorComponent";

export function CompilerDialog(props: {
    onClick: () => void, downloadCompiledProgram: () => void, showDownloadButton: boolean
}) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [compilerOutput, setCompilerOutput] = React.useState<string>("");

    function compile() {
        // @ts-ignore
        window.output = "";
        props.onClick();
        forceUpdate();
    }

    return <Card className={"bg-card shadow flex flex-col items-stretch rounded-lg m-5 "}>
        {//@ts-ignore
            window.output ? <>
                <div className={" m-2 font-bold self-center"}>Compiler-Ausgabe</div>
                <div className={"flex-grow overflow-y-scroll m-2 whitespace-pre-wrap"}>
                    {//@ts-ignore
                        window.output}
                </div>
            </> : ""}
        <Button onClick={compile} className="m-4">Compile</Button>
        {props.showDownloadButton ? <div className={"flex flex-row flex-1 gap-2 ml-4 mr-4 mb-4"}>
            <Button className={"flex-grow"} onClick={props.downloadCompiledProgram}>Download Compiled
                Program
            </Button>
            <EmulatorComponent/>
        </div> : null}
    </Card>;
}