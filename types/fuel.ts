export type FuelConfigApiResponse = {
  success: boolean;
  message: string;
  data: FuelConfigPayload;
};

export type FuelConfigPayload = {
  stationId: string;
  priceControlMode: "FIXED" | "OVERRIDE";
  fuelTypes: FuelConfigItem[];
};

export type FuelConfigItem = {
  id: string;
  stationId: string;
  fuelTypeId: string;

  fuelType: {
    id: string;
    name: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

  maxCapacity: number;
  minRequestLiters: number;
  maxRequestLiters: number;
  isActive: boolean;
  price: number;


  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// ---- Update payload (mirrors FuelConfigPayload's editable fields) ----

export type UpdateFuelConfigPayload = {
  stationId: string;
  priceControlMode: "FIXED" | "OVERRIDE";
  fuelTypes: UpdateFuelTypeItem[];
};

export type UpdateFuelTypeItem = {
  id?: string; // present when updating an existing fuelType config row, omitted when creating a new one
  fuelTypeId: string;
  maxCapacity: number;
  minRequestLiters: number;
  maxRequestLiters: number;
  isActive: boolean;
};