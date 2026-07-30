"use client";

import React, {
  useCallback,
} from "react";

import { AsyncDropdown } from "../AsyncDropdown";

import { Nozzle } from "@/types/pump.types";

import { pumpService } from "@/services/pump.service";



interface NozzleDropdownProps {

  value: string | null;


  onChange: (
    value:string,
    item:Nozzle
  )=>void;


  disabled?:boolean;


  fuelType?:string;


  stationId?:string;

}





export const NozzleDropdown:React.FC<
  NozzleDropdownProps
> = ({

  value,

  onChange,

  disabled=false,

  fuelType,

  stationId,

})=>{





const fetchData =
useCallback(

async({

 search,

 page,

 pageSize,

}:{

 search:string;

 page:number;

 pageSize:number;

})=>{


const result =
await pumpService.getNozzlesByFuelType({

  stationId,

  fuelType,

  page,

  perPage:pageSize,

  search,

});




const data:Nozzle[] =
result.data ?? [];




return {

 data,

 total:
 result.meta?.total ??
 data.length,

};



},

[
 stationId,
 fuelType
]

);







return (

<AsyncDropdown<Nozzle,string>


value={value}



onChange={onChange}



fetchData={fetchData}



valueField="id"





/**
 * Custom Display
 *
 * Example:
 *
 * Dispenser 1 - Nozzle 2
 *
 */
renderItem={(item)=>{


if(item.dispenser){

return (

<div className="
flex
flex-col
">

<span className="font-medium">

Dispenser {item.dispenser.number}
 - Nozzle {item.number}

</span>


<span className="
text-xs
text-muted-foreground
">

{item.fuelType?.name}

</span>


</div>

);

}



return (

`Nozzle ${item.number}`

);


}}




placeholder="Select Nozzle"



disabled={disabled}


/>

);


};