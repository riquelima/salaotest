
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext'; 
import { FinancialRecord } from '../../types';
import Card from '../ui/Card';
import { CurrencyDollarIcon } from '../icons';
import { MONTH_NAMES, LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Input from '../ui/Input';
import Select from '../ui/Select';

const FinancialControl: React.FC = () => {
  const { financialRecords, appointments, clients } = useData();
  const { colors: themeColors } = useTheme(); 
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0')); 

  const monthlyIncome = useMemo(() => {
    const incomeByMonth: { [month: string]: number } = {};
    MONTH_NAMES.forEach((_, index) => {
        const monthKey = `${filterYear}-${(index + 1).toString().padStart(2, '0')}`;
        incomeByMonth[monthKey] = 0;
    });

    financialRecords.forEach(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear().toString();
      if (recordYear === filterYear) {
        const monthKey = `${recordYear}-${(recordDate.getMonth() + 1).toString().padStart(2, '0')}`;
        incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + record.amount;
      }
    });
    
    return MONTH_NAMES.map((name, index) => ({
      name: name.substring(0,3), 
      monthFullName: name,
      monthKey: `${filterYear}-${(index + 1).toString().padStart(2, '0')}`,
      Ganhos: incomeByMonth[`${filterYear}-${(index + 1).toString().padStart(2, '0')}`] || 0,
    }));
  }, [financialRecords, filterYear]);

  const currentMonthKey = `${filterYear}-${filterMonth}`;
  const currentMonthData = monthlyIncome.find(m => m.monthKey === currentMonthKey);
  const totalMonthIncome = currentMonthData ? currentMonthData.Ganhos : 0;
  
  const totalYearIncome = useMemo(() => {
    return monthlyIncome.reduce((sum, month) => sum + month.Ganhos, 0);
  }, [monthlyIncome]);
  
  const recentTransactions = useMemo(() => {
    return financialRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear().toString() === filterYear && 
               (recordDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth;
      })
      .map(record => {
        const appointment = appointments.find(a => a.id === record.appointmentId);
        const client = appointment ? clients.find(c => c.id === appointment.clientId) : undefined;
        return {
          ...record,
          clientName: client?.name || 'N/A'
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [financialRecords, appointments, clients, filterYear, filterMonth]);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    financialRecords.forEach(r => years.add(new Date(r.date).getFullYear().toString()));
    if (!years.has(new Date().getFullYear().toString())) {
        years.add(new Date().getFullYear().toString());
    }
    return Array.from(years).sort((a,b) => parseInt(b) - parseInt(a));
  }, [financialRecords]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className={`text-2xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] flex items-center`}>
            <CurrencyDollarIcon className={`w-7 h-7 mr-2 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.iconColor}]`} />
            Controle Financeiro
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
                type="number" 
                label="Selecionar Ano:"
                placeholder="AAAA"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                list="year-options"
            />
            <datalist id="year-options">
                {yearOptions.map(year => <option key={year} value={year} />)}
            </datalist>
            <Select
                label="Selecionar Mês:"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                options={MONTH_NAMES.map((name, index) => ({
                    value: (index + 1).toString().padStart(2, '0'),
                    label: name,
                }))}
            />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-semibold mb-1 text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>Resumo do Mês ({MONTH_NAMES[parseInt(filterMonth)-1]}/{filterYear})</h3>
          <p className={`text-3xl font-bold text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>
            R$ {totalMonthIncome.toFixed(2)}
          </p>
        </Card>
        <Card>
          <h3 className={`text-lg font-semibold mb-1 text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>Resumo do Ano ({filterYear})</h3>
          <p className={`text-3xl font-bold text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>
            R$ {totalYearIncome.toFixed(2)}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className={`text-xl font-semibold mb-4 text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>Ganhos Mensais ({filterYear})</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyIncome} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
              <XAxis dataKey="name" stroke={themeColors.chartText} />
              <YAxis stroke={themeColors.chartText} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: themeColors.cardBackground, 
                    border: `1px solid ${themeColors.borderColor}`, 
                    borderRadius: '0.5rem',
                }}
                labelStyle={{ color: themeColors.textPrimary, fontWeight: 'bold' }}
                itemStyle={{ color: themeColors.textSecondary }}
                formatter={(value: number, name: string, props: any) => [`R$${value.toFixed(2)} (${props.payload.monthFullName})`, "Ganhos"]}
              />
              <Legend wrapperStyle={{ color: themeColors.textSecondary }} />
              <Bar dataKey="Ganhos" fill={themeColors.primary === DARK_THEME_CONFIG.primary /* Notion primary is dark */ ? DARK_THEME_CONFIG.textSecondary : themeColors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className={`text-xl font-semibold mb-4 text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>Transações Recentes ({MONTH_NAMES[parseInt(filterMonth)-1]}/{filterYear})</h3>
        {recentTransactions.length > 0 ? (
          <ul className="space-y-3">
            {recentTransactions.map(record => (
              <li key={record.id} className={`p-3 rounded-md bg-[${LIGHT_THEME_CONFIG.background}] dark:bg-[${DARK_THEME_CONFIG.background}] flex justify-between items-center border border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}]`}>
                <div>
                  <p className={`font-medium text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>{record.description || `Serviço para ${record.clientName}`}</p>
                  <p className={`text-xs text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>{new Date(record.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`font-semibold text-green-600 dark:text-green-400`}>R$ {record.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Nenhuma transação registrada para este mês/ano.</p>
        )}
      </Card>
    </div>
  );
};

export default FinancialControl;