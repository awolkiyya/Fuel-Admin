import {
    Activity,
    Plus
   } from "lucide-react"
   
   import {
    Button
   } from "@/components/ui/button"
   
   import {
    Card
   } from "@/components/ui/card"
   
   
   interface Props{
   
   onCreate:()=>void
   
   }
   
   
   
   export function DispenserHeader({
   onCreate
   }:Props){
   
   
   return (
   
   <Card className="
   p-4 flex justify-between items-center
   ">
   
   
   <div>
   
   <h1 className="
   text-lg font-semibold flex gap-2 items-center
   ">
   
   <Activity
   className="h-5 w-5"
   />
   
   Dispenser Management
   
   </h1>
   
   
   <p className="
   text-xs text-muted-foreground
   ">
   
   Manage pumps and nozzles
   
   </p>
   
   
   </div>
   
   
   
   <Button
   onClick={onCreate}
   className="gap-2"
   >
   
   <Plus
   className="h-4 w-4"
   />
   
   Add Dispenser
   
   </Button>
   
   
   </Card>
   
   )
   
   }