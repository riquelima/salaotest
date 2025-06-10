
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ArrowDownTrayIcon } from '../icons';
import { MONTH_NAMES, LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';
import { Appointment, Client, FinancialRecord } from '../../types';

const DataExport: React.FC = () => {
  const { clients, appointments, financialRecords } = useData();
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState<string>(''); 

  const convertToCSV = <T extends object,>(data: T[], headers: {key: keyof T, label: string}[]): string => {
    const headerRow = headers.map(h => h.label).join(',');
    const dataRows = data.map(row => 
        headers.map(header => {
            let value = String(row[header.key] ?? '');
            if (value.includes(',')) value = `"${value.replace(/"/g, '""')}"`;
            return value;
        }).join(',')
    );
    return [headerRow, ...dataRows].join('\n');
  };

  const downloadCSV = (csvString: string, filename: string) => {
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const getFilteredData = <T extends {date?: string},>(data: T[]): T[] => {
    return data.filter(item => {
        if (!item.date) return true; 
        const itemDate = new Date(item.date);
        const yearMatch = itemDate.getFullYear().toString() === filterYear;
        const monthMatch = !filterMonth || (itemDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth;
        return yearMatch && monthMatch;
    });
  };


  const handleExportClients = () => {
    const clientHeaders = [
        { key: 'id' as keyof Client, label: 'ID Cliente' },
        { key: 'name' as keyof Client, label: 'Nome' },
        { key: 'phone' as keyof Client, label: 'Telefone' },
        { key: 'lastAppointmentDate' as keyof Client, label: 'Último Atendimento' },
        { key: 'appointmentCount' as keyof Client, label: 'Total de Atendimentos' },
        { key: 'notes' as keyof Client, label: 'Observações' },
    ];
    const csvData = convertToCSV(clients, clientHeaders);
    downloadCSV(csvData, 'clientes_salao_infantil.csv');
  };

  const handleExportAppointments = () => {
    const filteredAppointments = getFilteredData(appointments.map(app => {
        const client = clients.find(c => c.id === app.clientId);
        return {
            ...app,
            clientName: client?.name || 'N/A', 
            dateOnly: new Date(app.date).toLocaleDateString('pt-BR'),
            timeOnly: new Date(app.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
        }
    }));
    const appointmentHeaders = [
        { key: 'id' as keyof Appointment, label: 'ID Agendamento' },
        { key: 'clientName' as any, label: 'Nome Cliente' }, 
        { key: 'dateOnly' as any, label: 'Data' },
        { key: 'timeOnly' as any, label: 'Hora' },
        { key: 'location' as keyof Appointment, label: 'Local' },
        { key: 'serviceValue' as keyof Appointment, label: 'Valor (R$)' },
        { key: 'notes' as keyof Appointment, label: 'Observações' },
    ];
    const csvData = convertToCSV(filteredAppointments, appointmentHeaders as any);
    downloadCSV(csvData, `agendamentos_${filterYear}${filterMonth ? '_'+filterMonth : ''}.csv`);
  };

  const handleExportFinancials = () => {
    const filteredFinancials = getFilteredData(financialRecords.map(fr => {
        const appointment = appointments.find(a => a.id === fr.appointmentId);
        const client = appointment ? clients.find(c => c.id === appointment.clientId) : undefined;
        return {
            ...fr,
            clientName: client?.name || 'N/A',
            dateOnly: new Date(fr.date).toLocaleDateString('pt-BR')
        }
    }));
     const financialHeaders = [
        { key: 'id' as keyof FinancialRecord, label: 'ID Registro' },
        { key: 'dateOnly' as any, label: 'Data' },
        { key: 'description' as keyof FinancialRecord, label: 'Descrição' },
        { key: 'clientName' as any, label: 'Cliente Associado' },
        { key: 'amount' as keyof FinancialRecord, label: 'Valor (R$)' },
    ];
    const csvData = convertToCSV(filteredFinancials, financialHeaders as any);
    downloadCSV(csvData, `financeiro_${filterYear}${filterMonth ? '_'+filterMonth : ''}.csv`);
  };
  
  const yearOptions = React.useMemo(() => {
    const years = new Set<string>();
    [...appointments, ...financialRecords].forEach(item => {
        if(item.date) years.add(new Date(item.date).getFullYear().toString())
    });
    if (!years.has(new Date().getFullYear().toString())) {
        years.add(new Date().getFullYear().toString());
    }
    return Array.from(years).sort((a,b) => parseInt(b) - parseInt(a));
  }, [appointments, financialRecords]);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className={`text-2xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] flex items-center mb-4`}>
          <ArrowDownTrayIcon className={`w-7 h-7 mr-2 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.iconColor}]`} />
          Exportar Dados
        </h2>
        <p className={`text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mb-6`}>
          Exporte seus dados em formato CSV. Para relatórios de agendamentos e financeiros, selecione o período desejado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input 
                type="number" 
                label="Filtrar por Ano:"
                placeholder="AAAA"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                list="export-year-options"
            />
            <datalist id="export-year-options">
                {yearOptions.map(year => <option key={year} value={year} />)}
            </datalist>
            <Select
                label="Filtrar por Mês (opcional):"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                options={[
                    {value: '', label: 'Todos os meses do ano'},
                    ...MONTH_NAMES.map((name, index) => ({
                        value: (index + 1).toString().padStart(2, '0'),
                        label: name,
                    }))
                ]}
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button onClick={handleExportClients} leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}>
            Exportar Clientes
          </Button>
          <Button onClick={handleExportAppointments} leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}>
            Exportar Agendamentos
          </Button>
          <Button onClick={handleExportFinancials} leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}>
            Exportar Financeiro
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DataExport;