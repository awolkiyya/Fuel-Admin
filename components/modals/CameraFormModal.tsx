"use client";

import { useState } from "react";
import {
  Loader2,
  ChevronDown,
  Brain,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import {
  CameraForm,
  CameraProtocol,
  CameraAuthType
} from "@/types/camera";



/* ================= TYPES ================= */


interface CameraFormModalProps {

  open:boolean;

  onOpenChange:(v:boolean)=>void;

  mode:"add" | "edit";

  form:CameraForm;

  isSaving:boolean;

  onPatch:(patch:Partial<CameraForm>)=>void;

  onSave:()=>void;

}



function FieldHint({
  children
}:{
  children:React.ReactNode
}){

  return (

    <p className="text-xs text-muted-foreground">
      {children}
    </p>

  );

}



/* ================= OPTIONS ================= */


const CAMERA_PROTOCOLS = [

  {
    value:"RTSP",
    label:"RTSP"
  },

  {
    value:"HTTP",
    label:"HTTP"
  },

  {
    value:"HTTPS",
    label:"HTTPS"
  },

  {
    value:"WEBRTC",
    label:"WebRTC"
  }

] satisfies {
  value:CameraProtocol;
  label:string;
}[];



const AUTH_TYPES = [

  {
    value:"NONE",
    label:"No Authentication"
  },

  {
    value:"BASIC",
    label:"Basic Authentication"
  },

  {
    value:"DIGEST",
    label:"Digest Authentication"
  },

  {
    value:"TOKEN",
    label:"Token"
  }

] satisfies {
  value:CameraAuthType;
  label:string;
}[];



/* ================= DEFAULT ================= */


export const DEFAULT_FORM:CameraForm = {

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


  resolution:"",

  fps:undefined,

  codec:"",


  aiEnabled:false,


  isActive:true

};




/* ================= COMPONENT ================= */


export function CameraFormModal({

  open,

  onOpenChange,

  mode,

  form,

  isSaving,

  onPatch,

  onSave

}:CameraFormModalProps){


  const [advancedOpen,setAdvancedOpen]
    = useState(false);



  const isValid =
    Boolean(

      form.name.trim()
      &&
      form.host.trim()
      &&
      form.streamPath.trim()

    );



  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >


      <DialogContent className="sm:min-w-xl">


        <DialogHeader>

          <DialogTitle>

            {
              mode==="add"
              ?
              "Add Camera"
              :
              "Edit Camera"
            }

          </DialogTitle>


        </DialogHeader>




        <div className="
          space-y-5
          max-h-[70vh]
          overflow-y-auto
          pr-2
        ">




          {/* ================= BASIC ================= */}


          <section className="space-y-4">


            <div>

              <Label>
                Camera Name *
              </Label>


              <Input

                placeholder="Main Gate Camera"

                value={form.name}

                onChange={(e)=>
                  onPatch({
                    name:e.target.value
                  })
                }

              />


            </div>





            <div>


              <Label>
                Protocol *
              </Label>


              <select

                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "


                value={form.protocol}


                onChange={(e)=>
                  onPatch({

                    protocol:
                      e.target.value as CameraProtocol

                  })
                }

              >


                {
                  CAMERA_PROTOCOLS.map(item=>(

                    <option
                      key={item.value}
                      value={item.value}
                    >

                      {item.label}

                    </option>

                  ))
                }


              </select>


            </div>






            <div className="grid grid-cols-2 gap-3">


              <div>

                <Label>
                  Host *
                </Label>


                <Input

                  placeholder="192.168.1.20"

                  value={form.host}

                  onChange={(e)=>
                    onPatch({
                      host:e.target.value
                    })
                  }

                />

              </div>




              <div>

                <Label>
                  Port
                </Label>


                <Input

                  type="number"

                  value={form.port ?? ""}

                  onChange={(e)=>
                    onPatch({

                      port:
                      e.target.value
                      ?
                      Number(e.target.value)
                      :
                      undefined

                    })
                  }

                />


              </div>


            </div>






            <div>

              <Label>
                Stream Path *
              </Label>


              <Input

                placeholder="/Streaming/Channels/101"

                value={form.streamPath}

                onChange={(e)=>
                  onPatch({
                    streamPath:e.target.value
                  })
                }

              />


              <FieldHint>
                Example: /video or /Streaming/Channels/101
              </FieldHint>


            </div>



          </section>






          {/* ================= AUTH ================= */}


          <section className="
            border
            rounded-md
            p-4
            space-y-3
          ">


            <Label>
              Authentication
            </Label>



            <select

              className="
                w-full
                border
                rounded-md
                px-3
                py-2
              "


              value={form.authType}


              onChange={(e)=>
                onPatch({

                  authType:
                    e.target.value as CameraAuthType

                })
              }

            >

              {
                AUTH_TYPES.map(item=>(

                  <option
                    key={item.value}
                    value={item.value}
                  >

                    {item.label}

                  </option>

                ))
              }


            </select>





            {
              form.authType !== "NONE" && (

                <div className="space-y-3">


                  <Input

                    placeholder="Username"

                    value={form.username ?? ""}

                    onChange={(e)=>
                      onPatch({
                        username:e.target.value
                      })
                    }

                  />



                  <Input

                    type="password"

                    placeholder="Password"

                    value={form.password ?? ""}

                    onChange={(e)=>
                      onPatch({
                        password:e.target.value
                      })
                    }

                  />


                </div>

              )
            }


          </section>







          {/* ================= AI CONFIG ================= */}


          <section className="
            border
            rounded-md
            p-4
          ">


            <div className="
              flex
              items-center
              justify-between
            ">


              <div className="flex gap-3 items-center">


                <Brain
                  className="w-5 h-5"
                />


                <div>


                  <Label>
                    AI Processing
                  </Label>


                  <FieldHint>
                    Enable queue detection and AI analysis
                  </FieldHint>


                </div>


              </div>





              <input

                type="checkbox"

                className="w-5 h-5"

                checked={
                  form.aiEnabled ?? false
                }


                onChange={(e)=>
                  onPatch({

                    aiEnabled:
                      e.target.checked

                  })
                }


              />



            </div>



          </section>








          {/* ================= ADVANCED ================= */}


          <Collapsible

            open={advancedOpen}

            onOpenChange={setAdvancedOpen}

          >


            <CollapsibleTrigger asChild>


              <Button

                variant="outline"

                className="
                  w-full
                  justify-between
                "

              >

                Advanced Settings


                <ChevronDown

                  className={
                    advancedOpen
                    ?
                    "rotate-180"
                    :
                    ""
                  }

                />


              </Button>


            </CollapsibleTrigger>





            <CollapsibleContent className="space-y-4 mt-4">



              <div>


                <Label>
                  Location
                </Label>


                <Input

                  placeholder="Main Gate"

                  value={form.location ?? ""}

                  onChange={(e)=>
                    onPatch({
                      location:e.target.value
                    })
                  }

                />


              </div>





              <div className="grid grid-cols-3 gap-3">


                <Input

                  placeholder="FPS"

                  type="number"

                  value={form.fps ?? ""}

                  onChange={(e)=>
                    onPatch({

                      fps:
                      e.target.value
                      ?
                      Number(e.target.value)
                      :
                      undefined

                    })
                  }

                />



                <Input

                  placeholder="Codec"

                  value={form.codec ?? ""}

                  onChange={(e)=>
                    onPatch({
                      codec:e.target.value
                    })
                  }

                />



                <Input

                  placeholder="1920x1080"

                  value={form.resolution ?? ""}

                  onChange={(e)=>
                    onPatch({
                      resolution:e.target.value
                    })
                  }

                />


              </div>


            </CollapsibleContent>


          </Collapsible>






          {/* ================= SAVE ================= */}


          <Button

            className="w-full"

            disabled={
              isSaving ||
              !isValid
            }

            onClick={onSave}

          >


            {
              isSaving

              ?

              <>

                <Loader2
                  className="
                    w-4 h-4
                    mr-2
                    animate-spin
                  "
                />

                Saving...

              </>


              :

              mode==="add"
              ?
              "Create Camera"
              :
              "Update Camera"

            }


          </Button>



        </div>


      </DialogContent>


    </Dialog>

  );

}