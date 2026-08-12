import {
    useMutation,
    useQuery,
  } from "@tanstack/react-query"
  
  import { transactionService } from "@/services/transaction.service"
  
  import {
    CreateOrganizationTransactionPayload,
    Transaction,
  } from "@/types/transaction.types"
  
  import {
    SingleResponse,
  } from "@/types/api"
  
  
  // =====================================================
  // CREATE ORGANIZATION FUEL TRANSACTION
  // =====================================================
  
  export const useCreateOrganizationTransaction = () => {
    return useMutation<
      SingleResponse<Transaction>,
      Error,
      CreateOrganizationTransactionPayload
    >({
      mutationFn: (payload) =>
        transactionService.createOrganizationTransaction(payload),
    })
  }
  
