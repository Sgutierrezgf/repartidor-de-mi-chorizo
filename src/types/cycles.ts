export interface ActiveCycle {
  id: number;
  created_at: string;
  is_open: boolean;
}

export interface ReporteCiclo {
  pedidos: number;
  ingresos: number;
  domicilioTotal: number;
  gastos: number;
  ganancia: number;
}

export interface DeliveryClient {
  normal: number;
  pepper: number;
  spicy: number;
  payment: boolean;
}

export interface DeliveryCycle {
  id: number;
  created_at: string;
  is_open: boolean;
  delivery_clients: DeliveryClient[];
}

export interface CycleSummary {
  id: number;
  created_at: string;
  is_open: boolean;
  totalClients: number;
  totalNormal: number;
  totalPepper: number;
  totalSpicy: number;
  total: number;
  totalPaid: number;
  totalMoney: number;
}