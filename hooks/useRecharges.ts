import axios from "axios";
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

export const useRecharges = () => {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    amount: "",
    status: "pending",
  });

  // Fetch all recharges on mount
  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/recharges");

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setRecharges(response.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recharges"
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

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);

      const response = await axios.post("/api/recharges", {
        username: formData.username,
        amount: parseFloat(formData.amount),
        status: formData.status,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setSuccess(response.data.message);
      setRecharges([...recharges, response.data.data]);
      setFormData({ username: "", amount: "", status: "pending" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to create recharge"
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
    recharges,
    loading,
    error,
    success,
    formData,
    handleInputChange,
    handleSubmit,
    fetchRecharges,
  };
};
