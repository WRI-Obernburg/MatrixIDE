"use client";
import Image from "next/image";
import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import LEDMatrix from "@/components/LEDMatrix";
import LoadExamples from "@/components/LoadExamples";
import {compile} from "@/components/Compiler";
import EmulatorComponent from "@/components/EmulatorComponent";
import {CompilerDialog} from "@/components/CompilerDialog";



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

  const [content, setContent] = React.useState<string>(window.localStorage.getItem("content") ?? newGame);

  const [compilerOutput, setCompilerOutput] = React.useState<string>("");
  const [messages, setMessages] = React.useState<string>("");
  const [compilingDone, setCompilingDone] = React.useState<boolean>(false);


  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({noSemanticValidation: true,
        noSyntaxValidation: true,})
    }
  }, [monaco]);

  function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', "program-code.matrixcode");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function downloadCompiledProgram() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(compilerOutput));
    element.setAttribute('download', "program.mb");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function open() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files!);
      var reader = new FileReader();
      reader.readAsText(files[0], "UTF-8");
      reader.onload = function (evt) {
        setContent( evt.target!.result!.toString());
        window.localStorage.setItem("content", evt.target!.result!.toString());

      }
    };
    input.click();
  }


  // @ts-ignore
  return (


    <ResizablePanelGroup direction="horizontal" className={"flex w-dvw h-dvh "}>
      <ResizablePanel minSize={20} defaultSize={25}
                      className={"h-100 flex-grow flex flex-col bg-card w-[30%] justify-between"}>
        <div className={"font-bold self-center mt-4 text-2xl"}>Matrix-IDE</div>
        <CompilerDialog onClick={() => {
          try {
            let newCompilerOutput = compile(content);
            setCompilerOutput(newCompilerOutput);
            setCompilingDone(true);
          }catch(e){
            setCompilingDone(false);
          }
        }} downloadCompiledProgram={downloadCompiledProgram} showDownloadButton={compilingDone}/>

        <div className={"flex flex-row gap-2 self-center mb-4"}>
          <Button onClick={()=>{
            setContent(newGame)
          }}>New</Button>
          <Button onClick={open}>Open</Button>
          <LoadExamples onProgramLoad={function (code: string): void {
            setContent(code);
          }}/>
          <Button onClick={download}>Download</Button>
        </div>

      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel minSize={20}>
        <Editor onChange={(content) => {
          setContent(content ?? "");
          window.localStorage.setItem("content", content!);
        }} value={content} language={"javascript"} theme={"vs-dark"} width={"100%"}>

        </Editor>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

