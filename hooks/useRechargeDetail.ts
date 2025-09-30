import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Recharge {
  id: string;
  username: string;
  amount: number;
  date: string;
  status: "pending" | "completed" | "failed";
}

interface FormData {
  username: string;
  amount: string;
  status: "pending" | "completed" | "failed";
}

export const useRechargeDetail = (id: string) => {
  const router = useRouter();
  const [recharge, setRecharge] = useState<Recharge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    amount: "",
    status: "pending",
  });

  // Fetch recharge on mount
  useEffect(() => {
    if (id) {
      fetchRecharge();
    }
  }, [id]);

  const fetchRecharge = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/recharges/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setRecharge(response.data.data);
      setFormData({
        username: response.data.data.username,
        amount: response.data.data.amount.toString(),
        status: response.data.data.status,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recharge"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      setError(null);
      setSuccess(null);

      const response = await axios.put(`/api/recharges/${id}`, {
        username: formData.username,
        amount: parseFloat(formData.amount),
        status: formData.status,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setSuccess(response.data.message);
      setRecharge(response.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to update recharge"
        );
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recharge?")) return;

    try {
      setError(null);
      setSuccess(null);

      const response = await axios.delete(`/api/recharges/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setSuccess(response.data.message);

      // Redirect after delete
      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to delete recharge"
        );
      }
    }
  };

  // Auto-clear success/error after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return {
    recharge,
    loading,
    error,
    success,
    formData,
    handleInputChange,
    handleUpdate,
    handleDelete,
    fetchRecharge,
  };
};
