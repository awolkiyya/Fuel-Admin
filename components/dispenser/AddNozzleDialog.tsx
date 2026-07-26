"use client"

import {
  useEffect,
  useState
} from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Button
} from "@/components/ui/button"

import {
  Input
} from "@/components/ui/input"

import {
  Label
} from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Loader2,
  Fuel,
  Info
} from "lucide-react"



interface FuelType {

  id:string

  name:string

}



interface Props {

  open:boolean

  onClose:()=>void

  fuelTypes:FuelType[]

  fuelTypesLoading?:boolean


  onSave:(data:{
    number:number
    fuelTypeId:string
  })=>Promise<void> | void

}



export function AddNozzleDialog({

  open,
  onClose,
  fuelTypes,
  fuelTypesLoading=false,
  onSave

}:Props){


const [number,setNumber]=
useState<number>(1)


const [fuelTypeId,setFuelTypeId]=
useState<string>("")


const [saving,setSaving]=
useState(false)



/*
RESET FORM
When dialog closes
*/
useEffect(()=>{

if(!open){

  setNumber(1)

  setFuelTypeId("")

}

},[open])



const submit = async()=>{


if(
number < 1 ||
!fuelTypeId
){

return

}



try{

setSaving(true)


await onSave({

number,

fuelTypeId

})


onClose()


}
finally{

setSaving(false)

}


}




const selectedFuel =
fuelTypes.find(
(f)=>f.id===fuelTypeId
)



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

Add Nozzle

</DialogTitle>


</DialogHeader>



<div className="
space-y-5 py-4
">


{/* 
--------------------------------
NOZZLE NUMBER
--------------------------------
*/}

<div className="space-y-2">


<Label>
Nozzle Number
</Label>


<Input

type="number"

min={1}

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


<p className="
text-xs text-muted-foreground
">

Unique number inside this dispenser.

Example:
Nozzle 1, Nozzle 2

</p>


</div>




{/* 
--------------------------------
FUEL TYPE
--------------------------------
*/}

<div className="space-y-2">


<Label>
Fuel Type
</Label>



<Select

value={fuelTypeId}

onValueChange={setFuelTypeId}

disabled={
fuelTypesLoading ||
fuelTypes.length===0
}

>


<SelectTrigger>

<SelectValue

placeholder={
fuelTypesLoading
?
"Loading fuel types..."
:
"Select fuel type"
}

/>

</SelectTrigger>



<SelectContent>


{
fuelTypes.map(
(fuel)=>(

<SelectItem

key={fuel.id}

value={fuel.id}

>


<div className="
flex items-center gap-2
">

<Fuel
className="
h-4 w-4 text-blue-500
"
/>


{fuel.name}


</div>


</SelectItem>


)

)
}



</SelectContent>


</Select>



{
fuelTypes.length===0 &&
!fuelTypesLoading &&

<div className="
flex items-center gap-2
rounded-md
bg-yellow-50
p-2
text-xs
text-yellow-700
">

<Info
className="h-3.5 w-3.5"
/>

No fuel configured for this station.

</div>

}



</div>




{
selectedFuel &&

<div className="
rounded-md
border
bg-muted/40
p-3
text-sm
">

<div className="
flex items-center gap-2
font-medium
">

<Fuel
className="h-4 w-4"
/>

Selected Fuel

</div>


<p className="
mt-1
text-muted-foreground
">

{selectedFuel.name}

</p>


</div>

}



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
!fuelTypeId
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
"Adding..."
:
"Add Nozzle"
}


</Button>


</DialogFooter>



</DialogContent>


</Dialog>

)

}