"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import {
  Save,
  Fuel,
  Settings,
  SlidersHorizontal,
  MapPin,
  ShieldAlert,
  Activity,
  Gauge,
  AlertTriangle,
} from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { api } from "@/lib/api"


interface StationSettings {

  id:string

  stationId:string

  thresholdLow:number

  thresholdMedium:number

  thresholdHigh:number

  thresholdCritical:number

  maxQueueCapacity:number

  minFuelRequestLiters:number

  queueZone:any
}



interface SystemLimits {

  maxTrafficLow:number

  maxTrafficMedium:number

  maxTrafficHigh:number

  maxTrafficCritical:number

  maxQueueCapacity:number
}


interface StationTraffic {

  id:string

  stationId:string

  queueCount:number

  congestionLevel:
  "low" |
  "medium" |
  "high" |
  "critical"

  waitingTimeMin:number

  confidenceScore:number|null

  updatedBy:string
}



export default function StationSettingsPage(){


  const stationId = useSelector(
    (state: RootState) => state.auth.user?.stationId
  )



  const [settings,setSettings] =
  useState<StationSettings | null>(null)



  const [limits,setLimits] =
  useState<SystemLimits | null>(null)



  const [loading,setLoading] =
  useState(true)



  const [manualMode,setManualMode] =
  useState(false)



  const [traffic,setTraffic] =
useState<StationTraffic | null>(null)





  // ==============================
// LOAD SETTINGS
// ==============================

async function loadSettings(){

  if(!stationId){
    console.warn("Station ID missing")
    return
  }


  try {


    const settingsResponse =
    await api.get(
      `/stations/${stationId}/settings`
    )


    setSettings(
      settingsResponse.data.data.settings
    )


    setLimits(
      settingsResponse.data.data.limits
    )



    const trafficResponse =
    await api.get(
      `/stations/${stationId}/traffic`
    )


    setTraffic(
      trafficResponse.data.data
    )



  }
  catch(error){

    console.error(
      "Failed to load station settings",
      error
    )

  }
  finally{

    setLoading(false)

  }

}



useEffect(()=>{

  if(!stationId){
    console.warn(
      "Station ID missing"
    )
    return
  }


  loadSettings()


},[stationId])






// ==============================
// SAVE SETTINGS
// ==============================

async function saveThresholds(){

  if(
    !settings ||
    !stationId
  )
    return



  try{


    const { data } =
    await api.patch(
      `/stations/${stationId}/settings`,
      {


        thresholdLow:
        settings.thresholdLow,


        thresholdMedium:
        settings.thresholdMedium,


        thresholdHigh:
        settings.thresholdHigh,


        thresholdCritical:
        settings.thresholdCritical,


        maxQueueCapacity:
        settings.maxQueueCapacity,


        queueZone:
        settings.queueZone,


        minFuelRequestLiters:
        settings.minFuelRequestLiters


      }
    )



    setSettings(
      data.data
    )



  }
  catch(error){

    console.error(
      "Failed to update station settings",
      error
    )

  }


}









  if(loading){

    return (
      <div className="p-6">
        Loading station settings...
      </div>
    )

  }





return (

<div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">



{/* HEADER */}

<div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">

<div>

<h1 className="text-3xl font-bold">
Station Settings
</h1>


<p className="mt-1 text-muted-foreground">
Manage station configuration,
queue intelligence and AI controls.
</p>


</div>


<Button
size="lg"
onClick={saveThresholds}
>

<Save className="mr-2 h-4 w-4"/>

Save All Changes

</Button>


</div>





{/* OVERVIEW */}


<div className="grid gap-4 md:grid-cols-3">


<Card>

<CardContent className="p-5">

<div className="flex justify-between">

<Fuel className="h-5 w-5"/>

<Badge>
Active
</Badge>

</div>


<p className="mt-4 text-sm text-muted-foreground">
Fuel System
</p>


<h3 className="text-2xl font-bold">
Operational
</h3>


</CardContent>

</Card>





<Card>

<CardContent className="p-5">

<div className="flex justify-between">

<Activity className="h-5 w-5"/>

<Badge variant="secondary">
AI Enabled
</Badge>

</div>


<p className="mt-4 text-sm text-muted-foreground">
Queue Intelligence
</p>


<h3 className="text-2xl font-bold">
Running
</h3>


</CardContent>

</Card>





<Card>

<CardContent className="p-5">

<div className="flex justify-between">

<ShieldAlert className="h-5 w-5"/>

<Badge
variant={
manualMode
?"destructive"
:"outline"
}
>

{
manualMode
?"Enabled"
:"Disabled"
}

</Badge>

</div>


<p className="mt-4 text-sm text-muted-foreground">
Emergency Override
</p>


<h3 className="text-2xl font-bold">

{
manualMode
?"Active"
:"Standby"
}

</h3>


</CardContent>

</Card>


</div>





<Tabs
defaultValue="general"
className="space-y-6"
>


<TabsList className="grid w-full grid-cols-3">

<TabsTrigger value="general">
General
</TabsTrigger>


<TabsTrigger value="thresholds">
Queue Intelligence
</TabsTrigger>


<TabsTrigger value="manual">
Emergency Override
</TabsTrigger>


</TabsList>
{/* =======================================================
 GENERAL SETTINGS
======================================================= */}

<TabsContent value="general">

<Card>

<CardHeader>

<CardTitle className="flex items-center gap-2">

<Settings className="h-5 w-5"/>

General Information

</CardTitle>


<p className="text-sm text-muted-foreground">
Configure station identity and geographical location.
</p>


</CardHeader>



<CardContent className="space-y-6">


<div className="space-y-2">

<Label>
Station Name
</Label>


<Input
value="Station Information From API"
readOnly
/>

</div>




<div className="grid gap-4 md:grid-cols-2">


<div className="space-y-2">

<Label>
Latitude
</Label>


<Input
value="Station latitude"
readOnly
/>

</div>



<div className="space-y-2">

<Label>
Longitude
</Label>


<Input
value="Station longitude"
readOnly
/>

</div>



</div>




<Separator />



<div className="rounded-xl border bg-muted/30 p-4">


<div className="mb-4 flex items-center gap-2">

<MapPin className="h-4 w-4"/>

<h4 className="font-medium">
Queue Detection Zone
</h4>


</div>



<pre className="text-sm">

{
JSON.stringify(
settings?.queueZone,
null,
2
)
}

</pre>


</div>



</CardContent>


</Card>


</TabsContent>







{/* =======================================================
 QUEUE INTELLIGENCE
======================================================= */}



<TabsContent value="thresholds">


<div className="space-y-6">



<div className="grid gap-4 md:grid-cols-4">



<Card>

<CardContent className="p-5">

<Badge>
Low Traffic
</Badge>


<h3 className="mt-4 text-3xl font-bold">

≤ {settings?.thresholdLow}

</h3>


<p className="text-sm text-muted-foreground">
vehicles
</p>


</CardContent>

</Card>






<Card>

<CardContent className="p-5">

<Badge variant="secondary">

Medium

</Badge>


<h3 className="mt-4 text-3xl font-bold">

≤ {settings?.thresholdMedium}

</h3>


<p className="text-sm text-muted-foreground">
vehicles
</p>


</CardContent>

</Card>






<Card>

<CardContent className="p-5">


<Badge variant="destructive">

High

</Badge>


<h3 className="mt-4 text-3xl font-bold">

≤ {settings?.thresholdHigh}

</h3>


<p className="text-sm text-muted-foreground">
vehicles
</p>


</CardContent>

</Card>






<Card>

<CardContent className="p-5">


<Badge variant="destructive">

Critical

</Badge>


<h3 className="mt-4 text-3xl font-bold">

≤ {settings?.thresholdCritical}

</h3>


<p className="text-sm text-muted-foreground">
vehicles
</p>


</CardContent>

</Card>



</div>







<Card>


<CardHeader>


<CardTitle className="flex items-center gap-2">

<SlidersHorizontal className="h-5 w-5"/>

Queue Threshold Configuration

</CardTitle>


<p className="text-sm text-muted-foreground">

Station values cannot exceed global system limits.

</p>


</CardHeader>






<CardContent className="space-y-8">






{/* LOW */}


<div>


<div className="mb-3 flex justify-between">


<span>
Low Traffic Maximum
</span>


<Badge variant="outline">

{settings?.thresholdLow}

</Badge>


</div>



<Slider

value={[
settings?.thresholdLow ?? 0
]}


max={
limits?.maxTrafficLow ?? 20
}


step={1}



onValueChange={(v)=>

setSettings(prev=>prev
?
{
...prev,
thresholdLow:v[0]
}
:null
)

}

/>


<p className="text-xs text-muted-foreground mt-2">

Global limit:
{limits?.maxTrafficLow}

</p>


</div>







{/* MEDIUM */}


<div>


<div className="mb-3 flex justify-between">


<span>
Medium Traffic Maximum
</span>


<Badge variant="outline">

{settings?.thresholdMedium}

</Badge>


</div>



<Slider

value={[
settings?.thresholdMedium ?? 0
]}


max={
limits?.maxTrafficMedium ?? 50
}


step={1}



onValueChange={(v)=>

setSettings(prev=>prev
?
{
...prev,
thresholdMedium:v[0]
}
:null
)

}

/>


</div>







{/* HIGH */}


<div>


<div className="mb-3 flex justify-between">


<span>
High Traffic Maximum
</span>


<Badge variant="outline">

{settings?.thresholdHigh}

</Badge>


</div>



<Slider

value={[
settings?.thresholdHigh ?? 0
]}


max={
limits?.maxTrafficHigh ?? 80
}


step={1}



onValueChange={(v)=>

setSettings(prev=>prev
?
{
...prev,
thresholdHigh:v[0]
}
:null
)

}

/>


</div>








{/* CRITICAL */}


<div>


<div className="mb-3 flex justify-between">


<span>
Critical Traffic Maximum
</span>


<Badge variant="outline">

{settings?.thresholdCritical}

</Badge>


</div>



<Slider

value={[
settings?.thresholdCritical ?? 0
]}


max={
limits?.maxTrafficCritical ?? 100
}


step={1}



onValueChange={(v)=>

setSettings(prev=>prev
?
{
...prev,
thresholdCritical:v[0]
}
:null
)

}

/>


</div>








<div className="rounded-xl border bg-muted/30 p-4">


<div className="flex items-center gap-2 mb-2">

<Gauge className="h-4 w-4"/>

Classification Preview

</div>



<div className="space-y-1 text-sm">


<p>
Queue ≤ {settings?.thresholdLow}
→ Low
</p>


<p>
Queue ≤ {settings?.thresholdMedium}
→ Medium
</p>


<p>
Queue ≤ {settings?.thresholdHigh}
→ High
</p>


<p>
Queue ≤ {settings?.thresholdCritical}
→ Critical
</p>



</div>


</div>




<Button
onClick={saveThresholds}
>

<Save className="mr-2 h-4 w-4"/>

Save Thresholds

</Button>




</CardContent>


</Card>



</div>



</TabsContent>









{/* =======================================================
 MANUAL OVERRIDE
======================================================= */}



<TabsContent value="manual">


<Card>


<CardHeader>


<CardTitle className="flex items-center gap-2">

<ShieldAlert className="h-5 w-5 text-orange-500"/>

Emergency Manual Override

</CardTitle>


</CardHeader>





<CardContent className="space-y-6">



<div className="rounded-xl border border-orange-200 bg-orange-50 p-4">


<div className="flex gap-3">


<AlertTriangle className="h-5 w-5 text-orange-500"/>


<p className="text-sm">

Manual mode bypasses AI traffic detection.

</p>


</div>


</div>







<div className="flex justify-between items-center border rounded-xl p-4">


<div>

<p className="font-medium">

Enable Manual Override

</p>


<p className="text-sm text-muted-foreground">

Emergency traffic update

</p>


</div>



<Switch

checked={manualMode}

onCheckedChange={setManualMode}

/>


</div>







<div>


<Label>
Queue Count
</Label>


<Input

type="number"

disabled={!manualMode}

value={
traffic?.queueCount ?? 0
}


onChange={(e)=>{

setTraffic(prev=>
prev
?
{
...prev,
queueCount:Number(e.target.value)
}
:null
)

}}

/>


</div>








<div>


<Label>
Traffic Level
</Label>


<select

disabled={!manualMode}

value={
  traffic?.congestionLevel ?? "low"
}


onChange={(e)=>{

  setTraffic(prev =>
    prev
    ?
    {
      ...prev,
      congestionLevel:
      e.target.value as StationTraffic["congestionLevel"]
    }
    :
    null
  )

}}

className="w-full border rounded-md p-2"

>


<option value="low">
  Low
</option>


<option value="medium">
  Medium
</option>


<option value="high">
  High
</option>


<option value="critical">
  Critical
</option>


</select>


</div>







<Button

disabled={
!manualMode ||
!traffic
}


onClick={async()=>{


if(!stationId || !traffic)
return



try {


const {data} =
await api.patch(

`/stations/${stationId}/traffic/manual`,


{

queueCount:
traffic.queueCount,


congestionLevel:
traffic.congestionLevel

}

)



setTraffic(
data.data
)



}
catch(error){

console.error(
"Failed to update traffic",
error
)

}



}}


>


<Save className="mr-2 h-4 w-4"/>

Save Manual Traffic

</Button>





</CardContent>


</Card>


</TabsContent>





</Tabs>


</div>

)

}