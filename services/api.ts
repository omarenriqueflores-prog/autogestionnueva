import type { User, Invoice, Plan, Claim, NewsItem } from '../types';

// --- MODO DE DEMOSTRACIÓN ---
// Cambie este valor a 'false' para conectar con un backend real.
// Si es 'true', la aplicación usará datos de prueba y no hará llamadas de red.
const USE_MOCK_API = true;

// --- CONFIGURACIÓN DEL SERVIDOR ---
// Se establece la URL completa del backend desplegado en Render.com.
// Todas las llamadas a la API se dirigirán a esta dirección.
const API_BASE_URL = 'https://app-autogestion.onrender.com';


// -----------------------------------------------------------------------------
// SECCIÓN DE AUTENTICACIÓN Y LLAMADAS A LA API REAL
// -----------------------------------------------------------------------------

const auth = {
  setToken: (token: string) => sessionStorage.setItem('authToken', token),
  getToken: () => sessionStorage.getItem('authToken'),
  logout: () => sessionStorage.removeItem('authToken'),
  getAuthHeader: () => {
    const token = auth.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  console.log(`Intentando conectar a: ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...auth.getAuthHeader(),
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la respuesta del servidor' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    if (response.status === 204) return {};
    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`Error al conectar con ${fullUrl}:`, error);
    if (error.name === 'AbortError') {
      throw new Error('El servidor tardó demasiado en responder. Verifique que el backend esté funcionando y sea accesible.');
    }
    if (error instanceof TypeError) { // A menudo indica errores de CORS o de red
        throw new Error(`Error de Red. No se pudo conectar a ${API_BASE_URL}. Verifique la URL y la configuración de CORS en su backend. Detalles: ${error.message}`);
    }
    throw error;
  }
};

// -----------------------------------------------------------------------------
// SECCIÓN DE DATOS DE PRUEBA (MOCK)
// -----------------------------------------------------------------------------

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_DATA = {
  user: {
    id: 'user-001',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    planId: 2,
  },
  plans: [
    { id: 1, name: 'Básico Fibra', speed: '50 Mbps', price: 3500, features: ['Navegación ilimitada', 'Soporte técnico 24/7'] },
    { id: 2, name: 'Plus Fibra', speed: '100 Mbps', price: 4800, features: ['Navegación ilimitada', 'Soporte técnico prioritario', 'IP fija opcional'] },
    { id: 3, name: 'Premium Fibra', speed: '300 Mbps', price: 6200, features: ['Navegación ilimitada', 'Soporte técnico prioritario', 'IP fija incluida'] },
  ],
  invoices: [
    { id: 'inv-001', period: 'Mayo 2024', dueDate: '2024-06-10', amount: 4800, status: 'Pendiente' as const, downloadUrl: '#' },
    { id: 'inv-002', period: 'Abril 2024', dueDate: '2024-05-10', amount: 4800, status: 'Pagada' as const, downloadUrl: '#' },
    { id: 'inv-003', period: 'Marzo 2024', dueDate: '2024-04-10', amount: 3500, status: 'Pagada' as const, downloadUrl: '#' },
  ],
  claims: [
      { id: 'clm-001', date: '2024-05-20', type: 'Técnico', description: 'Baja velocidad de internet por las noches.', status: 'En Progreso' as const },
      { id: 'clm-002', date: '2024-04-15', type: 'Facturación', description: 'Duda sobre un cargo extra en la factura.', status: 'Cerrado' as const },
  ],
  news: [
      { id: 'news-1', date: '2024-06-01', title: '¡Nuevos planes con más velocidad!', content: 'Hemos actualizado nuestros planes de fibra óptica para ofrecerte una experiencia de navegación aún más rápida. ¡Consulta la sección de planes para ver las novedades!' },
      { id: 'news-2', date: '2024-05-15', title: 'Mantenimiento programado de la red', content: 'Se realizará un mantenimiento en nuestra red el día 25 de Mayo de 2 a 4 AM para mejorar la calidad del servicio. Es posible que experimente breves interrupciones.' },
  ],
};

// Usamos una copia para permitir mutaciones en la demo (ej. añadir un reclamo)
let MOCK_DB = JSON.parse(JSON.stringify(MOCK_DATA));

// -----------------------------------------------------------------------------
// OBJETO API EXPORTADO
// -----------------------------------------------------------------------------

export const api = {
  login: async (clientId: string, password?: string): Promise<{ user: User, token: string }> => {
    if (USE_MOCK_API) {
      await simulateDelay(800);
      if (clientId === 'C00001' && password === '1234') {
        const token = 'mock-auth-token-for-testing';
        auth.setToken(token);
        return { user: MOCK_DB.user, token };
      } else {
        throw new Error('Número de Cliente o Contraseña incorrectos.');
      }
    }
    const data = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ clientId, password }),
    });
    if (data.token) auth.setToken(data.token);
    return data;
  },

  logout: () => {
    auth.logout();
    return Promise.resolve();
  },

  getPlans: async (): Promise<Plan[]> => {
    if (USE_MOCK_API) {
      await simulateDelay(500);
      return MOCK_DB.plans;
    }
    return apiFetch('/plans');
  },

  getCurrentPlan: async (): Promise<Plan> => {
    if (USE_MOCK_API) {
      await simulateDelay(300);
      const currentPlan = MOCK_DB.plans.find((p: Plan) => p.id === MOCK_DB.user.planId);
      return currentPlan || MOCK_DB.plans[0];
    }
    return apiFetch('/plans/current');
  },

  changePlan: async (newPlanId: number): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK_API) {
      await simulateDelay(1200);
      MOCK_DB.user.planId = newPlanId;
      return { success: true, message: 'Tu plan se actualizará en el próximo ciclo de facturación.' };
    }
    return apiFetch('/plans/change', {
        method: 'POST',
        body: JSON.stringify({ newPlanId }),
    });
  },

  getInvoices: async (): Promise<Invoice[]> => {
    if (USE_MOCK_API) {
      await simulateDelay(700);
      return MOCK_DB.invoices;
    }
    return apiFetch('/invoices');
  },

  getClaims: async (): Promise<Claim[]> => {
    if (USE_MOCK_API) {
      await simulateDelay(600);
      return MOCK_DB.claims;
    }
    return apiFetch('/claims');
  },

  createClaim: async (claimData: Omit<Claim, 'id' | 'date' | 'status'>): Promise<Claim> => {
    if (USE_MOCK_API) {
        await simulateDelay(1000);
        const newClaim: Claim = {
            id: `clm-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Abierto',
            ...claimData
        };
        MOCK_DB.claims.unshift(newClaim);
        return newClaim;
    }
    return apiFetch('/claims', {
        method: 'POST',
        body: JSON.stringify(claimData),
    });
  },

  reportPayment: async (paymentData: { amount: number; date: string; file?: File }): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK_API) {
        await simulateDelay(1000);
        return { success: true, message: 'Hemos recibido tu información de pago. Se procesará en las próximas 24hs hábiles.' };
    }
    const { file, ...rest } = paymentData;
    return apiFetch('/payments/report', {
        method: 'POST',
        body: JSON.stringify(rest),
    });
  },
  
  getNews: async (): Promise<NewsItem[]> => {
    if (USE_MOCK_API) {
        await simulateDelay(400);
        return MOCK_DB.news;
    }
    return apiFetch('/news');
  },
};