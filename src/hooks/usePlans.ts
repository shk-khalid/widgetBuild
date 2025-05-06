import { useState, useEffect } from 'react';
import axios from '../service/axios';

export interface ProtectionPlan {
    term: string;
    price: number;
    description: string;
  }
  
  export interface ProtectionPlans {
    shipping: {
      price: number;
      description: string;
    };
    product: ProtectionPlan[];
  }

export const usePlans = (productId: string) => {
  const [plans, setPlans] = useState<ProtectionPlans | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<ProtectionPlans>(`/offer?product_id=${productId}`);
        setPlans(data);
        setError(null);
      } catch (err) {
        setError('Failed to load protection plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchPlans();
    }
  }, [productId]);

  return { plans, loading, error };
};