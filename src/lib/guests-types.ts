export interface Guest {
  id: string;
  orderId: string;
  name: string;
  phone?: string;
  token: string;
  openedAt?: string;
  rsvpId?: string;
  createdAt: string;
}
