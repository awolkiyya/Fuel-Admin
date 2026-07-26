import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query"
  
  import { toast } from "sonner"
  
  import { businessLicenseService } from "@/services/business-license.service"
  
  import {
    BusinessLicenseRequestType,
    BusinessLicenseStatus,
  } from "@/types/business-license"
  
  
  
  /* -----------------------------
     GET ALL BUSINESS LICENSES
  ------------------------------ */
  export const useBusinessLicenses = (params?: {
    page?: number
    limit?: number
    search?: string
    status?: BusinessLicenseStatus
    requestType?: BusinessLicenseRequestType
  }) => {
  
    return useQuery({
  
      queryKey:[
        "business-licenses",
        params,
      ],
  
  
      queryFn:() =>
        businessLicenseService.getBusinessLicenses(
          params
        ),
  
    })
  
  }
  
  
  
  /* -----------------------------
     GET LICENSE SUMMARY
  ------------------------------ */
  export const useBusinessLicenseSummary = () => {
  
    return useQuery({
  
      queryKey:[
        "business-license-summary"
      ],
  
  
      queryFn:() =>
        businessLicenseService.getSummary(),
  
    })
  
  }
  
  
  
  
  /* -----------------------------
     GET SINGLE LICENSE
  ------------------------------ */
  export const useBusinessLicense = (
    id?: string
  ) => {
  
    return useQuery({
  
      queryKey:[
        "business-license",
        id,
      ],
  
  
      queryFn:() =>
        businessLicenseService.getBusinessLicenseById(
          id!
        ),
  
  
      enabled:
        !!id,
  
    })
  
  }
  
  
  
  /* -----------------------------
     APPROVE LICENSE
  ------------------------------ */
  export const useApproveBusinessLicense = () => {
  
    const qc = useQueryClient()
  
  
    return useMutation({
  
      mutationFn:({
  
        id,
  
        data,
  
      }:{
        id:string
  
        data?:{
          licenseNumber?:string
          expiryDate?:string
        }
  
      }) =>
        businessLicenseService.approveLicense(
          id,
          data
        ),
  
  
  
      onSuccess:(_,variables)=>{
  
  
        qc.invalidateQueries({
  
          queryKey:[
            "business-licenses"
          ]
  
        })
  
  
        qc.invalidateQueries({
  
          queryKey:[
            "business-license",
            variables.id
          ]
  
        })
  
  
  
        qc.invalidateQueries({
  
          queryKey:[
            "business-license-summary"
          ]
  
        })
  
  
  
        toast.success(
          "Business license approved successfully ✅"
        )
  
  
      },
  
  
      onError:(error:any)=>{
  
        toast.error(
  
          error?.message ||
          "Failed to approve license"
  
        )
  
      }
  
    })
  
  }
  
  
  
  /* -----------------------------
     REJECT LICENSE
  ------------------------------ */
  export const useRejectBusinessLicense = () => {
  
    const qc = useQueryClient()
  
  
  
    return useMutation({
  
      mutationFn:({
  
        id,
  
        reason,
  
      }:{
        
        id:string
  
        reason:string
  
      }) =>
        businessLicenseService.rejectLicense(
          id,
          reason
        ),
  
  
  
  
      onSuccess:(_,variables)=>{
  
  
        qc.invalidateQueries({
  
          queryKey:[
            "business-licenses"
          ]
  
        })
  
  
        qc.invalidateQueries({
  
          queryKey:[
            "business-license",
            variables.id
          ]
  
        })
  
  
  
        qc.invalidateQueries({
  
          queryKey:[
            "business-license-summary"
          ]
  
        })
  
  
  
        toast.success(
          "Business license rejected ❌"
        )
  
  
      },
  
  
  
      onError:(error:any)=>{
  
        toast.error(
  
          error?.message ||
          "Failed to reject license"
  
        )
  
      }
  
  
    })
  
  }