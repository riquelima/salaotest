
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Appointment, Client } from '../../types';
import { Card } from '../../components/ui';
import { CalendarIcon, UsersIcon, ChartBarIcon, WhatsAppIcon as FollowUpIcon, SparklesIcon } from '../../components/icons';
import { APPOINTMENTS_KEY, CLIENTS_KEY } from '../../constants';
import { formatDate, filterAppointmentsByPeriod } from '../../utils/helpers';

const AdminDashboard: React.FC = () => {
  const { config } = useAppContext();
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  const [clients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);

  const today = new Date();
  const upcomingAppointments = filterAppointmentsByPeriod(appointments, 'week', today)
    .filter(app => new Date(app.date) >= today && !app.completed)
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentClients = clients
    .filter(client => client.lastServiceDate && new Date(client.lastServiceDate) > new Date(new Date().setDate(today.getDate() - 7)))
    .slice(0, 5);

  const stats = [
    { title: "Próximos Agendamentos (Semana)", value: upcomingAppointments.length, icon: <CalendarIcon className="w-8 h-8" />, color: "text-blue-500 dark:text-blue-400", link: "/admin/agenda" },
    { title: "Total de Clientes", value: clients.length, icon: <UsersIcon className="w-8 h-8" />, color: "text-green-500 dark:text-green-400", link: "/admin/clientes" },
    { title: "Agendamentos Hoje", value: appointments.filter(app => formatDate(app.date) === formatDate(today.toISOString())).length, icon: <SparklesIcon className="w-8 h-8" />, color: "text-yellow-500 dark:text-yellow-400", link: "/admin/agenda" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bem-vindo(a), {config.stylistName}!</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <Link to={stat.link} key={stat.title}>
            <Card className={`hover:shadow-purple-500/30 dark:hover:shadow-purple-400/30 transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-700 dark:text-slate-200">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
                  {React.cloneElement(stat.icon, { className: `w-8 h-8 ${stat.color}`})}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Links / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Próximos Agendamentos</h2>
          {upcomingAppointments.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {upcomingAppointments.slice(0,5).map(app => (
                <li key={app.id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md shadow-sm">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{app.clientName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(app.date, true)} - {app.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">Nenhum agendamento futuro esta semana.</p>
          )}
          <Link to="/admin/agenda" className="mt-4 inline-block text-purple-600 dark:text-purple-400 hover:underline">
            Ver todos os agendamentos &rarr;
          </Link>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Clientes Recentes (Últimos 7 dias)</h2>
          {recentClients.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {recentClients.map(client => (
                <li key={client.id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md shadow-sm">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{client.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Último atendimento: {formatDate(client.lastServiceDate)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">Nenhum cliente atendido na última semana.</p>
          )}
           <Link to="/admin/clientes" className="mt-4 inline-block text-purple-600 dark:text-purple-400 hover:underline">
            Ver todos os clientes &rarr;
          </Link>
        </Card>
      </div>

       <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Ações Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link to="/admin/agenda?action=add" className="block p-4 text-center bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md transition-transform hover:scale-105">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
              Novo Agendamento
            </Link>
            <Link to="/admin/clientes?action=add" className="block p-4 text-center bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-transform hover:scale-105">
              <UsersIcon className="w-8 h-8 mx-auto mb-2" />
              Novo Cliente
            </Link>
             <Link to="/admin/retornos" className="block p-4 text-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-transform hover:scale-105">
              <FollowUpIcon className="w-8 h-8 mx-auto mb-2" />
              Mensagens de Retorno
            </Link>
          </div>
        </Card>
    </div>
  );
};

export default AdminDashboard;

