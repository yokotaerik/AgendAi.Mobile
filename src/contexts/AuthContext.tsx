import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import api from "../api";
import { CompanyOwnerDto, LoginDto, UserInfo } from "../types/auth";
import { UserType } from "../types/common";
import { useTranslation } from "react-i18next";

interface AuthContextData {
  signed: boolean;
  user: UserInfo | null;
  owner: CompanyOwnerDto | null;
  companyId: string | undefined;
  customerId: string | null;
  signIn(data: LoginDto): Promise<boolean>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [owner, setOwner] = useState<CompanyOwnerDto | null>(null);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [signed, setSigned] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  async function signIn(data: LoginDto) {
    try {
      const response = (await api.post("/auth/login", data)) as any;
      var token = response.data.token;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      var userInfoResponse = await api.get("/auth/me");
      
      if (userInfoResponse.status !== 200) {
        return false;
      }
      
      setSigned(true);
      
      var userData = userInfoResponse.data as UserInfo;
      
      setUser(userData);

      if (userData.role === UserType.Employee) {
        var employeeInfoResponse = (await api.get(
          `/employee/email/${userData.email}`
        )) as any;
        setCompanyId(employeeInfoResponse?.data?.company?.id as string);
        
        if (employeeInfoResponse.data.owner == true) {
          router.replace("/(ownerTabs)/manage");
        }
      }
      
      if (userData.role === UserType.Customer) {
        var customerResponse = (await api.get(
          "/customer/email/" + userData.email
        )) as any;
        const costumerIdResponse = customerResponse.data.id as string;
        setCustomerId(costumerIdResponse);
        
        router.replace("/home");
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  function signOut() {
    setUser(null);
    setOwner(null);
    setCompanyId(undefined);
    setSigned(false);
    setCustomerId(null);
    api.defaults.headers.common["Authorization"] = "";
    router.replace("/home");
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        user,
        owner,
        companyId,
        customerId,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
