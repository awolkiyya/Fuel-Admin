import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"

import { stationService } from "@/services/station.service"
import { FuelItem, StationQuery } from "@/types/station"
import { StationTransactionQuery } from "@/types/station-transaction"

/* -----------------------------
   GET STATIONS
------------------------------ */
export const useStations = (params: StationQuery) => {
  return useQuery({
    queryKey: ["stations", params],
    queryFn: () => stationService.getStations(params),
  })
}


/* -----------------------------
   GET SINGLE STATION
------------------------------ */
export const useStation = (
  stationId?: string
) => {

  return useQuery({

    queryKey: [
      "station",
      stationId
    ],

    queryFn: () =>
      stationService.getStationById(
        stationId!
      ),

    enabled: !!stationId

  })

}

/* -----------------------------
   CREATE
------------------------------ */
export const useCreateStation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) =>
      stationService.createStation(data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stations"] })

      toast.success("Station created successfully 🚀")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to create station"
      )
    },
  })
}

/* -----------------------------
   UPDATE
------------------------------ */
export const useUpdateStation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: FormData
    }) => stationService.updateStation(id, data),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["stations"] })
      qc.invalidateQueries({
        queryKey: ["station", variables.id],
      })

      toast.success("Station updated successfully ✨")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to update station"
      )
    },
  })
}

/* -----------------------------
   DELETE / DEACTIVATE
------------------------------ */
export const useDeleteStation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: stationService.deleteStation,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stations"] })

      toast.success("Station deleted successfully 🗑️")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to delete station"
      )
    },
  })
}

/* -----------------------------
   ASSIGN MANAGER
------------------------------ */
export const useAssignManager = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      managerId,
    }: {
      id: string
      managerId: string
    }) => stationService.assignManager(id, managerId),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stations"] })

      toast.success("Manager assigned successfully 👤")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to assign manager"
      )
    },
  })
}

/* -----------------------------
   GET MANAGERS (WITH PAGINATION + SEARCH)
------------------------------ */
export const useManagers = ({
  page,
  search,
}: {
  page: number
  search: string
}) => {
  return useQuery({
    queryKey: ["managers", { page, search }],
    queryFn: () =>
      stationService.getManagers({ page, search }),
  })
}

/* -----------------------------
   GET FUEL TYPES (PAGINATED + SEARCH)
------------------------------ */
export const useFuelTypes = (page: number, search: string) => {
  return useQuery({
    queryKey: ["fuel-types", page, search],

    queryFn: () =>
    stationService.getFuelTypes({
        page,
        search,
      }),

  })
}

export const useUpdateStationFuel = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      stationId,
      fuel,
    }: {
      stationId: string
      fuel: FuelItem[]
    }) => stationService.updateStationFuel(stationId, fuel),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["stations"] })
      qc.invalidateQueries({
        queryKey: ["station", variables.stationId],
      })

      toast.success("Fuel configuration updated successfully ⛽")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to update fuel configuration"
      )
    },
  })
}

/* -----------------------------
   GET STATION SETTINGS
------------------------------ */
export const useStationSettings = (
  stationId: string
) => {

  return useQuery({

    queryKey:[
      "station-settings",
      stationId
    ],

    queryFn:() =>
      stationService.getStationSettings(
        stationId
      ),

    enabled:!!stationId

  })

}





/* -----------------------------
   UPDATE QUEUE SETTINGS
------------------------------ */
export const useUpdateQueueSettings = () => {

  const qc = useQueryClient()


  return useMutation({

    mutationFn:({
      stationId,
      data,
    }:{
      stationId:string

      data:{
        thresholdLow:number
        thresholdMedium:number
        thresholdHigh:number
        thresholdCritical:number
        maxQueueCapacity:number
        queueZone?:any
        minFuelRequestLiters?:number
      }

    }) =>
      stationService.updateQueueSettings(
        stationId,
        data
      ),



    onSuccess:(_,variables)=>{


      qc.invalidateQueries({

        queryKey:[
          "station-settings",
          variables.stationId
        ]

      })


      toast.success(
        "Queue settings updated successfully 🚦"
      )

    },



    onError:(error:any)=>{

      toast.error(
        error?.message ||
        "Failed to update queue settings"
      )

    }

  })

}







/* -----------------------------
   GET STATION TRAFFIC
------------------------------ */
export const useStationTraffic = (
  stationId:string
)=>{


  return useQuery({

    queryKey:[
      "station-traffic",
      stationId
    ],


    queryFn:() =>
      stationService.getStationTraffic(
        stationId
      ),


    enabled:!!stationId

  })


}







/* -----------------------------
   UPDATE MANUAL TRAFFIC
------------------------------ */
export const useUpdateManualTraffic = () => {


  const qc = useQueryClient()



  return useMutation({


    mutationFn:({

      stationId,

      data,

    }:{
      
      stationId:string

      data:{
        queueCount:number

        congestionLevel:
        "low" |
        "medium" |
        "high" |
        "critical"
      }

    }) =>
      stationService.updateManualTraffic(
        stationId,
        data
      ),




    onSuccess:(_,variables)=>{


      qc.invalidateQueries({

        queryKey:[
          "station-traffic",
          variables.stationId
        ]

      })


      toast.success(
        "Manual traffic updated successfully 🚗"
      )


    },



    onError:(error:any)=>{

      toast.error(
        error?.message ||
        "Failed to update traffic"
      )

    }


  })

}


/* -----------------------------
   GET STATION TRANSACTIONS
------------------------------ */
export const useStationTransactions = (
  stationId?: string,
  params?: StationTransactionQuery
) => {

  return useQuery({

    queryKey:[
      "station-transactions",
      stationId,
      params
    ],


    queryFn:() =>
      stationService.getStationTransactions(
        stationId!,
        params
      ),


    enabled:!!stationId

  })

}


export const useStationTransactionSummary = (
  stationId?: string
)=>{

  return useQuery({

    queryKey:[
      "station-transaction-summary",
      stationId
    ],


    queryFn:() =>
      stationService.getTransactionSummary(
        stationId!
      ),


    enabled:!!stationId

  })

}





/* -----------------------------
   GET SINGLE TRANSACTION
------------------------------ */
export const useStationTransaction = (
  stationId:string,
  transactionId:string
) => {


  return useQuery({


    queryKey:[
      "station-transaction",
      stationId,
      transactionId
    ],


    queryFn:() =>
      stationService.getStationTransactionById(
        stationId,
        transactionId
      ),


    enabled:
      !!stationId &&
      !!transactionId


  })


}