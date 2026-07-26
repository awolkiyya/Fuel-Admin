"use client"

import {
  Camera as CameraIcon,
  MapPin,
  Cpu,
  Maximize,
  Radio,
  X,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useStation } from "@/hooks/station/useStations"



type Camera = {
  id: string

  name: string

  protocol: "RTSP" | "HTTP" | "WEBRTC"

  host: string
  port: number
  path: string

  streamUrl: string

  location?: string | null

  status: "online" | "offline" | "testing"

  aiEnabled?: boolean
}




export default function StationCameraPage() {


  const params = useParams()

  const stationId =
    params.id as string




  const {
    data: station,
    isLoading,
    isError,

  } = useStation(stationId)



  const [selectedCamera,setSelectedCamera] =
    useState<Camera | null>(null)




  // ESC CLOSE FULLSCREEN

  useEffect(()=>{


    const handler = (e:KeyboardEvent)=>{

      if(e.key==="Escape"){

        setSelectedCamera(null)

      }

    }


    window.addEventListener(
      "keydown",
      handler
    )


    return ()=>{

      window.removeEventListener(
        "keydown",
        handler
      )

    }


  },[])





  if(isLoading){

    return (
      <div className="p-8 text-muted-foreground">
        Loading cameras...
      </div>
    )

  }




  if(isError || !station){

    return (
      <div className="p-8 text-destructive">
        Failed loading cameras
      </div>
    )

  }





  const cameras:Camera[] =
    station.cameras ?? []





  return (

    <>

    <div
      className="
        min-h-screen
        bg-muted/20
        p-6
        space-y-8
      "
    >



      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Live Surveillance
          </h1>


          <p
            className="
              text-muted-foreground
            "
          >
            {station.name}
          </p>

        </div>



        <Badge
          variant="outline"
          className="
            px-5
            py-2
          "
        >

          {cameras.length} Cameras

        </Badge>


      </div>






      {
        cameras.length===0 ? (

          <div
            className="
              h-[600px]
              flex
              flex-col
              justify-center
              items-center
            "
          >

            <CameraIcon
              className="
                h-24
                w-24
                opacity-30
              "
            />

            <p className="mt-5 text-muted-foreground">
              No cameras connected
            </p>


          </div>



        ) : (


          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              2xl:grid-cols-3
              gap-8
            "
          >



          {
            cameras.map((cam)=>(


              <div
                key={cam.id}
                onDoubleClick={()=>setSelectedCamera(cam)}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  bg-black
                  shadow-xl
                  border
                  min-h-[450px]
                  cursor-pointer
                "
              >



                {/* STREAM */}


                {
                  cam.status==="online" ? (

                    <img

                      src={`/api/cameras/${cam.id}/stream`}

                      alt={cam.name}

                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "

                    />

                  ) : (

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        justify-center
                        items-center
                        text-muted-foreground
                      "
                    >
                      Camera Offline
                    </div>

                  )

                }




                {/* OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/20
                    to-black/40
                  "
                />





                {/* TOP */}

                <div
                  className="
                    absolute
                    top-4
                    left-4
                    right-4
                    flex
                    justify-between
                  "
                >

                  <Badge
                    className="
                      bg-black/60
                      backdrop-blur
                    "
                  >

                    <Radio
                      className="
                        h-3
                        w-3
                        mr-1
                        text-green-400
                      "
                    />

                    {cam.status}

                  </Badge>



                  <Badge
                    className="
                      bg-black/60
                      backdrop-blur
                    "
                  >

                    {cam.protocol}

                  </Badge>


                </div>






                {/* BOTTOM INFO */}


                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-6
                    text-white
                  "
                >


                  <div
                    className="
                      flex
                      justify-between
                      items-end
                    "
                  >


                    <div>


                      <h2
                        className="
                          text-2xl
                          font-bold
                        "
                      >
                        {cam.name}
                      </h2>



                      {
                        cam.location && (

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                              opacity-80
                            "
                          >

                            <MapPin className="h-4 w-4"/>

                            {cam.location}

                          </div>

                        )
                      }




                      <div
                        className="
                          flex
                          gap-5
                          mt-3
                          text-sm
                        "
                      >

                        <span className="flex gap-1 items-center">

                          <Cpu className="h-4 w-4"/>

                          AI:
                          {cam.aiEnabled?"ON":"OFF"}

                        </span>


                        <span>
                          {cam.protocol}
                        </span>


                      </div>


                    </div>





                    <Button

                      size="icon"

                      variant="secondary"

                      onClick={()=>
                        setSelectedCamera(cam)
                      }

                      className="
                        rounded-full
                        bg-white/20
                        hover:bg-white/40
                        backdrop-blur
                      "

                    >

                      <Maximize/>

                    </Button>



                  </div>


                </div>



              </div>


            ))
          }



          </div>


        )

      }


    </div>







    {/* FULLSCREEN VIEWER */}


    {
      selectedCamera && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black
            flex
            flex-col
          "
        >



          <img

            src={
              `/api/cameras/${selectedCamera.id}/stream`
            }

            alt={selectedCamera.name}

            className="
              absolute
              inset-0
              h-full
              w-full
              object-contain
            "

          />



          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black
              via-transparent
              to-black/30
            "
          />





          <div
            className="
              absolute
              top-6
              left-6
              right-6
              flex
              justify-between
              items-center
              text-white
            "
          >

            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                "
              >
                {selectedCamera.name}
              </h1>


              <p>
                {selectedCamera.protocol}
                {" • "}
                {selectedCamera.status}
              </p>


            </div>




            <Button
              size="icon"
              variant="secondary"
              onClick={()=>
                setSelectedCamera(null)
              }
            >

              <X/>

            </Button>


          </div>


        </div>

      )
    }


    </>

  )

}