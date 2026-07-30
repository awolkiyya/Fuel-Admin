"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Check,
  ChevronsUpDown,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";



/* =========================================================
   TYPES
========================================================= */


interface AsyncDropdownProps<
  T,
  V extends string | number
> {

  value: V | null;


  onChange:
  (
    value: V,
    item: T
  ) => void;



  fetchData:
  (
    params:{
      search:string;
      page:number;
      pageSize:number;
    }
  ) => Promise<{
    data:T[];
    total?:number;
  }>;



  fetchItemById?:
  (
    id:V
  ) => Promise<T | null>;



  /**
   * Simple field display
   * Example:
   * displayField="name"
   */
  displayField?: keyof T;



  valueField:keyof T;



  /**
   * Advanced custom display
   *
   * Example:
   *
   * renderItem={(item)=>(
   *   `${item.dispenser.number}
   *    - Nozzle ${item.number}`
   * )}
   */
  renderItem?:
  (
    item:T
  ) => React.ReactNode;



  placeholder?:string;


  pageSize?:number;


  debounceTime?:number;


  disabled?:boolean;

}




/* =========================================================
   HELPERS
========================================================= */


const truncateText = (
  text:string,
  max:number = 60
)=>{

  if(!text)
    return "";


  return text.length > max
    ? text.slice(0,max)+"..."
    : text;

};






/* =========================================================
   COMPONENT
========================================================= */


export const AsyncDropdown =
<
 T extends Record<string,any>,
 V extends string | number

>
({

 value,

 onChange,

 fetchData,

 fetchItemById,

 displayField,

 valueField,

 renderItem,

 placeholder="Select...",

 pageSize=1000,

 debounceTime=300,

 disabled=false,

}:AsyncDropdownProps<T,V>)=>{


const [open,setOpen]=useState(false);


const [options,setOptions]=useState<T[]>([]);


const [search,setSearch]=useState("");


const [page,setPage]=useState(1);


const [total,setTotal]=useState<number|null>(null);


const [loading,setLoading]=useState(false);


const [error,setError]=useState<string|null>(null);


const [selectedItem,setSelectedItem]=useState<T|null>(null);



const mountedRef =
useRef(true);





const getLabel = (
 item:T
)=>{


 if(renderItem)
   return renderItem(item);



 if(displayField)
   return String(
     item[displayField]
   );


 return "";

};





const resolvedSelected =

selectedItem ||

options.find(
 opt =>
 opt[valueField] === value
)

|| null;







/* =========================================================
   LOAD DATA
========================================================= */


const loadOptions =
useCallback(

async(
 pageNum:number,
 searchText:string,
 reset=false

)=>{


setLoading(true);

setError(null);


try{


const res =
await fetchData({

 search:searchText,

 page:pageNum,

 pageSize,

});



if(!mountedRef.current)
 return;



setOptions(
prev =>
reset
?
(res.data ?? [])

:

[
 ...prev,
 ...(res.data ?? [])
]

);



setPage(pageNum);


setTotal(
 res.total ?? null
);



}

catch(err){

console.error(err);

setError(
"Failed to load data"
);

}


finally{


if(mountedRef.current)
 setLoading(false);


}



},

[
 fetchData,
 pageSize
]

);






/* =========================================================
   SEARCH
========================================================= */


useEffect(()=>{


mountedRef.current=true;


const timer =
setTimeout(()=>{


loadOptions(
1,
search,
true
);


},debounceTime);



return()=>{

clearTimeout(timer);

mountedRef.current=false;

};


},
[
search,
loadOptions,
debounceTime
]
);







/* =========================================================
   LOAD SELECTED ITEM
========================================================= */


useEffect(()=>{


if(
 value==null ||
 !fetchItemById
)
return;



let active=true;



(async()=>{


try{


const item =
await fetchItemById(value);



if(
 !active ||
 !item
)
return;



setSelectedItem(item);



setOptions(prev=>{


const exists =
prev.some(
 p =>
 p[valueField] === item[valueField]
);


return exists
?
prev
:
[
 item,
 ...prev
];

});


}

catch(err){

console.error(err);

}



})();



return()=>{

active=false;

};


},
[
 value,
 fetchItemById,
 valueField
]
);








/* =========================================================
   SCROLL
========================================================= */


const handleScroll =
(
 e:React.UIEvent<HTMLDivElement>
)=>{


const el =
e.currentTarget;



if(

el.scrollTop +
el.clientHeight >=
el.scrollHeight - 20

&&

!loading

&&

total!==null

&&

options.length < total

){


loadOptions(
page+1,
search
);


}


};






/* =========================================================
   SELECT
========================================================= */


const handleSelect =
(
 item:T
)=>{


const val =
item[valueField] as V;


setSelectedItem(item);


onChange(
val,
item
);


setOpen(false);


};






/* =========================================================
   UI
========================================================= */


return (

<Popover
open={open}
onOpenChange={setOpen}
>


<PopoverTrigger asChild>


<Button

variant="outline"

role="combobox"

disabled={disabled}

className="
h-11
w-full
justify-between
gap-2
px-3
text-left
rounded-sm
"

>


<span className="
truncate
text-sm
font-medium
">


{
resolvedSelected

?

renderItem
  ? renderItem(resolvedSelected)
  : truncateText(
      String(
        getLabel(resolvedSelected)
      )
    )

:

placeholder

}


</span>



<ChevronsUpDown
className="
h-4
w-4
shrink-0
opacity-50
"
/>


</Button>


</PopoverTrigger>





<PopoverContent

align="start"

sideOffset={6}

className="
w-[var(--radix-popover-trigger-width)]
min-w-[280px]
p-0
"

>


<Command>


<div className="border-b p-2">


<CommandInput

placeholder="Search..."

value={search}

onValueChange={setSearch}

/>


</div>





<CommandList>


<ScrollArea

className="max-h-72"

onScroll={handleScroll}

>


{

loading &&
options.length===0 &&

<div className="
flex
items-center
justify-center
gap-2
p-4
text-sm
text-muted-foreground
">

<Loader2
className="
h-4
w-4
animate-spin
"
/>

Loading...

</div>

}





{

error &&

<div className="
flex
items-center
gap-2
p-4
text-sm
text-red-500
">

<AlertCircle
className="h-4 w-4"
/>

{error}

</div>

}





<CommandGroup>


{

options.map(item=>{


const selected =
item[valueField]===value;



return (

<CommandItem

key={
String(
item[valueField]
)
}

onSelect={()=>
handleSelect(item)
}


className="
flex
items-start
gap-3
py-3
text-sm
"

>


<Check

className={cn(

"mt-0.5 h-4 w-4",

selected
?
"opacity-100"
:
"opacity-0"

)}

/>



<span className="
line-clamp-2
break-words
">

{
getLabel(item)
}

</span>



</CommandItem>


);


})

}



</CommandGroup>





{

loading &&
options.length>0 &&

<div className="
flex
items-center
justify-center
gap-2
p-3
text-xs
text-muted-foreground
">

<Loader2
className="
h-3.5
w-3.5
animate-spin
"
/>


Loading more...

</div>


}



</ScrollArea>


</CommandList>



</Command>


</PopoverContent>


</Popover>


);


};