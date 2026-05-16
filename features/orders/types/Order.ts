export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  shipName: string;
  shipAddress: string;
  shipCity: string;
  shipPostal: string;
  shipCountry: string;
  items: OrderItem[];
  createdAt: string;
};

export type PlaceOrderInput = {
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postal: string;
    country: string;
  };
};
