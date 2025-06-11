
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Appointment, Client } from '../../types';
import { Card } from '../../components/ui';
import { CalendarIcon, ProfileIcon, ChartBarIcon, WhatsAppIcon as FollowUpIcon, SparklesIcon } from '../../components/icons'; 
import { APPOINTMENTS_KEY, CLIENTS_KEY, PREDEFINED_CLIENTS } from '../../constants';
import { formatDate, filterAppointmentsByPeriod } from '../../utils/helpers';

const AdminDashboard: React.FC = () => {
  const { config, theme } = useAppContext();
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  const [clients] = useLocalStorage<Client[]>(CLIENTS_KEY, PREDEFINED_CLIENTS);

  const today = new Date();
  const todayStart = new Date(today.setHours(0,0,0,0));
  
  const upcomingAppointments = filterAppointmentsByPeriod(appointments, 'week', new Date())
    .filter(app => new Date(app.date) >= todayStart && (app.status === 'pending' || app.status === 'confirmed'))
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const appointmentsTodayCount = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate.getFullYear() === todayStart.getFullYear() &&
           appDate.getMonth() === todayStart.getMonth() &&
           appDate.getDate() === todayStart.getDate() &&
           (app.status === 'pending' || app.status === 'confirmed');
  }).length;
  
  const stats = [
    { title: "Agenda Sem.", value: upcomingAppointments.length, icon: <CalendarIcon className="w-6 h-6 text-white"/>, bgColor: "bg-[#FBBF24]", hoverBgColor: "hover:bg-[#F59E0B]", link: "/admin/agenda" },
    { title: "Clientes", value: clients.length, icon: <ProfileIcon className="w-6 h-6 text-white"/>, bgColor: "bg-[#4ADE80]", hoverBgColor: "hover:bg-[#22C55E]", link: "/admin/clientes" }, 
    { title: "Hoje (P/C)", value: appointmentsTodayCount, icon: <SparklesIcon className="w-6 h-6 text-white"/>, bgColor: "bg-[#F87171]", hoverBgColor: "hover:bg-[#EF4444]", link: "/admin/agenda" },
  ];

  const stylistDisplayName = config.stylistName.includes('|') ? config.stylistName.split(' | ')[0] : config.stylistName;
  const mainTextColor = theme === 'dark' ? 'text-[#F4F4F5]' : 'text-[#111827]';
  const cardTitleColor = theme === 'dark' ? 'text-[#E5E7EB]' : 'text-[#1F2937]';


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${mainTextColor}`}>Bem vindo(a), {stylistDisplayName}!</h1>
        <img
          src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logo1.png"
          alt="Logo Salão"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shadow-md ring-2 ring-[#8B5CF6]/50 dark:ring-[#A78BFA]/50"
        />
      </div>
      
      <Card>
        <h2 className={`text-xl font-semibold mb-4 ${cardTitleColor}`}>Ações Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link to="/admin/agenda?action=add" className="block p-4 text-center bg-[#FBBF24] hover:bg-[#F59E0B] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-white" />
            Novo Agendamento
          </Link>
          <Link to="/admin/clientes?action=add" className="block p-4 text-center bg-[#4ADE80] hover:bg-[#22C55E] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105">
            <ProfileIcon className="w-8 h-8 mx-auto mb-2 text-white" /> 
            Novo Cliente
          </Link>
          <Link to="/admin/retornos" className="block p-4 text-center bg-[#F87171] hover:bg-[#EF4444] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105">
            <FollowUpIcon className="w-8 h-8 mx-auto mb-2 text-white" />
            Lembrar retorno
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map(stat => (
          <Link to={stat.link} key={stat.title} className="block">
            <Card className={`!p-3 text-center ${stat.bgColor} ${stat.hoverBgColor} shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center justify-center aspect-square`}>
              <div className={`p-1.5 mb-1 rounded-full`}>
                {stat.icon}
              </div>
                <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs font-medium text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">{stat.title}</p>
            </Card>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default AdminDashboard;