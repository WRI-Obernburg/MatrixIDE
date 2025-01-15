"use client";
import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import LoadExamples from "@/components/LoadExamples";
import {compile} from "@/components/Compiler";
import {CompilerDialog} from "@/components/CompilerDialog";
import {useLocalStorage} from "usehooks-ts";
import MatrixConnection from "@/components/MatrixConnection";



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


  const [content, setContent] = useLocalStorage("content", JSON.stringify(newGame));

  const [compilerOutput, setCompilerOutput] = React.useState<string>("");
  const [compilerBlob, setCompilerBlob] = React.useState<Blob | null>(null);
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
        setContent( JSON.stringify(evt.target!.result!.toString()));

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
            const newCompilerOutput = compile(content);
            setCompilerOutput(newCompilerOutput.string);
            setCompilerBlob(newCompilerOutput.blob);
            setCompilingDone(true);
          }catch(e){
            console.error(e);
            setCompilingDone(false);
          }
        }} downloadCompiledProgram={downloadCompiledProgram} showDownloadButton={compilingDone}/>


        <MatrixConnection program={compilerBlob}/>

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
      <ResizablePanel minSize={50}>
        <Editor onChange={(content) => {
          setContent(content ?? "");
        }} value={content} language={"javascript"} theme={"vs-dark"} width={"100%"}>

        </Editor>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

