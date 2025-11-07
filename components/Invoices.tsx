
import React, { useState, useEffect } from 'react';
import type { Invoice } from '../types';
import { api } from '../services/api';
import Card from './shared/Card';
import Button from './shared/Button';
import Spinner from './shared/Spinner';
import Modal from './shared/Modal';

const InvoiceRow: React.FC<{ invoice: Invoice; onPay: (invoice: Invoice) => void }> = ({ invoice, onPay }) => (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center p-4 border-b last:border-b-0 hover:bg-gray-50">
        <div className="sm:col-span-1">
            <p className="font-semibold text-gray-800">{invoice.period}</p>
            <p className="text-sm text-gray-500 sm:hidden">Vence: {invoice.dueDate}</p>
        </div>
        <p className="text-sm text-gray-500 hidden sm:block">{invoice.dueDate}</p>
        <p className="font-medium text-gray-700 text-right sm:text-left">${invoice.amount.toLocaleString('es-AR')}</p>
        <div className="text-right sm:text-left">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                invoice.status === 'Pagada'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}>{invoice.status}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex justify-end items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => window.open(invoice.downloadUrl, '_blank')}>
                Descargar
            </Button>
            {invoice.status === 'Pendiente' && (
                <Button size="sm" onClick={() => onPay(invoice)}>Pagar</Button>
            )}
        </div>
    </div>
);

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            try {
                const data = await api.getInvoices();
                setInvoices(data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoices();
    }, []);
    
    const handlePayClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setPayModalOpen(true);
    };

    const handleCloseModal = () => {
        setPayModalOpen(false);
        setSelectedInvoice(null);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Facturas</h1>
            <Card>
                <div className="hidden sm:grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 font-semibold text-sm text-gray-600">
                    <p>Período</p>
                    <p>Vencimiento</p>
                    <p>Monto</p>
                    <p>Estado</p>
                    <p className="text-right">Acciones</p>
                </div>
                {invoices.length > 0 ? (
                    invoices.map(invoice => <InvoiceRow key={invoice.id} invoice={invoice} onPay={handlePayClick} />)
                ) : (
                    <p className="p-6 text-center text-gray-500">No se encontraron facturas.</p>
                )}
            </Card>

            <Modal
                isOpen={isPayModalOpen}
                onClose={handleCloseModal}
                title={`Pagar Factura - ${selectedInvoice?.period}`}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={() => alert('Redirigiendo a la pasarela de pago...')}>Proceder al Pago</Button>
                    </>
                }
            >
                <p>Estás a punto de pagar la factura por un monto de <strong>${selectedInvoice?.amount.toLocaleString('es-AR')}</strong>.</p>
                <p className="mt-2 text-sm text-gray-600">Serás redirigido a una plataforma de pago segura para completar la transacción.</p>
            </Modal>
        </>
    );
};

export default Invoices;
