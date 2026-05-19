export type OrderStatus = "pending_payment" | "pending_review" | "paid" | "rejected";

export interface Order {
  id: string;
  slug: string;
  templateId: string;
  createdAt: string;
  status: OrderStatus;
  price: number;
  invitation: {
    groomName: string;
    brideName: string;
    date: string;
    venue: string;
    time: string;
    message: string;
    groomPhoto?: string;
    bridePhoto?: string;
    couplePhoto?: string;
    enableMusic: boolean;
    musicChoice: string;
  };
  removeBranding?: boolean;
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
