import { api } from "@/lib/api"
import { StaffStatus } from "@/types/station"

// ======================================================
// GET STAFF BY STATION
// ======================================================
export const getStationStaff = async (stationId: string) => {
  const { data } = await api.get(`/stations/${stationId}/staff`)
  return data.data
}

// ======================================================
// CREATE STAFF (NOW INCLUDES PASSWORD + GENDER)
// ======================================================
export const createStaff = async (payload: {
  stationId: string
  full_name: string
  phone: string
  email?: string
  gender?: "MALE" | "FEMALE"
  password: string
}) => {
  const { data } = await api.post(
    `/stations/${payload.stationId}/staff`,
    {
      full_name: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      gender: payload.gender,
      password: payload.password,
      role: "station_staff",
    }
  )

  return data.data
}

// ======================================================
// UPDATE STAFF STATUS (NO DELETE POLICY)
// ======================================================
export const updateStaffStatus = async (params: {
  stationId: string
  userId: string
  status: StaffStatus
}) => {
  const { data } = await api.patch(
    `/stations/${params.stationId}/staff/${params.userId}/status`,
    {
      status: params.status,
    }
  )

  return data.data
}

// ======================================================
// UPDATE STAFF PASSWORD (NEW FEATURE)
// ======================================================
export const updateStaffPassword = async (params: {
  stationId: string
  userId: string
  newPassword: string
}) => {
  const { data } = await api.patch(
    `/stations/${params.stationId}/staff/${params.userId}/password`,
    {
      newPassword: params.newPassword,
    }
  )

  return data.data
}

export async function updateStaffProfile(data:{
  stationId:string
  userId:string
  full_name:string
  phone:string
  email:string
  gender:"MALE"|"FEMALE"
}){


const res =
await api.patch(

`/stations/${data.stationId}/staff/${data.userId}`,

{

full_name:data.full_name,

phone:data.phone,

email:data.email,

gender:data.gender

}

)


return res.data

}