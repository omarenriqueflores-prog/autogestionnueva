import React, { useState } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import Button from './shared/Button';
import Input from './shared/Input';
import Card from './shared/Card';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!clientId) {
      setError('Por favor, ingrese su número de cliente.');
      return;
    }
    setIsLoading(true);
    try {
      const { user } = await api.login(clientId, password);
      onLogin(user);
    } catch (err: any) {
      let errorMessage = err.message || 'Ocurrió un error inesperado. Intente nuevamente.';
      // Proporcionar un mensaje de error más útil para problemas de conexión en producción
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Error de Red')) {
          errorMessage = 'Error de conexión. No se pudo comunicar con el servidor en https://app-autogestion.onrender.com. Verifique que el servicio de backend esté funcionando correctamente en esa dirección.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Tartagal Comunicaciones</h1>
            <p className="text-gray-600 mt-2">Portal de Autogestión de Clientes</p>
        </div>
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="clientId"
              label="Número de Cliente"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Ej: C00123"
              required
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" isLoading={isLoading} className="w-full">
              Ingresar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;