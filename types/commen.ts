
  export type NavItem = {
    title: string
    url: string
    icon: any
    items?: { title: string; url: string }[]
  }
 

  /* ---------------------------------------
   TYPES
----------------------------------------*/
export type FuelType = "Petrol" | "Diesel" | "Kerosene";

export type FuelConfig = {
  id: string;
  name: FuelType;
  price: number;
  status: "ACTIVE" | "INACTIVE"| undefined;
  updatedAt: string;
};

export type FuelQuery = {
  search?: string
  status?: "ACTIVE" | "INACTIVE"|undefined;
  page?: number
  limit?: number
}