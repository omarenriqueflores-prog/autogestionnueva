
import React, { useState, useEffect } from 'react';
import type { Plan } from '../types';
import { api } from '../services/api';
import Card from './shared/Card';
import Button from './shared/Button';
import Spinner from './shared/Spinner';
import Modal from './shared/Modal';

interface PlansProps {
  currentPlanId: number;
}

const PlanCard: React.FC<{ plan: Plan; isCurrent: boolean; onChangePlan: (plan: Plan) => void }> = ({ plan, isCurrent, onChangePlan }) => (
    <Card className={`flex flex-col p-6 border-2 transition-all duration-300 ${isCurrent ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}>
        {isCurrent && <div className="text-center mb-2 text-sm font-semibold text-blue-600">TU PLAN ACTUAL</div>}
        <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
        <p className="text-3xl font-extrabold text-blue-600 my-4">{plan.speed}</p>
        <p className="text-lg font-semibold text-gray-700 mb-4">${plan.price.toLocaleString('es-AR')}<span className="text-sm font-normal text-gray-500">/mes</span></p>
        <ul className="space-y-2 text-sm text-gray-600 flex-grow">
            {plan.features.map(feature => (
                <li key={feature} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                </li>
            ))}
        </ul>
        <div className="mt-6">
            <Button
                className="w-full"
                disabled={isCurrent}
                onClick={() => onChangePlan(plan)}
            >
                {isCurrent ? 'Plan Actual' : 'Cambiar a este Plan'}
            </Button>
        </div>
    </Card>
);

const Plans: React.FC<PlansProps> = ({ currentPlanId }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isChanging, setIsChanging] = useState(false);
    const [changeMessage, setChangeMessage] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const data = await api.getPlans();
                setPlans(data);
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleChangePlanClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setModalOpen(true);
    };

    const confirmChangePlan = async () => {
        if (!selectedPlan) return;
        setIsChanging(true);
        setChangeMessage('');
        try {
            const response = await api.changePlan(selectedPlan.id);
            setChangeMessage(response.message);
            // In a real app, you would update the parent state here
        } catch (error) {
            setChangeMessage('Error al cambiar de plan. Intente de nuevo.');
        } finally {
            setIsChanging(false);
            setTimeout(() => {
                setModalOpen(false);
                setSelectedPlan(null);
                setChangeMessage('');
            }, 3000);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Planes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === currentPlanId} onChangePlan={handleChangePlanClick} />
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirmar Cambio de Plan"
            >
                {changeMessage ? (
                    <p className="text-center">{changeMessage}</p>
                ) : (
                    <>
                    <p>
                        ¿Estás seguro que deseas cambiar tu plan actual al plan <strong>{selectedPlan?.name}</strong> por <strong>${selectedPlan?.price.toLocaleString('es-AR')}/mes</strong>?
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        El cambio se aplicará en tu próximo ciclo de facturación.
                    </p>
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isChanging}>Cancelar</Button>
                        <Button onClick={confirmChangePlan} isLoading={isChanging}>Confirmar Cambio</Button>
                    </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default Plans;
