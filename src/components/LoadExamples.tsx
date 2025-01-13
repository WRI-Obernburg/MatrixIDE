
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const examples = [
    
{
    "name": "Racing Game",
    "code": "test"

},

{
    "name": "Demo",
    "code": "test2",
},

{
    "name": "Snake",
    "code": "test3",
}



];
export default function LoadExamples(props: {onProgramLoad: (code: string)=>void}) {

return <Dialog>
  <DialogTrigger asChild><Button>Examples</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Load example</DialogTitle>
      <DialogDescription className="flex flex-col gap-2" asChild>
            <div className="flex flex-col gap-2">
            {
                examples.map((element, i)=>{
                    return <Card onClick={()=>{
                        props.onProgramLoad(element.code);
                    }} key={i} className="cursor-pointer pl-4 pr-4 flex flex-row justify-between align-middle items-center">
                    
                                <CardTitle className="m-4">{element.name}</CardTitle>

                                <div className="font-bold">{">"}</div>
                          
                    </Card>
                })
            }
            </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

}