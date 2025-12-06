// Hippocamp Academy - Simple Analytics
// Privacy-friendly analytics using localStorage and optional external service
(function() {
    'use strict';

    const ANALYTICS_KEY = 'hippocamp_analytics';
    const SESSION_KEY = 'hippocamp_session';

    // Get or create session
    function getSession() {
        let session = sessionStorage.getItem(SESSION_KEY);
        if (!session) {
            session = {
                id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                startTime: Date.now(),
                pageViews: 0,
                events: []
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            session = JSON.parse(session);
        }
        return session;
    }

    function saveSession(session) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    // Get analytics data
    function getAnalytics() {
        try {
            const stored = localStorage.getItem(ANALYTICS_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return {
            totalVisits: 0,
            totalPageViews: 0,
            quizCompletions: 0,
            achievementsUnlocked: 0,
            avgTimeOnSite: 0,
            topPages: {},
            events: []
        };
    }

    function saveAnalytics(analytics) {
        try {
            localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
        } catch (e) {}
    }

    // Track page view
    function trackPageView(page) {
        const session = getSession();
        const analytics = getAnalytics();
        
        session.pageViews++;
        saveSession(session);
        
        analytics.totalPageViews++;
        analytics.topPages[page] = (analytics.topPages[page] || 0) + 1;
        saveAnalytics(analytics);
        
        console.log('[Analytics] Page view:', page);
    }

    // Track event
    function trackEvent(category, action, label = null, value = null) {
        const session = getSession();
        const analytics = getAnalytics();
        
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            sessionId: session.id
        };
        
        session.events.push(event);
        saveSession(session);
        
        // Keep only last 100 events in analytics
        analytics.events.push(event);
        if (analytics.events.length > 100) {
            analytics.events = analytics.events.slice(-100);
        }
        saveAnalytics(analytics);
        
        console.log('[Analytics] Event:', category, action, label);
    }

    // Track quiz completion
    function trackQuizCompletion(quizId, score, total) {
        const analytics = getAnalytics();
        analytics.quizCompletions++;
        saveAnalytics(analytics);
        
        trackEvent('quiz', 'complete', quizId, score);
    }

    // Track achievement
    function trackAchievement(achievementId) {
        const analytics = getAnalytics();
        analytics.achievementsUnlocked++;
        saveAnalytics(analytics);
        
        trackEvent('achievement', 'unlock', achievementId);
    }

    // Track share
    function trackShare(platform, contentType) {
        trackEvent('social', 'share', platform, contentType);
    }

    // Track learning path progress
    function trackPathProgress(pathId, progress) {
        trackEvent('learning', 'progress', pathId, progress);
    }

    // Get analytics summary
    function getSummary() {
        const analytics = getAnalytics();
        const topPagesArray = Object.entries(analytics.topPages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        return {
            totalVisits: analytics.totalVisits,
            totalPageViews: analytics.totalPageViews,
            quizCompletions: analytics.quizCompletions,
            achievementsUnlocked: analytics.achievementsUnlocked,
            topPages: topPagesArray,
            recentEvents: analytics.events.slice(-10)
        };
    }

    // Initialize
    function init() {
        const session = getSession();
        const analytics = getAnalytics();
        
        // First page view of session
        if (session.pageViews === 0) {
            analytics.totalVisits++;
            saveAnalytics(analytics);
        }
        
        // Track current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        trackPageView(currentPage);
        
        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackEvent('engagement', 'time_on_page', currentPage, timeSpent);
        });
        
        // Expose API
        window.HippocampAnalytics = {
            trackPageView,
            trackEvent,
            trackQuizCompletion,
            trackAchievement,
            trackShare,
            trackPathProgress,
            getSummary
        };
        
        console.log('[Analytics] Initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
