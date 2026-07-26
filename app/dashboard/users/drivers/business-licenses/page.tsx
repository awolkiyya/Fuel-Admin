"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { DataTablePagination } from "@/components/tables/data-pagination";


import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Check,
  X,
  Search,
  Filter,
} from "lucide-react";


import { useRouter } from "next/navigation";


import {
  BusinessLicense,
  BusinessLicenseStatus,
  BusinessLicenseRequestType,
} from "@/types/business-license";
import { useBusinessLicenses } from "@/hooks/business-license/useBusinessLicenses";



// ================= STATUS BADGE =================

const StatusBadge = ({
  status,
}: {
  status: BusinessLicenseStatus;
}) => {


  const map:any = {

    PENDING:"secondary",

    ACTIVE:"default",

    REJECTED:"destructive",

    EXPIRED:"outline",

  };


  const icons:any = {


    PENDING:
      <Clock className="w-3 h-3"/>,

    ACTIVE:
      <CheckCircle className="w-3 h-3"/>,

    REJECTED:
      <XCircle className="w-3 h-3"/>,

    EXPIRED:
      <AlertTriangle className="w-3 h-3"/>,
  };


  return (

    <Badge
      variant={map[status]}
      className="flex items-center gap-1"
    >

      {icons[status]}

      {status}

    </Badge>

  );

};




// ================= ACTIONS =================


const ActionButtons = ({
  license,
  onView,
}:{
  license:BusinessLicense;
  onView:(license:BusinessLicense)=>void;
})=>{


return (

<div className="flex justify-end gap-2">


<Button
 size="sm"
 variant="outline"
 onClick={()=>onView(license)}
>

<Eye className="w-4 h-4 mr-1"/>

View

</Button>



{
license.status === "PENDING" &&

<>

<Button size="sm">

<Check className="w-4 h-4 mr-1"/>

Approve

</Button>


<Button
 size="sm"
 variant="destructive"
>

<X className="w-4 h-4 mr-1"/>

Reject

</Button>

</>

}


</div>

)

}




export default function BusinesslicensePage(){


const router = useRouter();



const [page,setPage]=useState(1);

const [limit,setLimit]=useState(10);


const [search,setSearch]=useState("");

const [status,setStatus]=
useState<BusinessLicenseStatus | undefined>();


const [requestType,setRequestType]=
useState<BusinessLicenseRequestType | undefined>();




const {
 data,
 isLoading,
}=useBusinessLicenses({

 page,

 limit,

 search,

 status,

 requestType,

});





const licenses =
data?.data ?? [];



const meta =
data?.meta;



const summary =
data?.summary;





return (

<div className="p-6 space-y-6">



{/* ================= SUMMARY ================= */}


<div className="grid grid-cols-1 md:grid-cols-5 gap-4">



<Card>

<CardContent className="p-4 flex gap-3 items-center">

<FileText/>

<div>

<p className="text-sm text-muted-foreground">
Total
</p>

<h2 className="text-xl font-bold">
{summary?.total ?? 0}
</h2>


</div>

</CardContent>

</Card>




<Card>

<CardContent className="p-4 flex gap-3 items-center">

<Clock/>

<div>

<p className="text-sm text-muted-foreground">
Pending
</p>

<h2 className="text-xl font-bold">
{summary?.pending ?? 0}
</h2>


</div>

</CardContent>

</Card>




<Card>

<CardContent className="p-4 flex gap-3 items-center">

<CheckCircle/>

<div>

<p className="text-sm text-muted-foreground">
Active
</p>

<h2 className="text-xl font-bold">
{summary?.active ?? 0}
</h2>


</div>

</CardContent>

</Card>




<Card>

<CardContent className="p-4 flex gap-3 items-center">

<XCircle/>

<div>

<p className="text-sm text-muted-foreground">
Rejected
</p>

<h2 className="text-xl font-bold">
{summary?.rejected ?? 0}
</h2>


</div>

</CardContent>

</Card>




<Card>

<CardContent className="p-4 flex gap-3 items-center">

<AlertTriangle/>

<div>

<p className="text-sm text-muted-foreground">
Expired
</p>

<h2 className="text-xl font-bold">
{summary?.expired ?? 0}
</h2>


</div>

</CardContent>

</Card>



</div>





{/* ================= FILTER ================= */}


<Card>


<CardHeader>

<CardTitle>
Business Licenses
</CardTitle>


<CardDescription>
Manage license requests and approvals
</CardDescription>


</CardHeader>


<CardContent className="flex gap-3 flex-wrap">



<div className="relative">

<Search className="absolute left-2 top-2.5 w-4 h-4"/>

<Input

className="pl-8"

placeholder="Search license/user"

value={search}

onChange={(e)=>
{
setPage(1);
setSearch(e.target.value);
}
}

/>

</div>




<Select
value={status}
onValueChange={(v)=>
{
setPage(1);
setStatus(
v==="all"
? undefined
: v as BusinessLicenseStatus
);
}}
>


<SelectTrigger>

<SelectValue placeholder="Status"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="all">
All
</SelectItem>

<SelectItem value="PENDING">
Pending
</SelectItem>


<SelectItem value="ACTIVE">
Active
</SelectItem>


<SelectItem value="REJECTED">
Rejected
</SelectItem>


<SelectItem value="EXPIRED">
Expired
</SelectItem>


</SelectContent>


</Select>





<Select
value={requestType}
onValueChange={(v)=>
setRequestType(
v==="all"
? undefined
: v as BusinessLicenseRequestType
)
}
>

<SelectTrigger>

<SelectValue placeholder="Request type"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="all">
All
</SelectItem>


<SelectItem value="NEW">
New License
</SelectItem>


<SelectItem value="RENEW">
Renewal
</SelectItem>


</SelectContent>


</Select>




</CardContent>


</Card>






{/* ================= TABLE ================= */}


<Card>


<CardContent className="p-0">


<Table>


<TableHeader>

<TableRow>

<TableHead>
#
</TableHead>


<TableHead>
License
</TableHead>


<TableHead>
User
</TableHead>


<TableHead>
Type
</TableHead>


<TableHead>
Expiry
</TableHead>


<TableHead>
Status
</TableHead>


<TableHead className="text-right">
Actions
</TableHead>


</TableRow>

</TableHeader>





<TableBody>


{
isLoading &&

<TableRow>

<TableCell colSpan={7}>
Loading...
</TableCell>

</TableRow>

}




{
licenses.map((license,index)=>(


<TableRow key={license.id}>


<TableCell>
{
((page-1)*limit)+index+1
}
</TableCell>



<TableCell>
{license.licenseNumber}
</TableCell>



<TableCell>

<div className="flex gap-2 items-center">

<Users className="w-4 h-4"/>

{license.user?.full_name}

</div>

</TableCell>




<TableCell>

{license.requestType}

</TableCell>



<TableCell>

{
license.expiryDate
?
new Date(
license.expiryDate
).toLocaleDateString()
:
"—"
}

</TableCell>




<TableCell>

<StatusBadge
status={license.status}
/>

</TableCell>




<TableCell>

<ActionButtons

license={license}

onView={(item)=>
router.push(
`/dashboard/users/drivers/business-licenses/${item.id}`
)
}

/>

</TableCell>



</TableRow>


))

}



</TableBody>



</Table>


</CardContent>


</Card>





<DataTablePagination

page={meta?.page ?? 1}

pageSize={meta?.limit ?? 10}

total={meta?.total ?? 0}


onPageChange={(p)=>
setPage(p)
}


onPageSizeChange={(l)=>
{
setLimit(l);
setPage(1);
}
}

/>



</div>

)

}