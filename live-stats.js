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

    // Parse a formatted string like "90.3K", "$2.4M" into a raw number
    function parseFormatted(text) {
        if (!text) return { value: 0, isCurrency: false };
        const isCurrency = text.trim().startsWith('$');
        const clean = text.replace(/[^0-9\.KM]/gi, '');
        let mult = 1;
        let base = clean;
        if (/M$/i.test(clean)) { mult = 1_000_000; base = clean.slice(0, -1); }
        else if (/K$/i.test(clean)) { mult = 1_000; base = clean.slice(0, -1); }
        const num = parseFloat(base);
        if (isNaN(num)) return { value: 0, isCurrency };
        return { value: Math.round(num * mult), isCurrency };
    }

    // Animate numeric value changes
    function animateCount(element, from, to, duration, formatter) {
        const start = performance.now();
        function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round(from + (to - from) * eased);
            element.textContent = formatter ? formatter(current) : String(current);
            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // Update a single stat element with animation and loading removal
    function updateStat(elementId, value, formatter = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Compute target number
        const target = typeof value === 'number' ? value : Number(value) || 0;
        // Parse current displayed value to animate from
        const { value: currentRaw } = parseFormatted(element.textContent);

        // Remove loading state if present
        element.classList.remove('stat-loading');

        // Add update pulse class
        element.classList.add('stat-updating');
        // Animate count-up for better UX
        animateCount(element, currentRaw, target, 600, formatter);
        // Remove pulse after short delay
        setTimeout(() => {
            element.classList.remove('stat-updating');
        }, 700);
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

    // Toggle loading state for all stat values
    function setLoadingState(isLoading) {
        const ids = ['live-nodes', 'live-models', 'live-verifications', 'live-compute', 'live-rewards', 'live-countries'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (isLoading) {
                el.classList.add('stat-loading');
                el.setAttribute('aria-busy', 'true');
            } else {
                el.classList.remove('stat-loading');
                el.removeAttribute('aria-busy');
            }
        });
    }

    // Show/hide a lightweight error message in the stats section
    function setStatsError(show) {
        const section = document.getElementById('stats');
        if (!section) return;
        section.classList.toggle('stats-error', !!show);
        let msg = section.querySelector('.stats-error-msg');
        if (show) {
            if (!msg) {
                msg = document.createElement('div');
                msg.className = 'stats-error-msg';
                msg.textContent = 'Live stats are temporarily unavailable. Retrying…';
                const container = section.querySelector('.container') || section;
                container.appendChild(msg);
            }
        } else if (msg) {
            msg.remove();
        }
    }

    // Main fetch function - tries both APIs
    async function fetchNetworkStats() {
        console.log('Fetching network stats...');
        setLoadingState(true);
        setStatsError(false);

        // Try dashboard API first
        const dashboardSuccess = await fetchDashboardStats();
        
        // If dashboard fails, try Alchemy
        let success = dashboardSuccess;
        if (!dashboardSuccess) {
            success = await fetchAlchemyStats();
        }

        if (!success) {
            setStatsError(true);
        }

        setLoadingState(false);
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

            /* Loading skeleton for stats */
            .stat-value.stat-loading {
                position: relative;
                color: transparent !important;
            }
            .stat-value.stat-loading::after {
                content: '';
                display: block;
                height: 1em;
                border-radius: 6px;
                background: linear-gradient(90deg, rgba(255,201,212,0.15), rgba(255,201,212,0.35), rgba(255,201,212,0.15));
                background-size: 200% 100%;
                animation: shimmer 1.2s infinite;
            }
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            /* Error message styling */
            #stats.stats-error .stats-error-msg {
                margin-top: 16px;
                padding: 10px 14px;
                border: 1px dashed rgba(255,201,212,0.4);
                background: rgba(255,201,212,0.08);
                color: #fff;
                border-radius: 8px;
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize live stats
    function init() {
        // Add animation and UX styles
        addAnimationStyles();
        // Mark aria-live for stat values
        ['live-nodes','live-models','live-verifications','live-compute','live-rewards','live-countries'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('aria-live', 'polite');
        });
        
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
