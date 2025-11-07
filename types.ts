
export interface User {
  id: string;
  name: string;
  email: string;
  planId: number;
}

export interface Invoice {
  id: string;
  period: string;
  dueDate: string;
  amount: number;
  status: 'Pagada' | 'Pendiente';
  downloadUrl: string;
}

export interface Plan {
  id: number;
  name: string;
  speed: string;
  price: number;
  features: string[];
}

export interface Claim {
  id: string;
  date: string;
  type: string;
  description: string;
  status: 'Abierto' | 'En Progreso' | 'Cerrado';
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string;
}

export type View = 'dashboard' | 'invoices' | 'claims' | 'report-payment' | 'plans' | 'news';
