"use client"

import {
  useEffect,
  useState,
} from "react"


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"


import {
  Button,
} from "@/components/ui/button"


import {
  Input,
} from "@/components/ui/input"


import {
  Label,
} from "@/components/ui/label"


import {
  Fuel,
  Loader2,
  Info,
} from "lucide-react"



interface Props {

  open:boolean

  onClose:()=>void


  onSave:(data:{
    number:number
  })=>Promise<void> | void

}




export function CreateDispenserDialog({

  open,

  onClose,

  onSave

}:Props){



const [number,setNumber] =
useState<number>(1)


const [saving,setSaving] =
useState(false)



/*
RESET FORM
*/
useEffect(()=>{

if(!open){

setNumber(1)

}

},[open])




const submit = async()=>{


if(
number < 1 ||
!Number.isInteger(number)
){

return

}



try{

setSaving(true)


await onSave({

number

})


onClose()


}
finally{

setSaving(false)

}


}





return (

<Dialog

open={open}

onOpenChange={(value)=>{

if(!value){

onClose()

}

}}

>


<DialogContent
className="sm:max-w-md"
>


<DialogHeader>


<DialogTitle
className="
flex items-center gap-2
"
>

<Fuel
className="
h-5 w-5 text-blue-600
"
/>


Create Dispenser


</DialogTitle>


</DialogHeader>





<div
className="
space-y-4 py-4
"
>


{/* 
------------------------------
DISPENSER NUMBER
------------------------------
*/}


<div className="space-y-2">


<Label>
Dispenser Number
</Label>



<Input

type="number"

min={1}

step={1}

value={number}

onChange={(e)=>{

const value =
Number(e.target.value)


setNumber(

Number.isNaN(value)
?
1
:
value

)

}}

/>



<div
className="
flex items-center gap-2
text-xs
text-muted-foreground
"
>

<Info
className="
h-3.5 w-3.5
"
/>


Unique dispenser number inside this station.

</div>



</div>



</div>





<DialogFooter>


<Button

variant="outline"

onClick={onClose}

disabled={saving}

>

Cancel

</Button>




<Button

onClick={submit}

disabled={
saving ||
number < 1 ||
!Number.isInteger(number)
}

>


{

saving &&

<Loader2

className="
h-4 w-4 mr-2 animate-spin
"

/>

}



{

saving

?

"Creating..."

:

"Create Dispenser"

}



</Button>



</DialogFooter>



</DialogContent>


</Dialog>


)

}