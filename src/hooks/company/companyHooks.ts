import { useState, useEffect, useCallback } from "react";
import api from "../../api";
import {
  CompanyDto,
  CompleteCompanyDto,
  RegisterCompanyDto,
} from "../../types/company";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

// Hook para obter uma empresa específica
export function useGetCompany() {
  const [company, setCompany] = useState<CompleteCompanyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompany = (companyId: string) => {
    api
      .get(`/company/${companyId}`)
      .then((response) => {
        setCompany(response.data as CompleteCompanyDto);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  };

  return { company, loading, error, fetchCompany };
}

// Hook para listar empresas
export function useListCompanies() {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = useCallback(() => {
    setLoading(true);
    api
      .get("/company")
      .then((response) => {
        setCompanies(response.data as CompanyDto[]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, error, fetchCompanies };
}

// Hook para criar uma empresa
export function useCreateCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCompany = async (companyData: RegisterCompanyDto) => {
    setLoading(true);
    try {
      const response = await api.post("/company", companyData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { createCompany, loading, error };
}

// Hook para editar uma empresa
export function useEditCompany() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const editCompany = async (companyData: CompanyDto) => {
    setLoading(true);
    try {
      const response = await api.put(`/company`, companyData);
      if (response.status === 200) {
        Alert.alert(t("sucessSave"));
      }
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { editCompany, loading, error };
}
