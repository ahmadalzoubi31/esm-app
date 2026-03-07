export interface Tenant {
  id: string;
  name: string;
  slug: string;
  preferences?: {
    activationCredentials?: {
      username: string;
      password: string;
    };
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantDto {
  name: string;
  slug: string;
  preferences?: Record<string, any>;
}

export interface UpdateTenantDto extends Partial<CreateTenantDto> {}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

export const TenantsService = {
  async findAll(): Promise<Tenant[]> {
    const res = await fetch(`${API_URL}/tenants`);
    if (!res.ok) throw new Error("Failed to fetch tenants");
    const json = await res.json();
    return json.data;
  },

  async findOne(id: string): Promise<Tenant> {
    const res = await fetch(`${API_URL}/tenants/${id}`);
    if (!res.ok) throw new Error("Failed to fetch tenant");
    const json = await res.json();
    return json.data;
  },

  async create(data: CreateTenantDto): Promise<Tenant> {
    const res = await fetch(`${API_URL}/tenants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create tenant");
    const json = await res.json();
    return json.data;
  },

  async update(id: string, data: UpdateTenantDto): Promise<Tenant> {
    const res = await fetch(`${API_URL}/tenants/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update tenant");
    const json = await res.json();
    return json.data;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/tenants/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete tenant");
  },

  async fetchActivationUser(username: string): Promise<any> {
    const res = await fetch(`${API_URL}/users?search=${username}`);
    if (!res.ok) throw new Error("Failed to fetch user via search");
    const json = await res.json();
    return json.data?.length > 0 ? json.data[0] : null;
  },
};
