export type EquipmentType = 'Desktop' | 'Notebook';

export interface Company {
  id: string;
  name: string;
}

export interface DeliveryReport {
  id: string;
  companyName: string;
  equipmentType: EquipmentType;
  tag: string;
  ticketNumber: string;
  recipientName: string;
  signature: string; // Base64
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
