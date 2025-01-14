import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useReducer} from "react";

export function CompilerDialog(props: { onClick: () => void }) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    function compile() {
        // @ts-ignore
        window.output = "";
        props.onClick();
        forceUpdate();
    }

    return <Card className={"bg-card shadow flex flex-col rounded-lg m-5"}>
        {
            //@ts-ignore
            window.output ?<>
                <div className={" m-2 font-bold self-center"}>Compiler-Ausgabe</div>
                <div className={"flex-grow overflow-y-scroll m-2 whitespace-pre-wrap"}>
                    {
                        //@ts-ignore
                        window.output
                    }
                </div></>: ""
        }
        <Button onClick={compile} className="m-4">Compile</Button>
    </Card>;
}