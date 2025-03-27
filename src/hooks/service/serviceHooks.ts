import { useState, useEffect, useCallback } from "react";
import api, { ApiListResponse } from "../../api";
import {
  ServiceDto,
  CreateServiceDto,
  UpdateServiceDto,
} from "../../types/service";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

export function useListServices() {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = (companyId: string) => {
    setLoading(true);
    api
      .get<ApiListResponse>("/service", {
        params: {
          companyId,
        },
      })
      .then((response) => {
        setServices(response.data.items as ServiceDto[]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  };

  return { services, loading, error, fetchServices };
}

// Hook para obter um serviço específico
export function useGetService(serviceId: string) {
  const [service, setService] = useState<ServiceDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchService = useCallback(() => {
    if (!serviceId) return;

    setLoading(true);
    api
      .get(`/service/${serviceId}`)
      .then((response) => {
        setService(response.data as ServiceDto);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { service, loading, error, refetch: fetchService };
}

// Hook para criar um novo serviço
export function useCreateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdService, setCreatedService] = useState<ServiceDto | null>(null);

  const createService = async (data: CreateServiceDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/services", data);
      setCreatedService(response.data as ServiceDto);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { createService, loading, error, createdService };
}

// Hook para atualizar um serviço
export function useUpdateService() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedService, setUpdatedService] = useState<ServiceDto | null>(null);

  const updateService = async (data: UpdateServiceDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/services`, data);
      setUpdatedService(response.data as ServiceDto);
      setLoading(false);
      if(response.status === 200) {
        Alert.alert(t("sucessSave"))  
      }
      return response.data;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { updateService, loading, error, updatedService };
}

// Hook para deletar um serviço
export function useDeleteService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteService = async (serviceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/services/${serviceId}`);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { deleteService, loading, error };
}
