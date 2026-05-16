export type AuthenticatedUser = {
  id: string;
  email: string;
  phone: string | null;
  displayName: string;
  role: "customer" | "admin";
  createdAt: string;
};
