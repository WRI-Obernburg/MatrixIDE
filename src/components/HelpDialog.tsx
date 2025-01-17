"use client";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {HelpCircle} from "lucide-react";
import Link from "next/link";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

export default function HelpDialog(props: {onPresentationModeChange: (checked: boolean) => void, isInPresentationMode: boolean}) {
    return <Dialog >
        <DialogTrigger> <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="#"
            rel="noopener noreferrer"
        >
            <HelpCircle
                aria-hidden
                width={16}
                height={16}
            />
            Hilfe
        </a></DialogTrigger>
        <DialogContent className={"max-h-[60vh] max-w-[50vw] overflow-y-scroll"}>
            <DialogHeader>
                <DialogTitle className={"text-2xl"}>Informationen zur MatrixIDE</DialogTitle>
                <DialogDescription className={"text-xl pt-4 flex justify-center"} asChild>

                    <div className={"flex flex-col gap-6"}>
                        <ul className={"flex gap-3 flex-col list-disc pl-5"}>
                            <li>Die IDE kann genutzt werden, um eigene Spiele und Animation auf der LED Matrix zu
                                realiseren
                            </li>
                            <li>Die Programmiersprache basiert auf <Link target={"_blank"}
                                                                         className={"underline hover:font-bold transition-all"}
                                                                         href={"https://home.workshopfriends.com/wrench/www/"}>Wrench</Link>
                            </li>
                            <li>In Wrench sind die Erweiterungen Math, String und Container aktiv</li>
                            <li>Vermeide es zu viel Speicher zu allokieren. Für deine Anwendung stehen insgesamt ca. 30
                                kB zur Verfügung
                            </li>
                            <li>Die Verbindung zur LED Matrix ist nur in Chromium Browsern möglich</li>
                            <li>Liste aller <Link target={"_blank"}
                                                  className={"underline hover:font-bold transition-all"}
                                                  href={"https://github.com/WRI-Obernburg/PixelMatrix/blob/main/src/system/WrenchWrapper.h#L194"}>Matrix
                                Funktionen</Link></li>
                            <li><Link className={"underline hover:font-bold transition-all"} target={"_blank"}
                                      href={"/cheatsheet.pdf"}>Cheatsheet</Link></li>

                        </ul>

                        <div className="flex items-center space-x-2">
                            <Switch defaultChecked={props.isInPresentationMode} onCheckedChange={props.onPresentationModeChange} id="presentation-mode"/>
                            <Label htmlFor="presentation-mode">Präsentations Modus</Label>
                        </div>

                    </div>


                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}