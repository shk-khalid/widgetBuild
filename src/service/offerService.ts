import axiosInstance from "./axios";


export interface Offer {
  plan_type: string;
  term_months: number | null;
  total_premium_inr: number;
  deductible_inr: number;
  label: string;
}


interface OfferApiResponse {
  sucess: boolean;
  data: Offer[];
  messages: string;
}


export async function fetchOffers(variantId: string): Promise<Offer[]> {
  try {
    const response = await axiosInstance.get<OfferApiResponse>("/offer", {
      params: { product_id: variantId },
    });
    
    // Check if the response was successful
    if (!response.data.sucess) {
      throw new Error("API returned unsuccessful response");
    }
    
    // Return data as is since the structure matches our Offer interface
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching offers for product ${variantId}:`, error);
    throw new Error(
      error.response?.data?.message || "Failed to load offers."
    );
  }
}
