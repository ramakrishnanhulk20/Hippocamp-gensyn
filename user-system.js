// Hippocamp Academy - User Progress & Achievement System
(function() {
    'use strict';

    // ============================================
    // USER DATA MANAGEMENT
    // ============================================
    
    const STORAGE_KEY = 'hippocamp_user';
    const LEADERBOARD_KEY = 'hippocamp_leaderboard';
    
    // Default user structure
    const defaultUser = {
        id: null,
        name: 'Anonymous',
        avatar: '🦛',
        createdAt: null,
        lastVisit: null,
        streak: {
            current: 0,
            longest: 0,
            lastDate: null
        },
        quizzes: {
            main: { attempts: 0, bestScore: 0, lastScore: 0, completed: false },
            sapo: { attempts: 0, bestScore: 0, lastScore: 0, completed: false },
            checkfree: { attempts: 0, bestScore: 0, lastScore: 0, completed: false },
            noloco: { attempts: 0, bestScore: 0, lastScore: 0, completed: false },
            skippipe: { attempts: 0, bestScore: 0, lastScore: 0, completed: false },
            verde: { attempts: 0, bestScore: 0, lastScore: 0, completed: false },
            rlswarm: { attempts: 0, bestScore: 0, lastScore: 0, completed: false }
        },
        learningPaths: {
            basics: { progress: 0, completed: false, completedAt: null },
            nodeOperation: { progress: 0, completed: false, completedAt: null },
            advancedOptimization: { progress: 0, completed: false, completedAt: null },
            protocolArchitecture: { progress: 0, completed: false, completedAt: null },
            rlSwarm: { progress: 0, completed: false, completedAt: null },
            research: { papersRead: [], completed: false, completedAt: null }
        },
        achievements: [],
        totalXP: 0,
        level: 1
    };

    // Generate unique ID
    function generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load user from localStorage
    function loadUser() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const user = JSON.parse(stored);
                // Merge with defaults to handle new fields
                return { ...defaultUser, ...user };
            }
        } catch (e) {
            console.error('Failed to load user:', e);
        }
        return null;
    }

    // Save user to localStorage
    function saveUser(user) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return true;
        } catch (e) {
            console.error('Failed to save user:', e);
            return false;
        }
    }

    // Initialize or get user
    function getOrCreateUser() {
        let user = loadUser();
        if (!user) {
            user = { ...defaultUser };
            user.id = generateId();
            user.createdAt = new Date().toISOString();
        }
        
        // Update streak
        const today = new Date().toDateString();
        const lastVisit = user.lastVisit ? new Date(user.lastVisit).toDateString() : null;
        
        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                user.streak.current++;
                if (user.streak.current > user.streak.longest) {
                    user.streak.longest = user.streak.current;
                }
            } else if (lastVisit !== today) {
                user.streak.current = 1;
            }
            user.streak.lastDate = today;
        }
        
        user.lastVisit = new Date().toISOString();
        saveUser(user);
        
        return user;
    }

    // ============================================
    // ACHIEVEMENT SYSTEM
    // ============================================
    
    const ACHIEVEMENTS = {
        // Quiz Achievements
        first_quiz: {
            id: 'first_quiz',
            name: 'First Steps',
            description: 'Complete your first quiz',
            icon: '🎯',
            xp: 50,
            category: 'quiz'
        },
        perfect_score: {
            id: 'perfect_score',
            name: 'Perfect Score',
            description: 'Get 12/12 on the main quiz',
            icon: '👑',
            xp: 200,
            category: 'quiz'
        },
        quiz_master: {
            id: 'quiz_master',
            name: 'Quiz Master',
            description: 'Complete all topic quizzes',
            icon: '🏆',
            xp: 500,
            category: 'quiz'
        },
        comeback_kid: {
            id: 'comeback_kid',
            name: 'Comeback Kid',
            description: 'Improve your score on a retry',
            icon: '📈',
            xp: 75,
            category: 'quiz'
        },
        speed_demon: {
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Complete a quiz in under 2 minutes',
            icon: '⚡',
            xp: 100,
            category: 'quiz'
        },
        
        // Learning Achievements
        research_reader: {
            id: 'research_reader',
            name: 'Research Reader',
            description: 'Read all 6 research papers',
            icon: '📚',
            xp: 150,
            category: 'learning'
        },
        node_runner: {
            id: 'node_runner',
            name: 'Node Runner',
            description: 'Complete the Node Operation guide',
            icon: '🖥️',
            xp: 200,
            category: 'learning'
        },
        path_finder: {
            id: 'path_finder',
            name: 'Path Finder',
            description: 'Complete any learning path',
            icon: '🛤️',
            xp: 150,
            category: 'learning'
        },
        scholar: {
            id: 'scholar',
            name: 'Scholar',
            description: 'Complete all learning paths',
            icon: '🎓',
            xp: 1000,
            category: 'learning'
        },
        
        // Streak Achievements
        streak_3: {
            id: 'streak_3',
            name: 'Getting Started',
            description: 'Visit 3 days in a row',
            icon: '🔥',
            xp: 50,
            category: 'streak'
        },
        streak_7: {
            id: 'streak_7',
            name: 'Week Warrior',
            description: 'Visit 7 days in a row',
            icon: '🔥',
            xp: 100,
            category: 'streak'
        },
        streak_30: {
            id: 'streak_30',
            name: 'Monthly Master',
            description: 'Visit 30 days in a row',
            icon: '🔥',
            xp: 500,
            category: 'streak'
        },
        
        // Social Achievements
        social_sharer: {
            id: 'social_sharer',
            name: 'Social Butterfly',
            description: 'Share your score on X',
            icon: '🦋',
            xp: 50,
            category: 'social'
        },
        
        // Special Achievements
        early_adopter: {
            id: 'early_adopter',
            name: 'Early Adopter',
            description: 'Join Hippocamp Academy in 2024-2025',
            icon: '🌟',
            xp: 100,
            category: 'special'
        },
        hippo_lover: {
            id: 'hippo_lover',
            name: 'Hippo Lover',
            description: 'Interact with the hippo mascot 10 times',
            icon: '🦛',
            xp: 50,
            category: 'special'
        }
    };

    // Award achievement to user
    function awardAchievement(user, achievementId) {
        if (!ACHIEVEMENTS[achievementId]) return null;
        if (user.achievements.includes(achievementId)) return null;
        
        const achievement = ACHIEVEMENTS[achievementId];
        user.achievements.push(achievementId);
        user.totalXP += achievement.xp;
        
        // Level up check (100 XP per level)
        user.level = Math.floor(user.totalXP / 100) + 1;
        
        saveUser(user);
        
        // Show notification
        showAchievementNotification(achievement);
        
        return achievement;
    }

    // Check and award streak achievements
    function checkStreakAchievements(user) {
        if (user.streak.current >= 3 && !user.achievements.includes('streak_3')) {
            awardAchievement(user, 'streak_3');
        }
        if (user.streak.current >= 7 && !user.achievements.includes('streak_7')) {
            awardAchievement(user, 'streak_7');
        }
        if (user.streak.current >= 30 && !user.achievements.includes('streak_30')) {
            awardAchievement(user, 'streak_30');
        }
    }

    // Show achievement notification
    function showAchievementNotification(achievement) {
        // Remove any existing notification
        const existing = document.querySelector('.achievement-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-label">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    <div class="achievement-xp">+${achievement.xp} XP</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // ============================================
    // LEADERBOARD SYSTEM
    // ============================================
    
    // Local leaderboard (simulated - in production would be server-based)
    function getLeaderboard() {
        try {
            const stored = localStorage.getItem(LEADERBOARD_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to load leaderboard:', e);
        }
        return generateSampleLeaderboard();
    }

    function saveToLeaderboard(user, quizId, score, totalQuestions) {
        const leaderboard = getLeaderboard();
        
        const entry = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            score: score,
            total: totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            date: new Date().toISOString(),
            quizId: quizId
        };
        
        // Find existing entry for this user and quiz
        const existingIndex = leaderboard.findIndex(
            e => e.id === user.id && e.quizId === quizId
        );
        
        if (existingIndex >= 0) {
            // Update only if better score
            if (entry.score > leaderboard[existingIndex].score) {
                leaderboard[existingIndex] = entry;
            }
        } else {
            leaderboard.push(entry);
        }
        
        // Sort by score descending
        leaderboard.sort((a, b) => b.percentage - a.percentage || new Date(a.date) - new Date(b.date));
        
        // Keep top 100
        const trimmed = leaderboard.slice(0, 100);
        
        try {
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
        } catch (e) {
            console.error('Failed to save leaderboard:', e);
        }
        
        return trimmed;
    }

    function generateSampleLeaderboard() {
        const names = [
            'CryptoHippo', 'GensynMaster', 'NodeRunner42', 'AIExplorer', 
            'SwarmKing', 'DecentralDev', 'MLWizard', 'VerdeVenture',
            'PipelinePro', 'GossipGuru', 'CheckFreeChamp', 'SAPOStar',
            'TensorTitan', 'GradientGhost', 'DistributedDan', 'ParallelPete'
        ];
        const avatars = ['🦛', '🤖', '🧠', '⚡', '🔥', '🚀', '💎', '🎯', '🏆', '👑'];
        
        return names.map((name, i) => ({
            id: 'sample_' + i,
            name: name,
            avatar: avatars[i % avatars.length],
            score: 12 - Math.floor(i / 3),
            total: 12,
            percentage: Math.round(((12 - Math.floor(i / 3)) / 12) * 100),
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            quizId: 'main'
        }));
    }

    // ============================================
    // XP & LEVEL SYSTEM
    // ============================================
    
    function addXP(user, amount, reason) {
        user.totalXP += amount;
        user.level = Math.floor(user.totalXP / 100) + 1;
        saveUser(user);
        
        // Show XP gain notification
        showXPNotification(amount, reason);
        
        return user;
    }

    function showXPNotification(amount, reason) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `+${amount} XP <span>${reason}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ============================================
    // PROGRESS TRACKING
    // ============================================
    
    function updateLearningProgress(user, pathId, progress) {
        if (!user.learningPaths[pathId]) return user;
        
        user.learningPaths[pathId].progress = Math.min(100, progress);
        
        if (progress >= 100 && !user.learningPaths[pathId].completed) {
            user.learningPaths[pathId].completed = true;
            user.learningPaths[pathId].completedAt = new Date().toISOString();
            
            // Award path finder achievement
            if (!user.achievements.includes('path_finder')) {
                awardAchievement(user, 'path_finder');
            }
            
            // Check for scholar achievement (all paths complete)
            const allPaths = ['basics', 'nodeOperation', 'advancedOptimization', 'protocolArchitecture', 'rlSwarm'];
            const allComplete = allPaths.every(p => user.learningPaths[p]?.completed);
            if (allComplete && !user.achievements.includes('scholar')) {
                awardAchievement(user, 'scholar');
            }
            
            addXP(user, 100, 'Path Completed');
        }
        
        saveUser(user);
        return user;
    }

    function markResearchPaperRead(user, paperId) {
        if (!user.learningPaths.research.papersRead.includes(paperId)) {
            user.learningPaths.research.papersRead.push(paperId);
            addXP(user, 25, 'Research Paper Read');
            
            // Check if all papers read
            const allPapers = ['rlswarm', 'sapo', 'checkfree', 'skippipe', 'verde', 'noloco'];
            if (allPapers.every(p => user.learningPaths.research.papersRead.includes(p))) {
                user.learningPaths.research.completed = true;
                awardAchievement(user, 'research_reader');
            }
            
            saveUser(user);
        }
        return user;
    }

    // ============================================
    // QUIZ TRACKING
    // ============================================
    
    function recordQuizAttempt(user, quizId, score, totalQuestions) {
        if (!user.quizzes[quizId]) {
            user.quizzes[quizId] = { attempts: 0, bestScore: 0, lastScore: 0, completed: false };
        }
        
        const quiz = user.quizzes[quizId];
        const previousBest = quiz.bestScore;
        
        quiz.attempts++;
        quiz.lastScore = score;
        
        if (score > quiz.bestScore) {
            quiz.bestScore = score;
            
            // Comeback kid achievement
            if (quiz.attempts > 1 && previousBest > 0 && score > previousBest) {
                awardAchievement(user, 'comeback_kid');
            }
        }
        
        if (score >= totalQuestions * 0.6) { // 60% to pass
            quiz.completed = true;
        }
        
        // First quiz achievement
        if (!user.achievements.includes('first_quiz')) {
            awardAchievement(user, 'first_quiz');
        }
        
        // Perfect score achievement
        if (quizId === 'main' && score === 12) {
            awardAchievement(user, 'perfect_score');
        }
        
        // Check quiz master (all quizzes completed)
        const topicQuizzes = ['sapo', 'checkfree', 'noloco', 'skippipe', 'verde', 'rlswarm'];
        const allCompleted = topicQuizzes.every(q => user.quizzes[q]?.completed);
        if (allCompleted && !user.achievements.includes('quiz_master')) {
            awardAchievement(user, 'quiz_master');
        }
        
        // Add XP based on score
        const xp = Math.round((score / totalQuestions) * 50);
        addXP(user, xp, 'Quiz Completed');
        
        // Save to leaderboard
        saveToLeaderboard(user, quizId, score, totalQuestions);
        
        saveUser(user);
        return user;
    }

    // ============================================
    // HIPPO MASCOT INTERACTIONS
    // ============================================
    
    let hippoInteractions = parseInt(localStorage.getItem('hippo_interactions') || '0');
    
    function interactWithHippo() {
        hippoInteractions++;
        localStorage.setItem('hippo_interactions', hippoInteractions);
        
        if (hippoInteractions >= 10) {
            const user = getOrCreateUser();
            if (!user.achievements.includes('hippo_lover')) {
                awardAchievement(user, 'hippo_lover');
            }
        }
        
        return hippoInteractions;
    }

    // ============================================
    // INITIALIZATION & CSS INJECTION
    // ============================================
    
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Achievement Notification */
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .achievement-notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .achievement-popup {
                display: flex;
                align-items: center;
                gap: 15px;
                background: linear-gradient(135deg, rgba(26, 31, 58, 0.98), rgba(15, 20, 40, 0.98));
                border: 2px solid var(--primary-color, #FFC9D4);
                border-radius: 16px;
                padding: 20px 25px;
                box-shadow: 0 10px 40px rgba(255, 201, 212, 0.3);
                min-width: 300px;
            }
            
            .achievement-icon {
                font-size: 3em;
                animation: achievementBounce 0.6s ease-in-out;
            }
            
            @keyframes achievementBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }
            
            .achievement-info {
                flex: 1;
            }
            
            .achievement-label {
                font-size: 0.75em;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--primary-color, #FFC9D4);
                margin-bottom: 4px;
            }
            
            .achievement-name {
                font-size: 1.3em;
                font-weight: 700;
                color: #fff;
                margin-bottom: 4px;
            }
            
            .achievement-desc {
                font-size: 0.9em;
                color: rgba(255,255,255,0.7);
                margin-bottom: 6px;
            }
            
            .achievement-xp {
                font-size: 0.85em;
                font-weight: 600;
                color: #4ade80;
            }
            
            /* XP Notification */
            .xp-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.5);
                background: linear-gradient(135deg, #4ade80, #22c55e);
                color: #fff;
                font-size: 1.5em;
                font-weight: 700;
                padding: 15px 30px;
                border-radius: 50px;
                opacity: 0;
                z-index: 10001;
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .xp-notification.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .xp-notification span {
                font-size: 0.6em;
                font-weight: 400;
                opacity: 0.9;
                margin-left: 8px;
            }
            
            /* Streak Badge */
            .streak-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, #f97316, #ea580c);
                color: #fff;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.9em;
                font-weight: 600;
            }
            
            .streak-badge .streak-fire {
                animation: flamePulse 0.5s ease-in-out infinite alternate;
            }
            
            @keyframes flamePulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.2); }
            }
            
            /* Level Badge */
            .level-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, var(--primary-color, #FFC9D4), var(--primary-dark, #FFAFBF));
                color: #1a1f3a;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.9em;
                font-weight: 700;
            }
            
            /* Progress Bar */
            .progress-bar-container {
                width: 100%;
                height: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color, #FFC9D4), var(--accent-color, #FF8FA3));
                border-radius: 4px;
                transition: width 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize system
    function init() {
        injectStyles();
        const user = getOrCreateUser();
        
        // Check for early adopter achievement
        const joinYear = new Date(user.createdAt).getFullYear();
        if ((joinYear === 2024 || joinYear === 2025) && !user.achievements.includes('early_adopter')) {
            awardAchievement(user, 'early_adopter');
        }
        
        // Check streak achievements
        checkStreakAchievements(user);
        
        console.log('Hippocamp User System initialized', { level: user.level, xp: user.totalXP, streak: user.streak.current });
        
        // Expose to window for other scripts
        window.HippocampUser = {
            getUser: () => loadUser(),
            getOrCreateUser,
            saveUser,
            awardAchievement: (id) => awardAchievement(getOrCreateUser(), id),
            recordQuizAttempt: (quizId, score, total) => recordQuizAttempt(getOrCreateUser(), quizId, score, total),
            updateLearningProgress: (pathId, progress) => updateLearningProgress(getOrCreateUser(), pathId, progress),
            markResearchPaperRead: (paperId) => markResearchPaperRead(getOrCreateUser(), paperId),
            getLeaderboard,
            addXP: (amount, reason) => addXP(getOrCreateUser(), amount, reason),
            interactWithHippo,
            ACHIEVEMENTS
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
