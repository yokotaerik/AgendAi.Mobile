import { useState } from "react";
import api from "../../api";

export interface CustomerDto {
  id: string;
  name: string;
  surname: string;
}

export const useListCustomers = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async (companyId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/customer", {
        params: {
          companyId,
        },
      }) as any;
      
      if (response.status === 200) {
        setCustomers(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      setError(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
  };
};