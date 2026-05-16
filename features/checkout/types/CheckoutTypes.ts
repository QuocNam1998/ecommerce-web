export type ShippingAddress = {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type CheckoutSession = {
  orderId: string;
  total: number;
  paymentUrl?: string;
};
