
import React, { useState } from 'react';
import { api } from '../services/api';
import Card from './shared/Card';
import Button from './shared/Button';
import Input from './shared/Input';

const ReportPayment: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) {
      setMessage({ type: 'error', text: 'Por favor, complete el monto y la fecha.' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await api.reportPayment({
        amount: parseFloat(amount),
        date,
        file: file || undefined,
      });
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        setAmount('');
        setDate('');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

      } else {
        setMessage({ type: 'error', text: 'Ocurrió un error al informar el pago.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ocurrió un error al informar el pago.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Informar un Pago</h1>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Utilice este formulario para notificarnos sobre un pago que ya ha realizado por transferencia, depósito u otro medio no automático.</p>
          
          <Input 
            id="amount"
            label="Monto Pagado ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            required
            step="0.01"
          />

          <Input 
            id="date"
            label="Fecha de Pago"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Comprobante (Opcional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Subir un archivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                {file ? <p className="text-sm text-gray-500">{file.name}</p> : <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>}
              </div>
            </div>
          </div>
          
          {message && (
            <p className={`text-sm text-center p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</p>
          )}

          <div className="pt-4">
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Enviar Información
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default ReportPayment;
