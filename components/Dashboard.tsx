
import React, { useState, useEffect } from 'react';
import type { User, Plan, Invoice, View } from '../types';
import { api } from '../services/api';
import Card from './shared/Card';
import Button from './shared/Button';
import Spinner from './shared/Spinner';

interface DashboardProps {
  user: User;
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [pendingInvoice, setPendingInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [currentPlan, invoices] = await Promise.all([
          api.getCurrentPlan(),
          api.getInvoices(),
        ]);
        setPlan(currentPlan);
        setPendingInvoice(invoices.find(inv => inv.status === 'Pendiente') || null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Resumen de tu cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Tu Plan Actual</h2>
          {plan ? (
            <>
              <p className="text-3xl font-bold text-blue-600">{plan.name}</p>
              <p className="text-gray-600">{plan.speed}</p>
              <p className="text-xl text-gray-800 mt-2">${plan.price.toLocaleString('es-AR')}/mes</p>
            </>
          ) : (
            <p className="text-gray-500">Cargando plan...</p>
          )}
          <Button variant="ghost" className="mt-4" onClick={() => onNavigate('plans')}>
            Ver o Cambiar de Plan
          </Button>
        </Card>

        {/* Invoice Status Card */}
        <Card className={`p-6 border-l-4 ${pendingInvoice ? 'border-red-500' : 'border-green-500'}`}>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Estado de Facturación</h2>
          {pendingInvoice ? (
            <>
              <p className="text-xl font-bold text-red-600">Factura Pendiente</p>
              <p className="text-gray-800 text-2xl">${pendingInvoice.amount.toLocaleString('es-AR')}</p>
              <p className="text-sm text-gray-500">Vence el: {pendingInvoice.dueDate}</p>
              <Button className="mt-4 w-full" onClick={() => onNavigate('invoices')}>
                Pagar Ahora
              </Button>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-green-600">¡Estás al día!</p>
              <p className="text-gray-600">No tienes facturas pendientes de pago.</p>
              <Button variant="ghost" className="mt-4" onClick={() => onNavigate('invoices')}>
                Ver Historial de Facturas
              </Button>
            </>
          )}
        </Card>

        {/* Quick Actions Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => onNavigate('claims')}>
              Realizar un Reclamo
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => onNavigate('report-payment')}>
              Informar un Pago
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
