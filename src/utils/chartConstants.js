// Exact color palette for charts
export const CHART_COLORS = {
    // General UI Colors
    success: '#4ADE80',
    error: '#F87171',
    total: '#60A5FA',
    // Latency Colors
    gateway: '#60A5FA',
    downstream: '#34D399',
    p95: '#A78BFA',
    // Multi-series Palette (for 10+ items)
    multiSeries: [
        '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
        '#F472B6', '#2DD4BF', '#FB923C', '#818CF8', '#4ADE80'
    ],
    // Status Code Colors
    statusCodes: [
        '#3B82F6', // 200 OK - Blue
        '#10B981', // 400 Bad Request - Green
        '#F59E0B', // 401 Unauthorized - Yellow
        '#EF4444', // 404 Not Found - Red
        '#8B5CF6', // 500 Server Error - Purple
    ]
};
