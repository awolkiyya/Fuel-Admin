"use client";

import React from "react";

import { useParams, useRouter } from "next/navigation";

import {
  FileText,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  Copy,
  CheckCircle2,
  Activity,
  Paperclip,
  ArrowLeft,
  XCircle,
} from "lucide-react";


import { Button } from "@/components/ui/button";

import { StatusBadge } from "@/components/badges/StatusBadge";

import { DocumentPreview } from "@/components/cards/DocumentPreview";


import {
  BusinessLicenseRequestType,
  BusinessLicenseStatus
} from "@/types/business-license";


import {
  useBusinessLicense,
  useApproveBusinessLicense,
  useRejectBusinessLicense,
} from "@/hooks/business-license/useBusinessLicenses";


import { Panel } from "@/components/Panel";
import { InfoCell } from "@/components/InfoCell";
import { TimelineItem } from "@/components/TimelineItem";
import { getFileUrl } from "@/utils/fileUrl";




function fmt(raw?:string){

  if(!raw)
    return "N/A";

  const d=new Date(raw);

  return isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString(
      "en-GB",
      {
        day:"2-digit",
        month:"short",
        year:"numeric"
      }
    );
}



function fmtDateTime(raw?:string){

  if(!raw)
    return "N/A";

  const d=new Date(raw);

  return isNaN(d.getTime())
    ? raw
    : d.toLocaleString(
      "en-GB",
      {
        day:"2-digit",
        month:"short",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
      }
    );
}



function formatRequestType(
  type?: BusinessLicenseRequestType
) {

  if (!type)
    return "N/A";

  return type === "NEW"
    ? "New License"
    : "Renewal";

}



const STATUS_COLOR:Record<
BusinessLicenseStatus,
string
>={

  PENDING:
  "bg-amber-50 text-amber-800 border-amber-200",

  ACTIVE:
  "bg-green-50 text-green-800 border-green-200",

  REJECTED:
  "bg-red-50 text-red-800 border-red-200",

  EXPIRED:
  "bg-gray-100 text-gray-600 border-gray-200",

};






export default function BusinessLicenseDetailPage(){


  const params = useParams();

  const router = useRouter();



  const id =
    params.id as string;



  const {
    data:license,
    isLoading,
    isError,

  } = useBusinessLicense(id);



  const approveMutation =
    useApproveBusinessLicense();



  const rejectMutation =
    useRejectBusinessLicense();




  const [copied,setCopied]=React.useState(false);

  const [copiedUserId,setCopiedUserId]=React.useState(false);






  if(isLoading){

    return (
      <div className="p-6">
        Loading license details...
      </div>
    )

  }



  if(isError || !license){

    return (
      <div className="p-6">
        Business license not found.
      </div>
    )

  }





  const isPending =
    license.status === "PENDING";






  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending;






  const handleCopy = async()=>{

    await navigator.clipboard.writeText(
      license.licenseNumber
    );

    setCopied(true);


    setTimeout(
      ()=>setCopied(false),
      1500
    );

  };






  const handleCopyUserId=async()=>{

    await navigator.clipboard.writeText(
      license.userId
    );


    setCopiedUserId(true);


    setTimeout(
      ()=>setCopiedUserId(false),
      1500
    );

  };







  const handleApprove = ()=>{

    approveMutation.mutate(
      {
        id: license.id,
      }
    );

  };





  const handleReject = ()=>{


    const reason =
      window.prompt(
        "Enter rejection reason"
      );


    if(!reason)
      return;



    rejectMutation.mutate(
      {
        id:license.id,
        reason,
      }
    );


  };






return (

<div className="min-h-screen bg-muted/30 flex flex-col">



<header className="sticky top-0 z-20 bg-background border-b px-6 py-3">

<div className="max-w-6xl mx-auto flex justify-between items-center">


<div className="flex items-center gap-3">


<button
onClick={()=>router.back()}
className="p-1.5 rounded-md hover:bg-muted"
>

<ArrowLeft className="h-4 w-4"/>

</button>



<FileText className="h-4 w-4"/>



<span className="text-sm font-semibold">
Business License
</span>



<span className="font-mono text-sm">
/
{license.licenseNumber}
</span>


</div>




<span
className={`text-xs px-3 py-1 rounded-full border ${
STATUS_COLOR[license.status]
}`}
>
{license.status}
</span>



</div>

</header>





<main className="flex-1 px-6 py-6">


<div className="max-w-4xl mx-auto space-y-5">



<div className="bg-background border rounded-xl px-6 py-5">


<p className="text-xs text-muted-foreground">
License number
</p>



<div className="flex items-center gap-2">


<h1 className="text-2xl font-bold font-mono">
{license.licenseNumber}
</h1>



<button onClick={handleCopy}>

{
copied
?
<CheckCircle2 className="text-green-500"/>
:
<Copy/>
}

</button>


</div>



<StatusBadge
status={license.status}
/>


</div>






<div className="grid lg:grid-cols-3 gap-5">


<div className="lg:col-span-2 space-y-5">



<Panel
icon={ShieldCheck}
title="License Information"
>


<div className="grid sm:grid-cols-2 gap-3">


<InfoCell
icon={FileText}
label="License Number"
value={license.licenseNumber}
/>



<InfoCell
icon={Activity}
label="Request Type"
value={formatRequestType(
license.requestType
)}
/>



<InfoCell
icon={Calendar}
label="Expiry"
value={fmt(
license.expiryDate||""
)}
/>



<InfoCell
icon={Activity}
label="Status"
value={license.status}
/>



<InfoCell
icon={Paperclip}
label="Document"
value={
license.documentUrl
?
"Uploaded"
:
"Missing"
}
/>



</div>

</Panel>





<Panel
icon={FileText}
title="Document Preview"
>


<DocumentPreview

url={
getFileUrl(
license.documentUrl
)
}

title="Business License Document"

emptyIcon={
<Paperclip className="h-6 w-6 text-muted-foreground opacity-40"/>
}

emptyText="No document uploaded"

/>


</Panel>



</div>







<div className="space-y-5">


<Panel
icon={User}
title="Owner"
>


<div className="flex gap-3">


<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">

{
license.user?.full_name
?.slice(0,2)
.toUpperCase()
}

</div>



<div>

<p className="font-semibold">
{license.user?.full_name}
</p>


<p className="text-xs">
{license.user?.phone}
</p>


</div>


</div>


</Panel>





<Panel
icon={Clock}
title="Audit Trail"
>


<TimelineItem
label="Created"
value={
fmtDateTime(
license.createdAt
)
}
/>


<TimelineItem
label="Updated"
value={
fmtDateTime(
license.updatedAt
)
}
/>


</Panel>



</div>


</div>



</div>


</main>







<footer className="sticky bottom-0 bg-background border-t px-6 py-3">


<div className="flex justify-end gap-2">


<Button
variant="outline"
onClick={()=>router.back()}
>
Close
</Button>





{
isPending &&

<>


<Button

variant="destructive"

disabled={isProcessing}

onClick={handleReject}

>

<XCircle className="w-4 h-4 mr-1"/>

{
rejectMutation.isPending
?
"Rejecting..."
:
"Reject"
}

</Button>





<Button

disabled={isProcessing}

onClick={handleApprove}

>

<CheckCircle2 className="w-4 h-4 mr-1"/>


{
approveMutation.isPending
?
"Approving..."
:
"Approve"
}


</Button>


</>

}



</div>


</footer>



</div>

)

}