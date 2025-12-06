// Hippocamp Academy - Dashboard UI Component
(function() {
    'use strict';

    // Wait for user system to be ready
    function waitForUserSystem(callback) {
        if (window.HippocampUser) {
            callback();
        } else {
            setTimeout(() => waitForUserSystem(callback), 100);
        }
    }

    // ============================================
    // GLOSSARY DATA
    // ============================================
    
    const GLOSSARY = [
        {
            term: 'Gensyn',
            definition: 'A decentralized compute protocol for machine learning that creates a global marketplace connecting compute providers with AI developers.',
            category: 'core',
            tags: ['protocol', 'decentralized', 'compute']
        },
        {
            term: 'RL Swarm',
            definition: 'Reinforcement Learning Swarm - A peer-to-peer system where multiple AI models train collaboratively, sharing insights and learning from collective experiences.',
            category: 'training',
            tags: ['reinforcement learning', 'distributed', 'collaborative']
        },
        {
            term: 'Judge',
            definition: 'An autonomous model verification system that ensures computation integrity and consensus in a trustless manner across the Gensyn network.',
            category: 'verification',
            tags: ['verification', 'consensus', 'security']
        },
        {
            term: 'SAPO',
            definition: 'Selective Activation of Policy Optimization - A meta-algorithm that wraps around policy gradient algorithms for more efficient language model post-training.',
            category: 'research',
            tags: ['optimization', 'policy gradient', 'LLM']
        },
        {
            term: 'CheckFree',
            definition: 'A fault tolerance method that reconstructs lost gradients from remaining workers using gradient algebra, eliminating the need for checkpointing.',
            category: 'research',
            tags: ['fault tolerance', 'gradients', 'distributed']
        },
        {
            term: 'NoLoCo',
            definition: 'No Local Communication - Replaces global synchronization (all-reduce) with gossip-based gradient exchange for efficient distributed training.',
            category: 'research',
            tags: ['communication', 'gossip', 'synchronization']
        },
        {
            term: 'SkipPipe',
            definition: 'Pipeline parallelism optimization that strategically skips backward pass communications for certain micro-batches to reduce bandwidth requirements.',
            category: 'research',
            tags: ['pipeline', 'parallelism', 'optimization']
        },
        {
            term: 'Verde',
            definition: 'Verification system using probabilistic sampling combined with zero-knowledge cryptographic proofs to verify ML computations on untrusted nodes.',
            category: 'research',
            tags: ['verification', 'cryptography', 'zero-knowledge']
        },
        {
            term: 'Testnet',
            definition: 'A test network where developers can experiment with the Gensyn protocol without using real tokens or affecting the main network.',
            category: 'network',
            tags: ['testing', 'development', 'network']
        },
        {
            term: 'Node Operator',
            definition: 'A participant who runs Gensyn node software, contributing compute power to the network and earning rewards for valid computations.',
            category: 'network',
            tags: ['operator', 'compute', 'rewards']
        },
        {
            term: 'Gossip Protocol',
            definition: 'A communication method where nodes share information with random neighbors, allowing data to spread across the network without central coordination.',
            category: 'network',
            tags: ['communication', 'peer-to-peer', 'decentralized']
        },
        {
            term: 'All-Reduce',
            definition: 'A collective operation in distributed computing where all nodes contribute data and receive the combined result. NoLoCo aims to replace this.',
            category: 'training',
            tags: ['synchronization', 'collective', 'communication']
        },
        {
            term: 'Gradient',
            definition: 'The derivative of the loss function with respect to model parameters, used to update weights during training.',
            category: 'ml-basics',
            tags: ['training', 'optimization', 'backpropagation']
        },
        {
            term: 'Byzantine Fault Tolerance',
            definition: 'The ability of a system to continue operating correctly even when some nodes fail or behave maliciously.',
            category: 'verification',
            tags: ['security', 'fault tolerance', 'consensus']
        },
        {
            term: 'Pipeline Parallelism',
            definition: 'A distributed training technique where different layers of a model are placed on different devices, processing micro-batches in a pipeline.',
            category: 'training',
            tags: ['parallelism', 'distributed', 'layers']
        }
    ];

    // ============================================
    // HIPPO MASCOT MESSAGES
    // ============================================
    
    const HIPPO_MESSAGES = {
        greeting: [
            "Hey there! 🦛 Ready to learn about Gensyn today?",
            "Welcome back! Let's dive into decentralized AI!",
            "Hi! I'm Hippo, your learning companion! 🎓",
            "Great to see you! Want to try a quiz?"
        ],
        streak: [
            "Amazing! You're on a {streak} day streak! 🔥",
            "Keep it up! {streak} days and counting!",
            "You're unstoppable! {streak} days in a row!"
        ],
        quiz_encourage: [
            "Ready to test your knowledge? Take a quiz!",
            "I bet you can score higher this time! 💪",
            "The quiz is waiting for you! Let's go!"
        ],
        achievement: [
            "You just unlocked an achievement! Check it out!",
            "Woah! You're earning badges like a pro!",
            "Achievement unlocked! You're amazing! 🏆"
        ],
        tip: [
            "Tip: Read the research papers to ace the hard questions!",
            "Did you know? Gensyn has over 30K active nodes!",
            "Pro tip: Share your score on X for extra engagement!",
            "Hint: The glossary has all the terms you need to know!"
        ],
        idle: [
            "Click me for a tip! 🦛",
            "Need help? I'm here!",
            "Psst... try the quiz!",
            "Explore the dashboard!"
        ]
    };

    function getRandomMessage(category, replacements = {}) {
        const messages = HIPPO_MESSAGES[category];
        if (!messages || messages.length === 0) return '';
        let msg = messages[Math.floor(Math.random() * messages.length)];
        for (const [key, value] of Object.entries(replacements)) {
            msg = msg.replace(`{${key}}`, value);
        }
        return msg;
    }

    // ============================================
    // DASHBOARD HTML GENERATION
    // ============================================
    
    function createDashboardHTML() {
        return `
            <div id="dashboardModal" class="dashboard-modal" role="dialog" aria-modal="true">
                <div class="dashboard-overlay" onclick="window.HippocampDashboard.close()"></div>
                <div class="dashboard-container">
                    <div class="dashboard-header">
                        <h2 class="dashboard-title">
                            <span>🦛</span> My Progress
                        </h2>
                        <button class="dashboard-close" onclick="window.HippocampDashboard.close()" aria-label="Close dashboard">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="dashboard-tabs">
                        <button class="dashboard-tab active" data-tab="overview">Overview</button>
                        <button class="dashboard-tab" data-tab="leaderboard">Leaderboard</button>
                        <button class="dashboard-tab" data-tab="achievements">Achievements</button>
                        <button class="dashboard-tab" data-tab="paths">Learning Paths</button>
                        <button class="dashboard-tab" data-tab="glossary">Glossary</button>
                    </div>
                    
                    <div class="dashboard-content">
                        <!-- Overview Panel -->
                        <div class="dashboard-panel active" id="panel-overview">
                            <div id="userProfileCard" class="user-profile-card"></div>
                            <div id="streakDisplay" class="streak-display"></div>
                            <h3 style="color: #fff; margin-bottom: 20px;">Recent Activity</h3>
                            <div id="recentActivity"></div>
                        </div>
                        
                        <!-- Leaderboard Panel -->
                        <div class="dashboard-panel" id="panel-leaderboard">
                            <h3 style="color: #fff; margin-bottom: 20px;">🏆 Top Quiz Scores</h3>
                            <div id="leaderboardContainer" class="leaderboard-container"></div>
                        </div>
                        
                        <!-- Achievements Panel -->
                        <div class="dashboard-panel" id="panel-achievements">
                            <div id="achievementsProgress" style="margin-bottom: 25px;"></div>
                            <div id="achievementsGrid" class="achievements-grid"></div>
                        </div>
                        
                        <!-- Learning Paths Panel -->
                        <div class="dashboard-panel" id="panel-paths">
                            <div id="pathsGrid" class="paths-grid"></div>
                        </div>
                        
                        <!-- Glossary Panel -->
                        <div class="dashboard-panel" id="panel-glossary">
                            <div class="glossary-search">
                                <i class="fas fa-search"></i>
                                <input type="text" id="glossarySearch" placeholder="Search terms..." oninput="window.HippocampDashboard.filterGlossary(this.value)">
                            </div>
                            <div class="glossary-categories" id="glossaryCategories"></div>
                            <div id="glossaryList" class="glossary-list"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Hippo Mascot -->
            <div class="hippo-mascot" id="hippoMascot" onclick="window.HippocampDashboard.hippoClick()">
                🦛
                <div class="hippo-speech" id="hippoSpeech">
                    <button class="hippo-speech-close" onclick="event.stopPropagation(); window.HippocampDashboard.hideSpeech()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="hippo-speech-text" id="hippoSpeechText"></div>
                </div>
            </div>
            
            <!-- Mobile Bottom Navigation -->
            <nav class="mobile-nav">
                <div class="mobile-nav-items">
                    <a href="index.html" class="mobile-nav-item">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="learning-paths.html" class="mobile-nav-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Learn</span>
                    </a>
                    <a href="code-playground.html" class="mobile-nav-item">
                        <i class="fas fa-gamepad"></i>
                        <span>Quiz</span>
                    </a>
                    <a href="#" class="mobile-nav-item" onclick="event.preventDefault(); window.HippocampDashboard.open()">
                        <i class="fas fa-chart-line"></i>
                        <span>Progress</span>
                    </a>
                </div>
            </nav>
        `;
    }

    // ============================================
    // DASHBOARD RENDERING FUNCTIONS
    // ============================================
    
    function renderUserProfile(user) {
        const container = document.getElementById('userProfileCard');
        if (!container) return;
        
        const xpForNextLevel = user.level * 100;
        const xpProgress = (user.totalXP % 100);
        const xpPercentage = Math.round((xpProgress / 100) * 100);
        
        container.innerHTML = `
            <div class="user-avatar" onclick="window.HippocampDashboard.changeAvatar()">
                ${user.avatar}
            </div>
            <div class="user-info">
                <div class="user-name">
                    <input type="text" id="userNameInput" value="${user.name}" 
                           onchange="window.HippocampDashboard.updateName(this.value)"
                           placeholder="Enter your name">
                    <span class="level-badge">Level ${user.level}</span>
                </div>
                <div class="user-stats">
                    <div class="user-stat">
                        <i class="fas fa-trophy"></i>
                        <span class="stat-value">${user.achievements.length}</span> Achievements
                    </div>
                    <div class="user-stat">
                        <i class="fas fa-star"></i>
                        <span class="stat-value">${user.totalXP}</span> XP
                    </div>
                    <div class="user-stat">
                        <i class="fas fa-fire"></i>
                        <span class="stat-value">${user.streak.current}</span> Day Streak
                    </div>
                </div>
                <div class="xp-progress">
                    <div class="xp-label">
                        <span>Level ${user.level}</span>
                        <span>${xpProgress}/${100} XP to Level ${user.level + 1}</span>
                    </div>
                    <div class="xp-bar">
                        <div class="xp-fill" style="width: ${xpPercentage}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderStreak(user) {
        const container = document.getElementById('streakDisplay');
        if (!container) return;
        
        if (user.streak.current > 0) {
            container.innerHTML = `
                <div class="streak-fire">🔥</div>
                <div class="streak-info">
                    <div class="streak-count">${user.streak.current} Day${user.streak.current > 1 ? 's' : ''}</div>
                    <div class="streak-label">Current Streak - Keep it going!</div>
                </div>
                <div class="streak-best">
                    <div class="streak-best-label">Best Streak</div>
                    <div class="streak-best-count">${user.streak.longest} Days</div>
                </div>
            `;
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }

    function renderLeaderboard() {
        const container = document.getElementById('leaderboardContainer');
        if (!container) return;
        
        const leaderboard = window.HippocampUser.getLeaderboard();
        const currentUser = window.HippocampUser.getUser();
        
        let html = `
            <div class="leaderboard-header">
                <div>Rank</div>
                <div>Player</div>
                <div>Score</div>
                <div>Date</div>
            </div>
        `;
        
        leaderboard.slice(0, 20).forEach((entry, index) => {
            const isCurrentUser = currentUser && entry.id === currentUser.id;
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const date = new Date(entry.date).toLocaleDateString();
            
            html += `
                <div class="leaderboard-row ${isCurrentUser ? 'current-user' : ''}">
                    <div class="leaderboard-rank ${rankClass}">#${index + 1}</div>
                    <div class="leaderboard-user">
                        <div class="leaderboard-avatar">${entry.avatar}</div>
                        <div class="leaderboard-name">${entry.name}${isCurrentUser ? ' (You)' : ''}</div>
                    </div>
                    <div class="leaderboard-score">${entry.score}/${entry.total}</div>
                    <div class="leaderboard-date">${date}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    function renderAchievements(user) {
        const container = document.getElementById('achievementsGrid');
        const progressContainer = document.getElementById('achievementsProgress');
        if (!container) return;
        
        const allAchievements = window.HippocampUser.ACHIEVEMENTS;
        const unlockedCount = user.achievements.length;
        const totalCount = Object.keys(allAchievements).length;
        const percentage = Math.round((unlockedCount / totalCount) * 100);
        
        if (progressContainer) {
            progressContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: rgba(255,255,255,0.7);">Achievement Progress</span>
                    <span style="color: var(--primary-color); font-weight: 600;">${unlockedCount}/${totalCount} (${percentage}%)</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
            `;
        }
        
        let html = '';
        for (const [id, achievement] of Object.entries(allAchievements)) {
            const unlocked = user.achievements.includes(id);
            html += `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-card-icon">${achievement.icon}</div>
                    <div class="achievement-card-info">
                        <div class="achievement-card-name">${achievement.name}</div>
                        <div class="achievement-card-desc">${achievement.description}</div>
                        <div class="achievement-card-xp">${unlocked ? '✓ Unlocked' : `+${achievement.xp} XP`}</div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    function renderLearningPaths(user) {
        const container = document.getElementById('pathsGrid');
        if (!container) return;
        
        const paths = [
            { id: 'basics', name: 'Gensyn Basics', icon: '📚', href: 'gensyn-basics.html' },
            { id: 'nodeOperation', name: 'Node Operation', icon: '🖥️', href: 'node-operation.html' },
            { id: 'rlSwarm', name: 'RL Swarm', icon: '🤖', href: 'rl-swarm-basics.html' },
            { id: 'protocolArchitecture', name: 'Protocol Architecture', icon: '🏗️', href: 'protocol-architecture.html' },
            { id: 'advancedOptimization', name: 'Advanced Optimization', icon: '⚡', href: 'advanced-optimization.html' }
        ];
        
        let html = '';
        paths.forEach(path => {
            const progress = user.learningPaths[path.id]?.progress || 0;
            const completed = user.learningPaths[path.id]?.completed || false;
            const status = completed ? 'completed' : (progress > 0 ? 'in-progress' : 'not-started');
            const statusLabel = completed ? 'Completed' : (progress > 0 ? `${progress}% Complete` : 'Not Started');
            
            html += `
                <div class="path-card ${completed ? 'completed' : ''}">
                    <div class="path-header">
                        <div class="path-title">
                            <div class="path-icon">${path.icon}</div>
                            <span>${path.name}</span>
                        </div>
                        <span class="path-status ${status}">${statusLabel}</span>
                    </div>
                    <div class="path-progress-bar">
                        <div class="path-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="path-footer">
                        <span>${completed ? '✓ Path completed' : 'Continue learning'}</span>
                        <a href="${path.href}" class="path-action">${completed ? 'Review' : 'Start'}</a>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    function renderGlossary(filter = '', category = 'all') {
        const listContainer = document.getElementById('glossaryList');
        const categoriesContainer = document.getElementById('glossaryCategories');
        if (!listContainer) return;
        
        // Render categories
        const categories = ['all', 'core', 'training', 'research', 'network', 'verification', 'ml-basics'];
        if (categoriesContainer) {
            categoriesContainer.innerHTML = categories.map(cat => `
                <button class="glossary-category ${category === cat ? 'active' : ''}" 
                        onclick="window.HippocampDashboard.filterGlossaryCategory('${cat}')">
                    ${cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
            `).join('');
        }
        
        // Filter and render items
        let filtered = GLOSSARY;
        if (filter) {
            const lowerFilter = filter.toLowerCase();
            filtered = filtered.filter(item => 
                item.term.toLowerCase().includes(lowerFilter) ||
                item.definition.toLowerCase().includes(lowerFilter) ||
                item.tags.some(t => t.toLowerCase().includes(lowerFilter))
            );
        }
        if (category !== 'all') {
            filtered = filtered.filter(item => item.category === category);
        }
        
        listContainer.innerHTML = filtered.map(item => `
            <div class="glossary-item">
                <div class="glossary-term">${item.term}</div>
                <div class="glossary-definition">${item.definition}</div>
                <div class="glossary-tags">
                    ${item.tags.map(tag => `<span class="glossary-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        if (filtered.length === 0) {
            listContainer.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">No terms found</p>';
        }
    }

    // ============================================
    // CONFETTI EFFECT
    // ============================================
    
    function showConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        
        const colors = ['#FFC9D4', '#FFAFBF', '#FF8FA3', '#4ade80', '#ffd700', '#60a5fa'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
        
        setTimeout(() => container.remove(), 5000);
    }

    // ============================================
    // DASHBOARD API
    // ============================================
    
    let currentGlossaryCategory = 'all';
    let hippoTimeout = null;
    
    const Dashboard = {
        open() {
            const modal = document.getElementById('dashboardModal');
            if (!modal) return;
            
            const user = window.HippocampUser.getOrCreateUser();
            
            renderUserProfile(user);
            renderStreak(user);
            renderLeaderboard();
            renderAchievements(user);
            renderLearningPaths(user);
            renderGlossary();
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        },
        
        close() {
            const modal = document.getElementById('dashboardModal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        },
        
        switchTab(tabName) {
            // Update tabs
            document.querySelectorAll('.dashboard-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });
            
            // Update panels
            document.querySelectorAll('.dashboard-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `panel-${tabName}`);
            });
        },
        
        updateName(name) {
            const user = window.HippocampUser.getOrCreateUser();
            user.name = name.trim() || 'Anonymous';
            window.HippocampUser.saveUser(user);
        },
        
        changeAvatar() {
            const avatars = ['🦛', '🤖', '🧠', '⚡', '🔥', '🚀', '💎', '🎯', '🏆', '👑', '🦊', '🐼', '🦁', '🐸'];
            const user = window.HippocampUser.getOrCreateUser();
            const currentIndex = avatars.indexOf(user.avatar);
            user.avatar = avatars[(currentIndex + 1) % avatars.length];
            window.HippocampUser.saveUser(user);
            renderUserProfile(user);
        },
        
        filterGlossary(query) {
            renderGlossary(query, currentGlossaryCategory);
        },
        
        filterGlossaryCategory(category) {
            currentGlossaryCategory = category;
            const searchInput = document.getElementById('glossarySearch');
            renderGlossary(searchInput?.value || '', category);
        },
        
        hippoClick() {
            window.HippocampUser.interactWithHippo();
            
            const user = window.HippocampUser.getUser();
            let message;
            
            if (user && user.streak.current > 1) {
                message = getRandomMessage('streak', { streak: user.streak.current });
            } else if (Math.random() > 0.5) {
                message = getRandomMessage('tip');
            } else {
                message = getRandomMessage('greeting');
            }
            
            this.showSpeech(message);
        },
        
        showSpeech(text) {
            const speech = document.getElementById('hippoSpeech');
            const textEl = document.getElementById('hippoSpeechText');
            
            if (speech && textEl) {
                textEl.textContent = text;
                speech.classList.add('show');
                
                clearTimeout(hippoTimeout);
                hippoTimeout = setTimeout(() => this.hideSpeech(), 5000);
            }
        },
        
        hideSpeech() {
            const speech = document.getElementById('hippoSpeech');
            if (speech) {
                speech.classList.remove('show');
            }
        },
        
        showConfetti
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        waitForUserSystem(() => {
            // Inject dashboard HTML
            const dashboardContainer = document.createElement('div');
            dashboardContainer.innerHTML = createDashboardHTML();
            document.body.appendChild(dashboardContainer);
            
            // Setup tab switching
            document.querySelectorAll('.dashboard-tab').forEach(tab => {
                tab.addEventListener('click', () => Dashboard.switchTab(tab.dataset.tab));
            });
            
            // Show greeting after a delay
            setTimeout(() => {
                const user = window.HippocampUser.getUser();
                if (user && user.streak.current > 1) {
                    Dashboard.showSpeech(getRandomMessage('streak', { streak: user.streak.current }));
                } else {
                    Dashboard.showSpeech(getRandomMessage('greeting'));
                }
            }, 3000);
            
            // Highlight current page in mobile nav
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.mobile-nav-item').forEach(item => {
                if (item.getAttribute('href') === currentPage) {
                    item.classList.add('active');
                }
            });
            
            // Expose to window
            window.HippocampDashboard = Dashboard;
            
            console.log('Hippocamp Dashboard initialized');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
