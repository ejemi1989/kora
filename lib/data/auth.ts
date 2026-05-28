export interface SeedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  avatar?: string;
}

export const SEED_USERS: SeedUser[] = [
  { id: "usr_admin_1", name: "Admin Kongo", email: "admin@kongo.com", password: "password123", role: "ADMIN" },
  { id: "usr_seller_1", name: "Nakato Abimbola", email: "seller@akara.com", password: "password123", role: "SELLER" },
  { id: "usr_customer_1", name: "Amara Osei", email: "user@kora.com", password: "password123", role: "CUSTOMER" },
];

export function findUser(email: string, password: string): SeedUser | null {
  return SEED_USERS.find((u) => u.email === email && u.password === password) ?? null;
}
