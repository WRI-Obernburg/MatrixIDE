import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import React, {useState} from "react";
import semver from "semver";
import {LoaderCircle, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function MatrixSettings() {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIncompatible, setIsIncompatible] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [apps, setApps] = useState<string[]>([]);
    const [startupApp, setStartupApp] = useState<number>(-1);
    const [clickedApp, setClickedApp] = useState<number>(-1);
    const [isUpdatingStartupApp, setIsUpdatingStartupApp] = useState<boolean>(false);

    function fetchMatrixData() {
        setIsLoading(true);
        fetch("http://192.168.0.1/api", {
            // @ts-ignore
            targetAddressSpace: "private",
        }).then(e => e.json()).then((data) => {
            if (!semver.gte(data.version, "1.1.1")) {
                setIsIncompatible(true);
                setIsLoading(false);
                return;
            }
            setClickedApp(-1);
            setIsConnected(true);
            if(data.apps!=null && data.startupID != null) {
                setApps(data.apps);
                setStartupApp(data.startupID)
            }else{
                setIsIncompatible(true);
            }


            setIsLoading(false);
        }).catch((error) => {
            setIsConnected(false);
            setIsLoading(false);
            setApps([]);
            setClickedApp(-1);
            console.error(error);
        });


    }



    function onOpenChange(newState: boolean) {
        setOpen(newState);

        if (newState) {
            fetchMatrixData();
        }else{
            setApps([]);
            setStartupApp(-1);
            setIsIncompatible(false);
            setClickedApp(-1);
            setIsUpdatingStartupApp(false);
        }
    }

    function updateStartupApp(index: number) {
        if(clickedApp!=-1) return;
        setClickedApp(index);
        setIsUpdatingStartupApp(true);

       setTimeout(()=>{
           fetch("http://192.168.0.1/setStartupApp?id="+index, {
               // @ts-ignore
               targetAddressSpace: "private",
           }).then(e => e.json()).then((data) => {

               setStartupApp(index);
               setIsUpdatingStartupApp(false);
               fetchMatrixData();

           }).catch((error) => {
               setIsUpdatingStartupApp(false);

               console.error(error);
           });
       },800);
    }

    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild><Settings className={"cursor-pointer"}/></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Matrix Settings</DialogTitle>
                <DialogDescription asChild>
                    <div className={"flex flex-col gap-3"}>


                        {!isLoading && !isConnected &&
                            <div className={"flex flex-row gap-2 text-red-600"}>No matrix connection! Hit reload to try
                                again.</div>}

                        {isIncompatible &&
                            <div className={"flex flex-row gap-2"}>Incompatible Matrix Version. Please update your
                                matrix to at least 1.1.1</div>}

                        {apps.length > 0 && <div className={"flex flex-col gap-2 mt-4"}>
                            {
                                isUpdatingStartupApp ?
                                    <div className={"font-bold"}>Updating startup app. Please wait...</div>: <div>Click on an app to select it as your startup app!</div>
                            }
                            <div className={"font-bold"}>Current Apps on Matrix:</div>
                            {apps.map((app, index) => {
                                return <li key={index} onClick={()=>{updateStartupApp(index)}}
                                           className={(index == startupApp) ? "text-green-800 font-bold" :
                                               (clickedApp == index) ? "text-orange-500 font-bold" :
                                                   "cursor-pointer"}>{app}</li>
                            })}


                        </div>


                        }

                        {isLoading && !isConnected &&
                            <div className={"flex flex-row gap-2"}><LoaderCircle className={"animate-spin"}/> Loading...
                            </div>}

                        <Button onClick={fetchMatrixData}>Reload list</Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}