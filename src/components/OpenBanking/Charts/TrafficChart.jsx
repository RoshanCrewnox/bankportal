import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { CHART_COLORS } from '../../../utils/chartConstants';

const TrafficChart = ({ theme, data, timeInterval = 'Min' }) => {
    const isDark = theme === 'dark';

    const getRateConfig = (interval) => {
        switch (interval) {
            case 'Sec': return { label: '', divisor: 1 };
            case 'Min': return { label: 'TPS', divisor: 60 };
            case 'Hour': return { label: 'TPM', divisor: 3600 };
            default: return { label: 'Hits', divisor: 1 };
        }
    };

    const calculateRate = (hits, interval) => {
        const config = getRateConfig(interval);
        const rate = hits / config.divisor;
        return parseFloat(rate.toFixed(2)); 
    };

    const options = {
        chart: {
            type: 'area',
            stacked: true,
            foreColor: isDark ? '#ccc' : '#373d3f',
            toolbar: {
                show: true,
                tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true }
            },
            zoom: { enabled: true }
        },
        colors: [CHART_COLORS.success, CHART_COLORS.error, CHART_COLORS.total],
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        markers: { size: 0, hover: { size: 6 } },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data.categories || [],
            labels: { style: { colors: isDark ? '#ccc' : '#373d3f' } }
        },
        yaxis: {
            title: { text: 'Hits', style: { color: isDark ? '#ccc' : '#373d3f' } },
            labels: { style: { colors: isDark ? '#ccc' : '#373d3f' } }
        },
        grid: {
            borderColor: isDark ? '#444' : '#e0e0e0'
        },
        legend: { show: false },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const baseCategory = w.globals.categoryLabels[dataPointIndex];
                const trafficConfig = getRateConfig(timeInterval);

                const successValue = series[0]?.[dataPointIndex];
                const errorValue = series[1]?.[dataPointIndex];
                const totalValue = series[2]?.[dataPointIndex];

                const successRate = successValue !== null ? calculateRate(successValue, timeInterval) : null;
                const errorRate = errorValue !== null ? calculateRate(errorValue, timeInterval) : null;
                const totalRate = totalValue !== null ? calculateRate(totalValue, timeInterval) : null;


                let tooltipHtml = `<div class="apexcharts-tooltip-title">${baseCategory}</div>`;

                if (successValue !== null) {
                    tooltipHtml += `
                        <div class="apexcharts-tooltip-series-group" style="display: flex; margin-bottom: 4px;">
                            <span class="apexcharts-tooltip-marker" style="background-color: ${CHART_COLORS.success}"></span>
                            <div class="apexcharts-tooltip-text" style="margin-left: 5px;">
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-label">Success Hits: </span>
                                    <span class="apexcharts-tooltip-text-value">${successValue}</span>
                                </div>
                                ${trafficConfig.label ? `
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-label">${trafficConfig.label}: </span>
                                    <span class="apexcharts-tooltip-text-value">${successRate}</span>
                                </div>` : ''}
                            </div>
                        </div>`;
                }

                if (errorValue !== null) {
                    tooltipHtml += `
                        <div class="apexcharts-tooltip-series-group" style="display: flex; margin-bottom: 4px;">
                            <span class="apexcharts-tooltip-marker" style="background-color: ${CHART_COLORS.error}"></span>
                            <div class="apexcharts-tooltip-text" style="margin-left: 5px;">
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-label">Error Hits: </span>
                                    <span class="apexcharts-tooltip-text-value">${errorValue}</span>
                                </div>
                                ${trafficConfig.label ? `
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-label">${trafficConfig.label}: </span>
                                    <span class="apexcharts-tooltip-text-value">${errorRate}</span>
                                </div>` : ''}
                            </div>
                        </div>`;
                }

                if (totalValue !== null) {
                    tooltipHtml += `
                        <div class="apexcharts-tooltip-series-group" style="display: flex; margin-bottom: 4px;">
                            <span class="apexcharts-tooltip-marker" style="background-color: ${CHART_COLORS.total}"></span>
                            <div class="apexcharts-tooltip-text" style="margin-left: 5px;">
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-label">Total Hits: </span>
                                    <span class="apexcharts-tooltip-text-value">${totalValue}</span>
                                </div>
                                ${trafficConfig.label ? `
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-label">${trafficConfig.label}: </span>
                                    <span class="apexcharts-tooltip-text-value">${totalRate}</span>
                                </div>` : ''}
                            </div>
                        </div>`;
                }
                return tooltipHtml;
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-36 space-y-3 pt-6">
                {[
                    { label: 'Success', value: data.stats.success.value, color: 'border-green-400', dot: 'bg-green-400' },
                    { label: 'Error', value: data.stats.error.value, color: 'border-red-400', dot: 'bg-red-400' },
                    { label: 'Total', value: data.stats.total.value, color: 'border-blue-400', dot: 'bg-blue-400' }
                ].map((stat, idx) => (
                    <div key={idx} className={`rounded-xl p-3 border-l-4 ${stat.color} ${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-all hover:translate-x-1 border`}>
                        <div className="flex justify-between items-center mb-1">
                            <div className={`text-[12px] ${isDark ? 'text-white' : 'text-gray-900'} uppercase font-bold`}>{stat.label}</div>
                            <div className={`w-3 h-3 rounded-full ${stat.dot}`} />
                        </div>
                        <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                        <div className="text-[10px] text-gray-500">Hits</div>
                    </div>
                ))}
            </div>
            <div className="grow">
                <ReactApexChart options={options} series={data.series} type="area" height={350} />
            </div>
        </div>
    );
};

export default TrafficChart;
