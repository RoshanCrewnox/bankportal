import React, { useContext } from 'react';
import { Users, Activity, ShieldCheck, Database, Zap } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import { useOpenBankingDashboard } from '../../hooks/OpenBanking/useOpenBankingDashboard';
import { TrafficChart, MatrixChart, HitsStatsSummary } from './DashboardCharts';
import OnboardedCard from '../../components/OpenBanking/OnboardedCard';

const OpenBankingDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { timeInterval, setTimeInterval, handleRefresh, handleExport, data } = useOpenBankingDashboard();
  const isDark = theme === 'dark';
  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBgClass = isDark ? 'bg-secondary-dark-bg' : 'bg-white';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`space-y-4 animate-in fade-in duration-500 pb-10 ${textPrimaryClass}`}>
      <style>
        {`
          .apexcharts-tooltip {
            background: ${isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
            border: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'} !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
          }
        `}
      </style>

      {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold">Open Banking Dashboard</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Real-time overview of your ecosystem performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className={`px-4 py-2 text-sm font-medium ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-600'} border rounded-lg hover:bg-gray-50 transition-colors`}>
            Export Data
          </button>
          <button onClick={handleRefresh} className="px-4 py-2 text-sm font-medium text-white bg-primary-orange hover:bg-primary-orange/90 rounded-lg shadow-lg shadow-primary-orange/20 transition-all">
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-8xl mx-auto space-y-4">
        {/* Row 1: Hit Statistics + 4 Onboarded Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className={`lg:col-span-4 rounded-2xl p-6 border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
                <HitsStatsSummary theme={theme} />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <OnboardedCard title="Onboarded TPPs" subscribed={12} drafts={2} published={10} Icon={Users} />
                <OnboardedCard title="Onboarded APIS" subscribed={45} drafts={5} published={40} Icon={Database} />
                <OnboardedCard title="Onboarded Products" subscribed={28} drafts={3} published={25} Icon={Zap} />
                <OnboardedCard title="Onboarded Applications" subscribed={150} drafts={20} published={130} Icon={ShieldCheck} />
            </div>
        </div>

        {/* Row 2: Total Traffic full-width */}
        <div className={`rounded-2xl p-6 border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">Total Traffic (Last 24hr)</h3>
            </div>
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
              {['Min', 'Hour'].map(interval => (
                <button 
                  key={interval}
                  onClick={() => setTimeInterval(interval)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${timeInterval === interval ? 'bg-primary-orange text-white shadow-sm' : 'text-gray-500'}`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>
          <TrafficChart theme={theme} data={data.traffic} timeInterval={timeInterval} />
        </div>

        {/* Row 3: 3x2 Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`rounded-2xl border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
                <MatrixChart theme={theme} type="bar" title="API Matrix top 10" height={450} labels={data.matrix.api.labels} data={data.matrix.api.data}  />
            </div>
            <div className={`rounded-2xl border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
                <MatrixChart theme={theme} type="pie" title="Product Matrix top 10" height={450} legendPosition="bottom" labels={data.matrix.product.labels} data={data.matrix.product.data} />
            </div>
            <div className={`rounded-2xl border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
                <MatrixChart theme={theme} type="donut" title="TPP matrix top 10" height={450} legendPosition="bottom" labels={data.matrix.tpp.labels} data={data.matrix.tpp.data} />
            </div>
            <div className={`rounded-2xl border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
                <MatrixChart theme={theme} type="pie" title="Bifurcation AISP or PISP" height={450} legendPosition="bottom" labels={data.matrix.aispPisp.labels} data={data.matrix.aispPisp.data} />
            </div>
            <div className={`rounded-2xl border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg!`}>
                <MatrixChart theme={theme} type="bar" title="Consent Type Distribution" height={450} labels={data.matrix.consent.labels} data={data.matrix.consent.data} />
            </div>
            <div className={`rounded-2xl border ${borderClass} ${cardBgClass} dark:bg-secondary-dark-bg! p-6 flex flex-col items-center justify-center text-center`}>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Health Check</h3>
                <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <span className="text-sm font-medium">Gateway Status</span>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-500 font-bold uppercase">Healthy</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <span className="text-sm font-medium">Database Latency</span>
                        <span className="text-xs font-bold">12ms</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <span className="text-sm font-medium">System Uptime</span>
                        <span className="text-xs font-bold">99.98%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OpenBankingDashboard;
