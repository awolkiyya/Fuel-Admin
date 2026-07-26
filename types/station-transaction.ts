export type FuelTransactionType =
  | "NORMAL"
  | "ORGANIZATION"



export interface StationTransactionQuery {

  search?: string


  type?: FuelTransactionType


  fuelTypeId?: string


  paymentStatus?: string


  attendantId?: string


  page?: number


  limit?: number

}



export interface StationTransactionResource {


  id: string


  transactionNumber?: string | null


  type: FuelTransactionType


  status: string


  createdAt: string



  station: {

    id: string

    name: string

  }



  customer: {

    type:
      | "USER"
      | "ORGANIZATION"


    id?: string | null


    name: string


    phone?: string | null

  }



  vehicle: {

    id: string

    plateNumber: string

    model?: string | null

  } | null




  request: {

    id: string

    status: string

    requestedLiters: number

    approvedLiters: number | null

    approvedAt: string | null

  } | null




  dispensing: {


    fuelType: {

      id: string

      name: string

    }


    nozzle: {

      id: string

      name: string

      number?: string | null

    } | null



    attendant: {

      id: string

      name: string

    } | null



    liters: number


    pricePerLiter: number


    totalAmount: number

  }




  payment: {

    status: string

  }



  timeline: {

    verifiedAt: string | null

    approvedAt: string | null

    completedAt: string | null

    cancelledAt: string | null

  }

}


export interface StationTransactionSummary {


  transactions: number


  liters: number


  revenue: number


  organizationLiters: number


  normalLiters: number

}

export interface StationTransactionSummaryResponse {

  success: boolean

  data: StationTransactionSummary

}