// Live Network Stats Fetcher for Gensyn
(function() {
    'use strict';

    const API_ENDPOINTS = {
        dashboard: 'https://dashboard.gensyn.ai/api/stats',
        alchemy: 'https://gensyn-testnet.explorer.alchemy.com/api/stats'
    };

    const REFRESH_INTERVAL = 30000; // 30 seconds

    // Format number with K/M suffix
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Format currency
    function formatCurrency(num) {
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return '$' + (num / 1000).toFixed(1) + 'K';
        }
        return '$' + num.toString();
    }

    // Update a single stat element with animation
    function updateStat(elementId, value, formatter = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const formattedValue = formatter ? formatter(value) : value.toString();
        
        // Add update animation
        element.classList.add('stat-updating');
        setTimeout(() => {
            element.textContent = formattedValue;
            element.classList.remove('stat-updating');
        }, 100);
    }

    // Fetch stats from dashboard
    async function fetchDashboardStats() {
        try {
            const response = await fetch(API_ENDPOINTS.dashboard);
            if (!response.ok) throw new Error('Dashboard API failed');
            
            const data = await response.json();
            
            // Update stats if they exist in the response
            if (data.activeNodes) updateStat('live-nodes', data.activeNodes, formatNumber);
            if (data.modelsTrained) updateStat('live-models', data.modelsTrained, formatNumber);
            if (data.verifications) updateStat('live-verifications', data.verifications, formatNumber);
            if (data.computePower) updateStat('live-compute', data.computePower);
            if (data.rewards) updateStat('live-rewards', data.rewards, formatCurrency);
            if (data.countries) updateStat('live-countries', data.countries);
            
            console.log('Dashboard stats updated:', data);
            return true;
        } catch (error) {
            console.warn('Dashboard stats fetch failed:', error);
            return false;
        }
    }

    // Fetch stats from Alchemy explorer
    async function fetchAlchemyStats() {
        try {
            const response = await fetch(API_ENDPOINTS.alchemy);
            if (!response.ok) throw new Error('Alchemy API failed');
            
            const data = await response.json();
            
            // Update stats if they exist in the response
            if (data.nodes) updateStat('live-nodes', data.nodes, formatNumber);
            if (data.models) updateStat('live-models', data.models, formatNumber);
            if (data.verifications) updateStat('live-verifications', data.verifications, formatNumber);
            if (data.tflops) updateStat('live-compute', data.tflops);
            if (data.rewards) updateStat('live-rewards', data.rewards, formatCurrency);
            if (data.countries) updateStat('live-countries', data.countries);
            
            console.log('Alchemy stats updated:', data);
            return true;
        } catch (error) {
            console.warn('Alchemy stats fetch failed:', error);
            return false;
        }
    }

    // Main fetch function - tries both APIs
    async function fetchNetworkStats() {
        console.log('Fetching network stats...');
        
        // Try dashboard API first
        const dashboardSuccess = await fetchDashboardStats();
        
        // If dashboard fails, try Alchemy
        if (!dashboardSuccess) {
            await fetchAlchemyStats();
        }
    }

    // Add CSS for stat update animation
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stat-updating {
                animation: statPulse 0.3s ease-in-out;
            }
            
            @keyframes statPulse {
                0%, 100% {
                    transform: scale(1);
                    color: inherit;
                }
                50% {
                    transform: scale(1.1);
                    color: var(--primary-color);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize live stats
    function init() {
        // Add animation styles
        addAnimationStyles();
        
        // Fetch immediately
        fetchNetworkStats();
        
        // Set up periodic refresh
        setInterval(fetchNetworkStats, REFRESH_INTERVAL);
        
        console.log('Live network stats initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
