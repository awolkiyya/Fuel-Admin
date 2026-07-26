"use client"

import {
  useMemo,
  useState,
} from "react"

import {
  useSelector,
} from "react-redux"


import {
  RootState,
} from "@/lib/store"


import {
  Input,
} from "@/components/ui/input"


import {
  EmptyState,
} from "@/components/EmptyState"


import {
  Search,
  AlertTriangle,
  Fuel,
  FuelIcon,
} from "lucide-react"



import {
  usePumps,
  useAddNozzle,
  useCreatePump,
} from "@/hooks/dispenser/usePumps"



import {
  useStationFuelTypes,
} from "@/hooks/tank/useTanks"



import {
  DispenserHeader,
} from "@/components/dispenser/DispenserHeader"



import {
  DispenserCard,
} from "@/components/dispenser/DispenserCard"



import {
  AddNozzleDialog,
} from "@/components/dispenser/AddNozzleDialog"
import { CreateDispenserDialog } from "@/components/dispenser/CreateDispenserDialog"
import { useFuelTypes } from "@/hooks/station/useStations"






export default function PumpsPage(){


/* ============================
   STATION CONTEXT
============================ */

const stationId =
useSelector(
(state:RootState)=>
state.auth.user?.stationId ?? undefined
)



/* ============================
   API
============================ */


const {
data,
isLoading,
isError

}=usePumps(
stationId
)



const {
data:fuelTypes,
isLoading:isFuelLoading

}=useFuelTypes(1,"")



const addNozzle =
useAddNozzle(
stationId
)



const createPump =
useCreatePump(
stationId
)




/* ============================
   UI STATE
============================ */


const [
search,
setSearch
]=useState("")


const [
expanded,
setExpanded
]=useState<string|null>(null)



const [
createOpen,
setCreateOpen
]=useState(false)



const [
nozzleOpen,
setNozzleOpen
]=useState(false)



const [
selectedDispenser,
setSelectedDispenser
]=useState<{

id:string
name:string

}|null>(null)





/* ============================
   DATA
============================ */


const dispensers =
data?.data ?? []



const filtered =
useMemo(()=>{


const query =
search
.trim()
.toLowerCase()



if(!query)
return dispensers



return dispensers.filter(
(d:any)=>

`dispenser ${d.number}`
.toLowerCase()
.includes(query)

)



},[
dispensers,
search
])





/* ============================
   STATES
============================ */


if(!stationId){

return (

<EmptyState

icon={Fuel}

title="No Station Assigned"

/>

)

}



if(isLoading){

return (

<div className="space-y-3">

<div className="
h-24 rounded bg-muted animate-pulse
"/>

<div className="
h-24 rounded bg-muted animate-pulse
"/>

</div>

)

}



if(isError){

return (

<EmptyState

icon={AlertTriangle}

title="Failed To Load Dispensers"

/>

)

}




return (

<div
className="
max-w-3xl mx-auto p-4 space-y-4
"
>



{/* HEADER */}

<DispenserHeader

onCreate={()=>
setCreateOpen(true)
}

/>



{/* SEARCH */}

<Input

placeholder="Search dispenser..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>





{/* EMPTY */}

{
dispensers.length===0 &&

<EmptyState

icon={FuelIcon}

title="No Dispensers Found"

/>

}






{/* LIST */}

<div className="space-y-4">


{
filtered.map(
(dispenser:any)=>(


<DispenserCard


key={
dispenser.id
}



dispenser={
dispenser
}



expanded={
expanded===dispenser.id
}



onExpand={()=>{


setExpanded(

prev=>

prev===dispenser.id

?

null

:

dispenser.id

)


}}



onAddNozzle={()=>{


setSelectedDispenser({

id:dispenser.id,

name:
`Dispenser #${dispenser.number}`

})


setNozzleOpen(true)


}}



/>


)

)

}



</div>







{/* CREATE DISPENSER */}


<CreateDispenserDialog


open={
createOpen
}


onClose={()=>
setCreateOpen(false)
}



onSave={(data)=>{


createPump.mutate({

number:data.number

})



setCreateOpen(false)


}}



/>







{/* ADD NOZZLE */}



<AddNozzleDialog


open={
nozzleOpen
}



onClose={()=>{


setNozzleOpen(false)

setSelectedDispenser(null)


}}



fuelTypes={
fuelTypes?.data ?? []
}



fuelTypesLoading={
isFuelLoading
}




onSave={(payload)=>{


if(
!stationId ||
!selectedDispenser
)
return



addNozzle.mutate({


stationId,


pumpId:
selectedDispenser.id,



number:
payload.number,



fuelTypeId:
payload.fuelTypeId



})



setNozzleOpen(false)

setSelectedDispenser(null)


}}



/>






</div>

)

}