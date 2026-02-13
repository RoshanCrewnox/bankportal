import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { CHART_COLORS } from '../../../utils/chartConstants';

const renderInteractiveLegend = (data, colors, theme, textPrimaryClass, layout = 'vertical') => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const containerClasses = layout === 'horizontal'
        ? "flex flex-wrap justify-center gap-x-4 gap-y-2 max-h-[100px] overflow-y-auto custom-scrollbar w-full"
        : "flex flex-col space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar";

    return (
        <div className={containerClasses}>
            {data.map((item, index) => (
                <div key={index} className="flex items-center p-1 rounded cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/5">
                    <div className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: colors[index] || '#000' }}></div>
                    <span className={`text-[11px] font-medium truncate ${textPrimaryClass}`}>{item}</span>
                </div>
            ))}
        </div>
    );
};

const MatrixChart = ({ theme, type = 'bar', title, labels = [], data = [], height = 350, legendPosition = 'right' }) => {
    const isDark = theme === 'dark';
    const textPrimaryClass = isDark ? 'text-gray-300' : 'text-gray-700';

    const displayLabels = labels.length ? labels : ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];
    const displayData = data.length ? data : (type === 'bar' ? [400, 430, 448, 470, 540] : [44, 55, 41, 17, 15]);

    const options = {
        chart: {
            type: type === 'bar' ? 'bar' : (type === 'pie' ? 'pie' : 'donut'),
            foreColor: isDark ? '#ccc' : '#373d3f',
            toolbar: {
                show: true,
                tools: { download: true }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                barHeight: '60%',
                distributed: true,
                dataLabels: { position: 'top' }
            },
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: type === 'donut',
                        total: {
                            show: true,
                            label: 'Total',
                            color: isDark ? '#fff' : '#373d3f',
                            fontSize: '14px',
                            fontWeight: 600,
                            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 700,
                            color: isDark ? '#fff' : '#111827'
                        },
                        name: {
                            show: true,
                            fontSize: '12px',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }
                    }
                },
                customScale: 0.8
            }
        },
        colors: CHART_COLORS.multiSeries,
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: { colors: [isDark ? '#fff' : '#111827'], fontSize: '10px' },
            formatter: function (val, opt) {
                if (type === 'bar') return val.toLocaleString();
                if ((type === 'pie' || type === 'donut') && typeof val === 'number') {
                    return Number(val).toFixed(2) + "%";
                }
                return val;
            },
            offsetX: 0,
        },
        stroke: { show: type !== 'bar', width: 2, colors: [isDark ? '#2F3349' : '#fff'] },
        legend: { show: false },
        xaxis: {
            categories: displayLabels,
            labels: { style: { colors: isDark ? '#ccc' : '#373d3f' } }
        },
        yaxis: {
            labels: { 
                show: type === 'bar',
                style: { colors: isDark ? '#ccc' : '#373d3f' },
                offsetX: -30 
            }
        },
        grid: { borderColor: isDark ? '#444' : '#e0e0e0' },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: {
                formatter: (val, opts) => {
                    if (type === 'pie' || type === 'donut') {
                        const total = opts.globals.seriesTotals.reduce((a, b) => a + b, 0);
                        const percent = ((val / total) * 100).toFixed(1);
                        return `${val} (${percent}%)`;
                    }
                    return val + " hits";
                }
            }
        },
        noData: {
            text: "No data available",
            align: 'center',
            verticalAlign: 'middle',
            style: {
                color: isDark ? '#ccc' : '#373d3f',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
            }
        }
    };

    const series = (type === 'bar')
        ? [{ name: 'Hits', data: displayData }]
        : displayData;

    const isLegendBottom = legendPosition === 'bottom';
    let containerClasses = `flex w-full gap-4`;
    if (type === 'bar') {
        containerClasses += ' flex-col justify-end grow';
    } else if (isLegendBottom) {
        containerClasses += ' flex-col grow ';
    } else {
        containerClasses += ' flex-row items-center grow ';
    }

    return (
        <div className="flex flex-col h-full p-6 ">
            <h3 className={`text-md text-start font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{title}</h3>
            <div className={containerClasses}>
                <div className={`${type === 'bar' ? 'w-full relative' : 'grow w-full relative'}`}>
                    <ReactApexChart options={{ ...options, chart: { ...options.chart, toolbar: { ...options.chart.toolbar, offsetX: -10 } } }} series={series} type={options.chart.type} width="100%" height={type === 'bar' ? height - 0 : height - (isLegendBottom ? 50 : 100)} />
                </div>
                {(type === 'pie' || type === 'donut') && (
                    <div className={isLegendBottom ? "w-full " : "w-1/3 min-w-[120px]"}>
                        {renderInteractiveLegend(displayLabels, CHART_COLORS.multiSeries, isDark ? 'dark' : 'light', textPrimaryClass, isLegendBottom ? 'horizontal' : 'vertical')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatrixChart;
