export type OrderStatus = "pending_payment" | "pending_review" | "paid" | "rejected";

export interface Order {
  id: string;
  slug: string;
  templateId: string;
  tier?: "basic" | "premium" | "vip";
  userId?: string;
  createdAt: string;
  status: OrderStatus;
  price: number;
  invitation: {
    groomName: string;
    brideName: string;
    date: string;
    venue: string;
    venueMapUrl?: string; // Google Maps link or coords
    time: string;
    message: string;
    groomPhoto?: string;
    bridePhoto?: string;
    couplePhoto?: string;
    gallery?: string[]; // additional photos (premium)
    groomFatherName?: string;
    brideFatherName?: string;
    groomMotherName?: string;
    brideMotherName?: string;
    storyTitle?: string;
    storyText?: string;
    voiceNote?: string; // data URL or storage URL of a recorded voice greeting
    backgroundVideo?: string; // optional looping video for hero
    enableMusic: boolean;
    musicChoice: string;
    musicUrl?: string; // custom music URL (VIP)
  };
  removeBranding?: boolean;
  referredBy?: string;
  couponCode?: string;
  couponDiscount?: number;
  customer: {
    name?: string;
    phone?: string;
    email?: string;
  };
  receipt?: {
    method: "vodafone_cash" | "instapay";
    image?: string;
    note?: string;
    uploadedAt: string;
  };
  rsvps: RSVP[];
  views: number;
}

export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  attending: boolean;
  guests: number;
  message?: string;
  createdAt: string;
}
