import { api } from "@/lib/api"
import { formatApiError } from "@/utils/apiError"

import {
  SingleResponse,
  PaginatedResponse,
} from "@/types/api"
import { CreateOrganizationTransactionPayload, Transaction } from "@/types/transaction.types"



// =====================================================
// TRANSACTION SERVICE
// =====================================================

export const transactionService = {

  // ===================================================
  // CREATE ORGANIZATION TRANSACTION
  // ===================================================

  async createOrganizationTransaction(
    payload: CreateOrganizationTransactionPayload,
  ): Promise<SingleResponse<Transaction>> {

    try {

      const { data } =
        await api.post<
          SingleResponse<Transaction>
        >(
          "/transactions/organization",
          payload,
        )

      return data

    } catch (error) {

      throw formatApiError(error)

    }
  },


  // ===================================================
  // GET TRANSACTIONS
  // ===================================================

  async getTransactions(params?: {
    page?: number
    limit?: number
    organizationId?: string
    stationId?: string
    fuelTypeId?: string
    paymentStatus?: string
  }): Promise<
    PaginatedResponse<Transaction>
  > {

    try {

      const {
        page = 1,
        limit = 10,
        organizationId,
        stationId,
        fuelTypeId,
        paymentStatus,
      } = params ?? {}


      const searchParams =
        new URLSearchParams()


      searchParams.set(
        "page",
        String(page),
      )

      searchParams.set(
        "limit",
        String(limit),
      )


      if (organizationId) {

        searchParams.set(
          "organizationId",
          organizationId,
        )

      }


      if (stationId) {

        searchParams.set(
          "stationId",
          stationId,
        )

      }


      if (fuelTypeId) {

        searchParams.set(
          "fuelTypeId",
          fuelTypeId,
        )

      }


      if (paymentStatus) {

        searchParams.set(
          "paymentStatus",
          paymentStatus,
        )

      }


      const { data } =
        await api.get<
          PaginatedResponse<Transaction>
        >(
          `/transactions?${searchParams.toString()}`,
        )


      return data

    } catch (error) {

      throw formatApiError(error)

    }
  },


  // ===================================================
  // GET TRANSACTION BY ID
  // ===================================================

  async getTransaction(
    id: string,
  ): Promise<
    SingleResponse<Transaction>
  > {

    try {

      const { data } =
        await api.get<
          SingleResponse<Transaction>
        >(
          `/transactions/${id}`,
        )

      return data

    } catch (error) {

      throw formatApiError(error)

    }
  },


  // ===================================================
  // GET ORGANIZATION TRANSACTIONS
  // ===================================================

  async getOrganizationTransactions(
    organizationId: string,
    params?: {
      page?: number
      limit?: number
    },
  ): Promise<
    PaginatedResponse<Transaction>
  > {

    try {

      const {
        page = 1,
        limit = 10,
      } = params ?? {}


      const searchParams =
        new URLSearchParams()


      searchParams.set(
        "page",
        String(page),
      )

      searchParams.set(
        "limit",
        String(limit),
      )


      const { data } =
        await api.get<
          PaginatedResponse<Transaction>
        >(
          `/organizations/${organizationId}/transactions?${searchParams.toString()}`,
        )


      return data

    } catch (error) {

      throw formatApiError(error)

    }
  },
}