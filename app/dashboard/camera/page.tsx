"use client";

import { useState, useCallback } from "react";
import {
  Camera,
  Plus,
  RefreshCcw,
} from "lucide-react";

import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  useCameras,
  useCreateCamera,
  useTestCamera,
  useToggleCameraAI,
  useToggleCameraStatus,
  useUpdateCamera,
} from "@/hooks/station/useCameras";

import { RootState } from "@/lib/store";

import {
  Camera as CameraType,
  CameraForm,
} from "@/types/camera";

import { CameraCard } from "@/components/cards/CameraCard";

import { CameraFormModal } from "@/components/modals/CameraFormModal";



/* ================= TYPES ================= */


type ActionKey =
  | "test"
  | "ai"
  | "status";


type ActionMap =
  Partial<Record<ActionKey, boolean>>;


type TestResult = {

  success:boolean;

  message:string;

  latency?:number;

};




/* ================= DEFAULT FORM ================= */


const DEFAULT_FORM:CameraForm = {

  name:"",

  stationId:"",


  protocol:"RTSP",

  host:"",

  port:554,

  streamPath:"",


  authType:"NONE",

  username:"",

  password:"",


  location:"",


  fps:undefined,

  codec:"",

  resolution:"",


  aiEnabled:false,

  isActive:true,

};




/* ================= ACTION HOOK ================= */


function useCameraActions(){


  const [loadingMap,setLoadingMap]
    = useState<Record<string,ActionMap>>({});


  const [testResults,setTestResults]
    = useState<Record<string,TestResult>>({});



  const setLoading = useCallback(

    (
      id:string,
      action:ActionKey,
      value:boolean
    )=>{

      setLoadingMap(prev=>({

        ...prev,

        [id]:{

          ...prev[id],

          [action]:value

        }

      }));

    },

    []

  );



  const isLoading = (
    id:string,
    action:ActionKey
  )=>{

    return !!loadingMap[id]?.[action];

  };



  const setResult = useCallback(

    (
      id:string,
      result:TestResult
    )=>{

      setTestResults(prev=>({

        ...prev,

        [id]:result

      }));

    },

    []

  );



  return {

    isLoading,

    setLoading,

    testResults,

    setResult

  };

}




/* ================= FORM HOOK ================= */


function useCameraForm(
  stationId:string
){


  const [open,setOpen]
    = useState(false);


  const [mode,setMode]
    = useState<"add"|"edit">("add");


  const [isSaving,setIsSaving]
    = useState(false);



  const [form,setForm]
    = useState<CameraForm>({

      ...DEFAULT_FORM,

      stationId

    });



  const patchForm = (
    patch:Partial<CameraForm>
  )=>{

    setForm(prev=>({

      ...prev,

      ...patch

    }));

  };



  const openAdd = ()=>{

    setMode("add");

    setForm({

      ...DEFAULT_FORM,

      stationId

    });

    setOpen(true);

  };



  const openEdit = (
    cam: CameraType
  ) => {
  
    setMode("edit");
  
  
    setForm({
  
      id: cam.id,
  
  
      // ================= BASIC =================
  
      name: cam.name,
  
      stationId: cam.stationId,
  
  
  
      // ================= CONNECTION =================
  
      protocol: cam.protocol,
  
      host: cam.host,
  
      port: cam.port,
  
  
      // IMPORTANT
      // Prisma field: path
      // Form field: streamPath
      streamPath: cam.path,
  
  
  
  
      // ================= AUTH =================
  
      authType: cam.authType,
  
      username: cam.username ?? "",
  
      password: "",
  
  
  
  
      // ================= LOCATION =================
  
      location: cam.location ?? "",
  
      latitude: cam.latitude ?? undefined,
  
      longitude: cam.longitude ?? undefined,
  
  
  
  
      // ================= STREAM =================
  
      resolution: cam.resolution ?? "",
  
      fps: cam.fps ?? undefined,
  
      codec: cam.codec ?? "",
  
  
  
  
      // ================= AI =================
  
      aiEnabled: cam.aiEnabled,
  
  
      queueZone:
        cam.queueZone ?? undefined,
  
  
      thresholds:
        cam.thresholds ?? undefined,
  
  
  
  
      // ================= CONTROL =================
  
      isActive: cam.isActive
  
    });
  
  
    setOpen(true);
  
  };



  return {

    open,

    setOpen,

    mode,

    form,

    patchForm,

    openAdd,

    openEdit,

    isSaving,

    setIsSaving

  };

}





/* ================= SKELETON ================= */


function CameraCardSkeleton(){

  return (

    <Card className="h-40 animate-pulse bg-muted"/>

  );

}



function EmptyState(){

  return (

    <div className="
      col-span-2
      flex
      flex-col
      items-center
      justify-center
      py-16
      text-muted-foreground
      gap-2
    ">

      <Camera className="w-10 h-10 opacity-30"/>

      <p className="text-sm">
        No cameras found. Add one to get started.
      </p>


    </div>

  );

}





/* ================= PAGE ================= */


export default function CameraPage(){


  const stationId =
    useSelector(
      (state:RootState)=>
        state.auth.user?.stationId ?? ""
    );



  const {
    data,
    isLoading,
    refetch

  } = useCameras();



  const createCamera =
    useCreateCamera();



  const updateCamera =
    useUpdateCamera();



  const toggleAI =
    useToggleCameraAI();



  const toggleStatus =
    useToggleCameraStatus();



  const testCamera =
    useTestCamera();



  const cameras:CameraType[] =
    data?.data ?? [];



  const {

    isLoading:isActionLoading,

    setLoading,

    testResults,

    setResult

  } = useCameraActions();




  const {

    open,

    setOpen,

    mode,

    form,

    patchForm,

    openAdd,

    openEdit,

    isSaving,

    setIsSaving

  } = useCameraForm(stationId);






  const handleTest = useCallback(
    async (id: string) => {
      setLoading(id, "test", true);
  
      try {
        const res = await testCamera.mutateAsync(id);
        const data = res?.data;
        const success = data?.status?.toUpperCase() === "ONLINE";

        console.log(data);
  
        setResult(id, {
          success,
          message:
            res?.message ??
            (success ? "Camera stream is online" : "Camera stream is offline"),
          latency: data?.latencyMs,
        });
      } catch {
        setResult(id, {
          success: false,
          message: "Stream unavailable",
        });
      } finally {
        setLoading(id, "test", false);
      }
    },
    [testCamera, setLoading, setResult]
  );





  const handleToggleAI =
    useCallback(

      async(cam:CameraType)=>{


        setLoading(
          cam.id,
          "ai",
          true
        );


        try{

          await toggleAI.mutateAsync({

            id:cam.id,

            aiEnabled:
              !cam.aiEnabled

          });


        }
        finally{

          setLoading(
            cam.id,
            "ai",
            false
          );

        }


      },

      [
        toggleAI,
        setLoading
      ]

    );







  const handleToggleStatus =
    useCallback(

      async(cam:CameraType)=>{


        setLoading(
          cam.id,
          "status",
          true
        );


        try{

          await toggleStatus.mutateAsync({

            id:cam.id,

            status:
              cam.status === "ONLINE"
              ?
              "OFFLINE"
              :
              "ONLINE"

          });


        }
        finally{

          setLoading(
            cam.id,
            "status",
            false
          );

        }


      },

      [
        toggleStatus,
        setLoading
      ]

    );







  const handleSave =
    useCallback(

      async()=>{


        if(

          !form.name.trim()
          ||
          !form.host.trim()
          ||
          !form.streamPath.trim()
          ||
          !stationId

        ){

          return;

        }



        setIsSaving(true);



        try{


          if(mode==="add"){


            await createCamera.mutateAsync({

              ...form,

              stationId

            });


          }
          else{


            await updateCamera.mutateAsync({

              id:form.id!,

              data:form

            });


          }



          setOpen(false);


        }
        finally{

          setIsSaving(false);

        }


      },

      [
        form,
        stationId,
        mode,
        createCamera,
        updateCamera,
        setOpen,
        setIsSaving
      ]

    );






  return (

    <div className="p-6 space-y-6 max-w-6xl mx-auto">


      <div className="flex justify-between items-center">


        <div>

          <h1 className="text-2xl font-semibold flex items-center gap-2">

            <Camera className="w-6 h-6"/>

            Camera Dashboard

          </h1>


          <p className="text-sm text-muted-foreground">

            Monitor & manage all cameras

          </p>


        </div>



        <div className="flex gap-2">


          <Button
            variant="outline"
            onClick={()=>refetch()}
          >

            <RefreshCcw className="w-4 h-4 mr-2"/>

            Refresh

          </Button>



          <Button
            onClick={openAdd}
          >

            <Plus className="w-4 h-4 mr-2"/>

            Add

          </Button>


        </div>


      </div>




      <Separator />




      <div className="grid md:grid-cols-2 gap-5">


        {
          isLoading

          ?

          Array.from({
            length:4
          }).map((_,i)=>(

            <CameraCardSkeleton
              key={i}
            />

          ))


          :

          cameras.length===0

          ?

          <EmptyState />


          :

          cameras.map(cam=>(


            <CameraCard

              key={cam.id}

              cam={cam}

              testResult={
                testResults[cam.id]
              }


              isTestLoading={
                isActionLoading(
                  cam.id,
                  "test"
                )
              }


              isStatusLoading={
                isActionLoading(
                  cam.id,
                  "status"
                )
              }


              isAILoading={
                isActionLoading(
                  cam.id,
                  "ai"
                )
              }


              onTest={()=>
                handleTest(cam.id)
              }


              onToggleStatus={()=>
                handleToggleStatus(cam)
              }


              onToggleAI={()=>
                handleToggleAI(cam)
              }


              onEdit={()=>
                openEdit(cam)
              }


            />


          ))

        }


      </div>





      <CameraFormModal

        open={open}

        onOpenChange={setOpen}

        mode={mode}

        form={form}

        isSaving={isSaving}

        onPatch={patchForm}

        onSave={handleSave}

      />



    </div>

  );

}