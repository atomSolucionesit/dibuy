import axios from "axios";
import { LoginCredentials } from "@/types/api";
import { URLAPI } from "..";

export interface LoginResponse {
  status: number;
  message: string;
  info: {
    user: {
      id: number;
      username: string;
      name: string;
      email?: string;
      companyId: number;
      companyName: string;
      companyToken: string;
      isAdmin: boolean;
      isCompanyAdmin: boolean;
      roleId: number;
      roleCode: string;
      isActive: boolean;
      branchId: number;
      access_token: string;
    };
    menu: any[];
    links: string[];
  };
}

export const login = async (data: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${URLAPI}/auth/login`, data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  const access_token = localStorage.getItem("access_token");
  
  if (access_token) {
    await axios.patch(
      `${URLAPI}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  }
};
