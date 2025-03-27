import { useState, useEffect, useCallback } from "react";
import api from "../../api";
import {
  EmployeeDto,
  RegisterEmployeeDto,
  UpdateEmployeeDto,
} from "../../types/employee";
import { BasicInfoDto } from "../../types/common";

// Hook para obter uma empresa específica
export function useGetEmployee() {
  const [employee, setEmployee] = useState<EmployeeDto | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const fetchEmployeee = async (employeeId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/employee/${employeeId}`);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  };

  return { employee, loading, error, fetchEmployeee };
}

// Hook para listar empresas
export function useListEmployees() {
  const [employees, setEmployees] = useState<BasicInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployees = (companyId: string) => {
    setLoading(true);
    api
      .get("/employee", {
        params: { companyId },
      })
      .then((response) => {
        setEmployees(response.data as BasicInfoDto[]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  };

  return { employees, loading, error, fetchEmployees };
}

// Hook para criar uma empresa
export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEmployee = async (employeeData: RegisterEmployeeDto) => {
    setLoading(true);
    try {
      const response = await api.post("/employee", employeeData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { createEmployee, loading, error };
}

// Hook para editar uma empresa
export function useEditEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const editEmployee = async (data: UpdateEmployeeDto) => {
    setLoading(true);
    try {
      const response = await api.put("/employee", data);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { editEmployee, loading, error };
}
