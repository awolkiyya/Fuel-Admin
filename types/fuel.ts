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
  fuelTypeId: string;
  fuelType: {
    id: string;
    name: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

  isActive: boolean;
  min: number;
  max: number;
  maxCapacity: number;
  price: number;
  priceOverrideAllowed: boolean;
};