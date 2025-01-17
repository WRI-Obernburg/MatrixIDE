"use client";
import {Editor, useMonaco} from "@monaco-editor/react";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    ResizableHandle, ResizablePanel, ResizablePanelGroup,
} from "@/components/ui/resizable"
import LoadExamples from "@/components/LoadExamples";
import {compile} from "@/components/Compiler";
import {CompilerDialog} from "@/components/CompilerDialog";
import {useLocalStorage} from "usehooks-ts";
import MatrixConnection from "@/components/MatrixConnection";
import Image from "next/image";
import HelpDialog from "@/components/HelpDialog";
import UpdateProcess from "@/components/UpdateProcess";


export default function Home() {

    const newGame = `
    
// Wird einmal beim Start deines Spiels aufgerufen
function init() {

}

// Wird während deines Spiels mit den Ticks pro Sekunde (tps) aufgerufen
function game_loop() {

}

// Wird 30 mal pro Sekunde aufgerufen, um dein Spiel zu zeichnen
function draw() {

}

// Wird beim Beenden deines Spiels aufgerufen
function clean_up() {

}

// Wird bei einer Nutzereingabe aufgerufen
function on_event(event) {

}

`


    const [content, setContent] = useLocalStorage("content", newGame);
    const [changeMade, setChangeMade] = React.useState<boolean>(false);

    const [compilerOutput, setCompilerOutput] = React.useState<string>("");
    const [compilerBlob, setCompilerBlob] = React.useState<Blob | null>(null);
    const [compilingDone, setCompilingDone] = React.useState<boolean>(false);

    const [presentationMode, setPresentationMode] = React.useState<boolean>(false);


    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {

            monaco.languages.typescript.typescriptDefaults.setExtraLibs([{
                content: `
        function print(message: string) {}
        function set_status(status: string) {}
        function get_status(): string {}
        function get_controls(): number {}
        function set_controls(controls: number) {}
        function get_current_tps(): number {}
        function set_tps(tps: number) {}
        function reset_controls() {}
        function is_animation_running(): boolean {}
        function stop_animation() {}
        function set(x: number, y: number, color: number) {}
        function off(x: number, y: number) {}
        function fill(color: number) {}
        function clear() {}
        function line(x1: number, y1: number, x2: number, y2: number, color: number) {}
        function rect(x: number, y: number, width: number, height: number, color: number) {}
        function rect_filled(x: number, y: number, width: number, height: number, color: number) {}
        function circle(x: number, y: number, radius: number, color: number) {}
        function number(x: number, y: number, number: number, color: number) {}
        function run_animation_splash(x: number, y: number, color: number, filled: number, duration: number, wait: number) {}
        function random(min: number, max: number): number {}
    `
            }]);


            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                noLib: true, allowNonTsExtensions: true,
            });
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true, noSyntaxValidation: true,
            })

        }
    }, [monaco]);

    useEffect(() => {
        if (monaco) {
            if(presentationMode) {
                let options = {"fontSize": 20}
                monaco.editor.getEditors()[0].updateOptions(options);
                //activate fullscreen
                document.body.requestFullscreen().then(r => console.log(r)).catch(e => console.error(e));
            }else{
                let options = {"fontSize": 14}
                monaco.editor.getEditors()[0].updateOptions(options);
                //deactivate fullscreen
                document.exitFullscreen().then(r => console.log(r)).catch(e => console.error(e));
            }
        }
        }, [presentationMode]);

    function download() {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', "program-code.matrixcode");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function downloadCompiledProgram() {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(compilerOutput));
        element.setAttribute('download', "program.mb");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function open() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => {
            // you can use this method to get file and perform respective operations
            const files = Array.from(input.files!);
            const reader = new FileReader();
            reader.readAsText(files[0], "UTF-8");
            reader.onload = function (evt) {
                setContent(evt.target!.result!.toString());
            }
        };
        input.click();
    }

    return (<ResizablePanelGroup direction="horizontal" className={"flex w-dvw h-dvh "}>
        <ResizablePanel minSize={20} defaultSize={25}
                        className={"h-100 flex-grow flex flex-col bg-card w-[30%] justify-between"}>
            <div className={"flex flex-col gap-4"}>
            <div className={"font-bold self-center mt-4 text-2xl"}>Matrix-IDE</div>

                <CompilerDialog changeMade={changeMade} onClick={() => {
                    try {
                        const newCompilerOutput = compile(content);
                        setCompilerOutput(newCompilerOutput.string);
                        setCompilerBlob(newCompilerOutput.blob);
                        setCompilingDone(true);
                    } catch (e) {
                        console.error(e);
                        setCompilingDone(false);
                    }
                    setChangeMade(false);

                }} downloadCompiledProgram={downloadCompiledProgram} showDownloadButton={compilingDone}/>




            </div>
            <div className={"flex flex-col gap-6"}>
                <MatrixConnection changeMade={changeMade} program={compilerBlob}/>
                <div className={"flex flex-row gap-2 self-center"}>

                    <LoadExamples onProgramLoad={function (code: string): void {
                        setContent(code);
                    }}/>
                    <Button onClick={open}>Open</Button>
                    <Button onClick={download}>Download</Button>
                    <UpdateProcess/>
                </div>

                <footer
                    className="row-start-3 flex gap-6 flex-wrap items-center justify-center mb-4">
                    <HelpDialog onPresentationModeChange={setPresentationMode} isInPresentationMode={presentationMode}/>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="https://wri-obernburg.de"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            aria-hidden
                            src="/window.svg"
                            alt="Window icon"
                            width={16}
                            height={16}
                        />
                        WRI-Website
                    </a>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="https://github.com/wri-obernburg/MatrixIDE"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            aria-hidden
                            src="/globe.svg"
                            alt="Globe icon"
                            width={16}
                            height={16}
                        />
                        Github →
                    </a>
                </footer>
            </div>

        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel minSize={50}>
            <Editor onChange={(content) => {
                setContent(content ?? "");
                setChangeMade(true);
            }} value={content} language={"typescript"} theme={presentationMode?"light":"vs-dark"} width={"100%"}>

            </Editor>
        </ResizablePanel>
    </ResizablePanelGroup>);
}

