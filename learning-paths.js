// Add to course-system.js - Advanced personalization features

class LearningPathManager {
    constructor() {
        this.paths = {
            beginner: {
                name: "🌱 Beginner Path",
                description: "Perfect for newcomers to Web3 and ML",
                courses: [
                    { id: "gensyn-basics", required: true },
                    { id: "rl-swarm-basics", required: true },
                    { id: "node-operation", required: false }
                ],
                estimatedTime: "6-8 hours",
                difficulty: "easy"
            },
            developer: {
                name: "💻 Developer Path",
                description: "Build dApps on Gensyn network",
                courses: [
                    { id: "gensyn-basics", required: true },
                    { id: "protocol-architecture", required: true },
                    { id: "building-dapps", required: true },
                    { id: "advanced-optimization", required: false }
                ],
                estimatedTime: "10-12 hours",
                difficulty: "intermediate"
            },
            operator: {
                name: "⚙️ Node Operator Path",
                description: "Run and maintain network nodes",
                courses: [
                    { id: "gensyn-basics", required: true },
                    { id: "rl-swarm-basics", required: true },
                    { id: "node-operation", required: true },
                    { id: "advanced-optimization", required: true }
                ],
                estimatedTime: "12-15 hours",
                difficulty: "advanced"
            },
            researcher: {
                name: "🔬 Researcher Path",
                description: "Deep dive into ML theory and protocols",
                courses: [
                    { id: "gensyn-basics", required: true },
                    { id: "protocol-architecture", required: true },
                    { id: "rl-swarm-basics", required: true },
                    { id: "research", required: true },
                    { id: "advanced-optimization", required: false }
                ],
                estimatedTime: "15-20 hours",
                difficulty: "advanced"
            },
            fullstack: {
                name: "🚀 Full-Stack Path",
                description: "Master everything from basics to advanced",
                courses: [
                    { id: "gensyn-basics", required: true },
                    { id: "rl-swarm-basics", required: true },
                    { id: "protocol-architecture", required: true },
                    { id: "node-operation", required: true },
                    { id: "building-dapps", required: true },
                    { id: "advanced-optimization", required: true },
                    { id: "research", required: true }
                ],
                estimatedTime: "25-30 hours",
                difficulty: "expert"
            }
        };
        
        this.currentPath = this.loadCurrentPath();
        this.recommendations = [];
    }

    loadCurrentPath() {
        return localStorage.getItem('hippocamp_learning_path') || null;
    }

    savePath(pathId) {
        localStorage.setItem('hippocamp_learning_path', pathId);
        this.currentPath = pathId;
        this.trackEvent('path_selected', { path: pathId });
    }

    getPathProgress(pathId) {
        const path = this.paths[pathId];
        if (!path) return 0;

        const completedLessons = JSON.parse(localStorage.getItem('hippocamp_completed_lessons') || '[]');
        const requiredCourses = path.courses.filter(c => c.required);
        
        let completedRequired = 0;
        requiredCourses.forEach(course => {
            const courseCompleted = completedLessons.some(lesson => 
                lesson.startsWith(course.id + '-')
            );
            if (courseCompleted) completedRequired++;
        });

        return Math.round((completedRequired / requiredCourses.length) * 100);
    }

    getRecommendations() {
        const completedLessons = JSON.parse(localStorage.getItem('hippocamp_completed_lessons') || '[]');
        const points = parseInt(localStorage.getItem('hippocamp_points') || '0');
        
        // Analyze learning patterns
        const hasBasics = completedLessons.some(l => l.startsWith('gensyn-basics'));
        const hasAdvanced = completedLessons.some(l => l.startsWith('advanced-'));
        const hasNode = completedLessons.some(l => l.startsWith('node-'));
        const hasDev = completedLessons.some(l => l.startsWith('building-dapps'));

        const recommendations = [];

        // Smart recommendations based on progress
        if (!hasBasics && points < 500) {
            recommendations.push({
                type: 'course',
                title: 'Start with Gensyn Basics',
                description: 'Build your foundation before advancing',
                icon: '📚',
                link: 'gensyn-basics.html',
                priority: 'high'
            });
        }

        if (hasBasics && !hasNode && !hasDev) {
            recommendations.push({
                type: 'path',
                title: 'Choose Your Path',
                description: 'Specialize in development or node operations',
                icon: '🎯',
                action: 'showPathSelection',
                priority: 'high'
            });
        }

        if (points >= 1000 && !hasAdvanced) {
            recommendations.push({
                type: 'course',
                title: 'Ready for Advanced Topics',
                description: 'You\'ve earned enough experience for advanced optimization',
                icon: '🚀',
                link: 'advanced-optimization.html',
                priority: 'medium'
            });
        }

        if (completedLessons.length >= 10 && !this.currentPath) {
            recommendations.push({
                type: 'achievement',
                title: 'Consider a Learning Path',
                description: 'Structure your learning with a guided path',
                icon: '🎓',
                action: 'showPathSelection',
                priority: 'low'
            });
        }

        return recommendations;
    }

    getNextLesson() {
        if (!this.currentPath) return null;

        const path = this.paths[this.currentPath];
        const completedLessons = JSON.parse(localStorage.getItem('hippocamp_completed_lessons') || '[]');

        for (const course of path.courses) {
            const courseId = course.id;
            // Check if course has incomplete lessons
            // Return first incomplete lesson
            return {
                courseId,
                courseName: this.getCourseTitle(courseId),
                isRequired: course.required
            };
        }

        return null;
    }

    getCourseTitle(courseId) {
        const titles = {
            'gensyn-basics': 'Gensyn Protocol Basics',
            'rl-swarm-basics': 'RL Swarm Intelligence',
            'protocol-architecture': 'Protocol Architecture',
            'node-operation': 'Node Operations',
            'building-dapps': 'Building dApps',
            'advanced-optimization': 'Advanced Optimization',
            'research': 'Research Hub'
        };
        return titles[courseId] || courseId;
    }

    trackEvent(event, data) {
        const analytics = JSON.parse(localStorage.getItem('hippocamp_analytics') || '[]');
        analytics.push({
            event,
            data,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 events
        if (analytics.length > 100) {
            analytics.shift();
        }
        
        localStorage.setItem('hippocamp_analytics', JSON.stringify(analytics));
    }

    getLearningStats() {
        const completedLessons = JSON.parse(localStorage.getItem('hippocamp_completed_lessons') || '[]');
        const points = parseInt(localStorage.getItem('hippocamp_points') || '0');
        const badges = JSON.parse(localStorage.getItem('hippocamp_badges') || '[]');

        // Calculate streaks
        const analytics = JSON.parse(localStorage.getItem('hippocamp_analytics') || '[]');
        const lessonCompletions = analytics.filter(a => a.event === 'lesson_completed');
        
        let currentStreak = 0;
        let lastDate = null;
        
        for (let i = lessonCompletions.length - 1; i >= 0; i--) {
            const date = new Date(lessonCompletions[i].timestamp).toDateString();
            if (!lastDate) {
                lastDate = date;
                currentStreak = 1;
            } else if (date !== lastDate) {
                const dayDiff = Math.floor((new Date(lastDate) - new Date(date)) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    currentStreak++;
                    lastDate = date;
                } else {
                    break;
                }
            }
        }

        return {
            totalLessons: completedLessons.length,
            totalPoints: points,
            badgesEarned: badges.length,
            currentStreak,
            averageScore: this.calculateAverageScore(),
            timeSpent: this.calculateTimeSpent(),
            rank: this.calculateRank(points)
        };
    }

    calculateAverageScore() {
        const analytics = JSON.parse(localStorage.getItem('hippocamp_analytics') || '[]');
        const quizResults = analytics.filter(a => a.event === 'quiz_completed');
        
        if (quizResults.length === 0) return 0;
        
        const totalScore = quizResults.reduce((sum, result) => 
            sum + (result.data.score || 0), 0
        );
        
        return Math.round(totalScore / quizResults.length);
    }

    calculateTimeSpent() {
        const analytics = JSON.parse(localStorage.getItem('hippocamp_analytics') || '[]');
        if (analytics.length < 2) return "< 1 hour";

        const firstEvent = new Date(analytics[0].timestamp);
        const lastEvent = new Date(analytics[analytics.length - 1].timestamp);
        const hours = Math.floor((lastEvent - firstEvent) / (1000 * 60 * 60));

        if (hours < 1) return "< 1 hour";
        if (hours < 24) return `${hours} hours`;
        return `${Math.floor(hours / 24)} days`;
    }

    calculateRank(points) {
        if (points >= 4000) return { name: "🏆 Gensyn Master", level: 5 };
        if (points >= 3000) return { name: "💎 Expert", level: 4 };
        if (points >= 2000) return { name: "⭐ Advanced", level: 3 };
        if (points >= 1000) return { name: "🌟 Intermediate", level: 2 };
        return { name: "🌱 Beginner", level: 1 };
    }

    exportProgress() {
        const data = {
            points: localStorage.getItem('hippocamp_points'),
            completedLessons: localStorage.getItem('hippocamp_completed_lessons'),
            badges: localStorage.getItem('hippocamp_badges'),
            learningPath: this.currentPath,
            stats: this.getLearningStats(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hippocamp-progress-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importProgress(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            localStorage.setItem('hippocamp_points', data.points);
            localStorage.setItem('hippocamp_completed_lessons', data.completedLessons);
            localStorage.setItem('hippocamp_badges', data.badges);
            if (data.learningPath) {
                this.savePath(data.learningPath);
            }
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
}

// Initialize globally
window.learningPathManager = new LearningPathManager();
