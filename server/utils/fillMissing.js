function fillMissing(range, startDate, data) {
    const result = [];
    const dataMap = new Map(data.map(item => [item.date, item]));
    const now = new Date();
    
    // Create a clean copy to avoid mutation issues
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    
    const endDate = new Date(now);
    endDate.setHours(0, 0, 0, 0);

    if (range === "7days" || range === "30days") {
        // Fill by day
        while (current <= endDate) {
            const key = formatDate(current, 'day');
            result.push(dataMap.get(key) || { 
                date: key, 
                revenue: 0, 
                orders: 0 
            });
            current.setDate(current.getDate() + 1);
        }
    } 
    else if (range === "3months") {
        // Fill by week
        const seenWeeks = new Set();
        
        while (current <= endDate) {
            const key = formatDate(current, 'week');
            
            // Avoid duplicate weeks
            if (!seenWeeks.has(key)) {
                seenWeeks.add(key);
                result.push(dataMap.get(key) || { 
                    date: key, 
                    revenue: 0, 
                    orders: 0 
                });
            }
            
            current.setDate(current.getDate() + 7);
        }
    } 
    else {
        // Fill by month (6months, alltime)
        // Normalize to start of month to avoid day-of-month issues
        current.setDate(1);
        endDate.setDate(1);
        
        while (current <= endDate) {
            const key = formatDate(current, 'month');
            result.push(dataMap.get(key) || { 
                date: key, 
                revenue: 0, 
                orders: 0 
            });
            current.setMonth(current.getMonth() + 1);
        }
    }

    return result;
}

function formatDate(date, type) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (type === 'day') {
        return `${year}-${month}-${day}`;
    } 
    else if (type === 'week') {
        const weekNum = getISOWeek(date);
        const weekYear = getISOWeekYear(date);
        return `Week ${weekNum} ${weekYear}`;
    } 
    else if (type === 'month') {
        return `${year}-${month}`;
    }
}

function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getISOWeekYear(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    return d.getUTCFullYear();
}

module.exports = fillMissing;