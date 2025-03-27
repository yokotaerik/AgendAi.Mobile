import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import api from "../api";
import { CompanyOwnerDto, LoginDto, UserInfo } from "../types/auth";
import { EmployeeDto } from "../types/employee";
import { UserType } from "../types/common";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

interface AuthContextData {
  signed: boolean;
  user: UserInfo | null;
  owner: CompanyOwnerDto | null;
  companyId: string | null;
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
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [signed, setSigned] = useState<boolean>(false);

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

        console.log(userData.email);
        console.log("~~~~~~~~~~~~~~~~~~~~~");
        
        console.log(employeeInfoResponse.data);
        
        

        setCompanyId(employeeInfoResponse?.data?.company?.id as string);

        if (employeeInfoResponse.data.owner == true) {
          router.replace("/(ownerTabs)/manage");
        }
      }

      if (userData.role === UserType.Customer) {
        router.replace("/home");
      }

      return true;
    } catch (error) {
      console.error("Failed to sign in:", error);
      Alert.alert(t("login.error"));
      return false;
    }
  }

  function signOut() {
    setUser(null);
    setOwner(null);
    setCompanyId(null);
    setSigned(false);
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

