
import React, { useState, useEffect } from 'react';
import type { Claim, User } from '../types';
import { api } from '../services/api';
import Card from './shared/Card';
import Button from './shared/Button';
import Spinner from './shared/Spinner';
import Input from './shared/Input';

const Claims: React.FC<{ user: User }> = ({ user }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [claimType, setClaimType] = useState('Técnico');
  const [description, setDescription] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
        const data = await api.getClaims();
        setClaims(data);
    } catch (error) {
        console.error("Error fetching claims:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClaims();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    setIsSubmitting(true);
    setSubmitMessage('');
    try {
        await api.createClaim({ type: claimType, description });
        setSubmitMessage('¡Reclamo enviado con éxito!');
        // Reset form
        setDescription('');
        setClaimType('Técnico');
        setShowForm(false);
        // Refresh claims list
        await fetchClaims();
    } catch (error) {
        setSubmitMessage('Error al enviar el reclamo. Intente nuevamente.');
    } finally {
        setIsSubmitting(false);
        setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Reclamos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo Reclamo'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Crear nuevo reclamo</h2>
            <div>
              <label htmlFor="claimType" className="block text-sm font-medium text-gray-700">Tipo de Reclamo</label>
              <select
                id="claimType"
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>Técnico</option>
                <option>Administrativo</option>
                <option>Facturación</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describa su problema en detalle..."
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>Enviar Reclamo</Button>
            </div>
          </form>
        </Card>
      )}

      {submitMessage && <p className="mb-4 text-center text-green-600">{submitMessage}</p>}

      <Card>
        <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Historial de Reclamos</h2>
        </div>
        {isLoading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
        ) : claims.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {claims.map(claim => (
              <div key={claim.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{claim.type} - {claim.date}</p>
                    <p className="text-sm text-gray-600 mt-1">{claim.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      claim.status === 'Cerrado' ? 'bg-gray-100 text-gray-800' :
                      claim.status === 'En Progreso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                  }`}>
                      {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500">No tienes reclamos registrados.</p>
        )}
      </Card>
    </div>
  );
};

export default Claims;
