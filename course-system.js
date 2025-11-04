// Hippocamp Academy - Course System with Points & Badges
// LocalStorage-based progress tracking

class CourseSystem {
    constructor() {
        this.points = this.getPoints();
        this.completedLessons = this.getCompletedLessons();
        this.badges = this.getBadges();
        this.currentCourse = this.getCurrentCourse();
    }

    // LocalStorage Management
    getPoints() {
        return parseInt(localStorage.getItem('hippocamp_points') || '0');
    }

    savePoints(points) {
        localStorage.setItem('hippocamp_points', points.toString());
        this.points = points;
        this.updatePointsDisplay();
    }

    getCompletedLessons() {
        const saved = localStorage.getItem('hippocamp_completed_lessons');
        return saved ? JSON.parse(saved) : [];
    }

    saveCompletedLesson(lessonId) {
        if (!this.completedLessons.includes(lessonId)) {
            this.completedLessons.push(lessonId);
            localStorage.setItem('hippocamp_completed_lessons', JSON.stringify(this.completedLessons));
            return true;
        }
        return false;
    }

    getBadges() {
        const saved = localStorage.getItem('hippocamp_badges');
        return saved ? JSON.parse(saved) : [];
    }

    saveBadge(badgeId) {
        if (!this.badges.includes(badgeId)) {
            this.badges.push(badgeId);
            localStorage.setItem('hippocamp_badges', JSON.stringify(this.badges));
            this.showBadgeUnlock(badgeId);
            return true;
        }
        return false;
    }

    getCurrentCourse() {
        return localStorage.getItem('hippocamp_current_course') || '';
    }

    setCurrentCourse(courseId) {
        localStorage.setItem('hippocamp_current_course', courseId);
        this.currentCourse = courseId;
    }

    // Points System
    awardPoints(amount, reason) {
        const newPoints = this.points + amount;
        this.savePoints(newPoints);
        this.showPointsNotification(amount, reason);
        this.checkBadgeUnlocks();
    }

    updatePointsDisplay() {
        const displays = document.querySelectorAll('.points-display');
        displays.forEach(display => {
            display.textContent = this.points;
        });
    }

    showPointsNotification(amount, reason) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-earned">
                <i class="fas fa-star"></i> +${amount} Points
                <div class="points-reason">${reason}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Lesson Completion
    completeLesson(lessonId, lessonTitle, pointValue = 50) {
        const isNew = this.saveCompletedLesson(lessonId);
        if (isNew) {
            this.awardPoints(pointValue, `Completed: ${lessonTitle}`);
            this.updateProgress();
            return true;
        }
        return false;
    }

    isLessonCompleted(lessonId) {
        return this.completedLessons.includes(lessonId);
    }

    // Quiz System
    submitQuizAnswer(questionId, isCorrect, pointValue = 25) {
        if (isCorrect) {
            const quizKey = `quiz_${questionId}`;
            if (!this.completedLessons.includes(quizKey)) {
                this.saveCompletedLesson(quizKey);
                this.awardPoints(pointValue, 'Correct Answer!');
                return true;
            }
        }
        return false;
    }

    // Progress Tracking
    updateProgress() {
        const courseId = this.currentCourse;
        if (!courseId) return;

        const allLessons = document.querySelectorAll('.lesson');
        const completedCount = Array.from(allLessons).filter(lesson => {
            const lessonId = lesson.dataset.lessonId;
            return this.isLessonCompleted(lessonId);
        }).length;

        const progress = (completedCount / allLessons.length) * 100;
        
        const progressBar = document.querySelector('.course-progress-fill');
        const progressText = document.querySelector('.course-progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;

        // Check for course completion
        if (progress === 100) {
            this.completeCourse(courseId);
        }
    }

    // Course Completion
    completeCourse(courseId) {
        const courseData = this.getCourseData(courseId);
        if (courseData) {
            this.saveBadge(courseData.badgeId);
            this.awardPoints(courseData.completionPoints, `Completed ${courseData.title}!`);
        }
    }

    getCourseData(courseId) {
        const courses = {
            'gensyn-basics': {
                title: 'Gensyn Fundamentals',
                badgeId: 'badge_fundamentals',
                completionPoints: 200,
                badgeName: 'Gensyn Scholar',
                badgeIcon: '🎓'
            },
            'protocol-architecture': {
                title: 'Protocol Architecture',
                badgeId: 'badge_protocol',
                completionPoints: 300,
                badgeName: 'Protocol Master',
                badgeIcon: '🏗️'
            },
            'rl-swarm-basics': {
                title: 'RL Swarm Basics',
                badgeId: 'badge_swarm_basic',
                completionPoints: 250,
                badgeName: 'Swarm Initiate',
                badgeIcon: '🐝'
            },
            'node-operation': {
                title: 'Node Operation',
                badgeId: 'badge_node_operator',
                completionPoints: 350,
                badgeName: 'Node Operator',
                badgeIcon: '⚙️'
            },
            'advanced-optimization': {
                title: 'Advanced Optimization',
                badgeId: 'badge_advanced',
                completionPoints: 400,
                badgeName: 'Optimization Expert',
                badgeIcon: '⚡'
            },
            'building-dapps': {
                title: 'Building dApps',
                badgeId: 'badge_builder',
                completionPoints: 500,
                badgeName: 'dApp Builder',
                badgeIcon: '🛠️'
            }
        };
        return courses[courseId];
    }

    // Badge System
    checkBadgeUnlocks() {
        // Points-based badges
        if (this.points >= 1000 && !this.badges.includes('badge_1k_points')) {
            this.saveBadge('badge_1k_points');
        }
        if (this.points >= 2500 && !this.badges.includes('badge_2500_points')) {
            this.saveBadge('badge_2500_points');
        }
    }

    showBadgeUnlock(badgeId) {
        const badgeData = this.getBadgeData(badgeId);
        if (!badgeData) return;

        const modal = document.createElement('div');
        modal.className = 'badge-unlock-modal';
        modal.innerHTML = `
            <div class="badge-unlock-content">
                <div class="badge-unlock-icon">${badgeData.icon}</div>
                <h2>Badge Unlocked!</h2>
                <h3>${badgeData.name}</h3>
                <p>${badgeData.description}</p>
                <div style="margin: 20px 0;">
                    <button onclick="window.socialShare && window.socialShare.shareAchievement('${badgeData.name}', ${this.points}, '${badgeData.name}')" style="
                        background: #1DA1F2;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        margin: 5px;
                    ">
                        <i class="fab fa-twitter"></i> Share on Twitter
                    </button>
                </div>
                <button onclick="this.closest('.badge-unlock-modal').remove()" class="btn-primary">
                    Awesome! 🎉
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 100);
    }

    getBadgeData(badgeId) {
        const badges = {
            'badge_fundamentals': {
                name: 'Gensyn Scholar',
                icon: '🎓',
                description: 'Mastered the fundamentals of Gensyn Protocol'
            },
            'badge_protocol': {
                name: 'Protocol Master',
                icon: '🏗️',
                description: 'Deep understanding of protocol architecture'
            },
            'badge_swarm_basic': {
                name: 'Swarm Initiate',
                icon: '🐝',
                description: 'Learned the basics of RL Swarm training'
            },
            'badge_node_operator': {
                name: 'Node Operator',
                icon: '⚙️',
                description: 'Successfully set up and run a Gensyn node'
            },
            'badge_advanced': {
                name: 'Optimization Expert',
                icon: '⚡',
                description: 'Mastered advanced optimization techniques'
            },
            'badge_builder': {
                name: 'dApp Builder',
                icon: '🛠️',
                description: 'Built applications on Gensyn Protocol'
            },
            'badge_1k_points': {
                name: 'Rising Star',
                icon: '⭐',
                description: 'Earned 1,000 learning points'
            },
            'badge_2500_points': {
                name: 'Academy Master',
                icon: '🏆',
                description: 'Earned 2,500 learning points'
            }
        };
        return badges[badgeId];
    }

    // Initialize course page
    initCoursePage(courseId) {
        this.setCurrentCourse(courseId);
        this.updatePointsDisplay();
        this.markCompletedLessons();
        this.updateProgress();
        this.setupLessonListeners();
        this.setupQuizListeners();
    }

    markCompletedLessons() {
        document.querySelectorAll('.lesson').forEach(lesson => {
            const lessonId = lesson.dataset.lessonId;
            if (this.isLessonCompleted(lessonId)) {
                lesson.classList.add('completed');
                const checkmark = lesson.querySelector('.lesson-checkmark');
                if (checkmark) checkmark.style.display = 'block';
            }
        });
    }

    setupLessonListeners() {
        document.querySelectorAll('.complete-lesson-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lesson = e.target.closest('.lesson');
                const lessonId = lesson.dataset.lessonId;
                const lessonTitle = lesson.dataset.lessonTitle;
                const points = parseInt(lesson.dataset.points || '50');
                
                if (this.completeLesson(lessonId, lessonTitle, points)) {
                    lesson.classList.add('completed');
                    e.target.disabled = true;
                    e.target.textContent = '✓ Completed';
                }
            });
        });
    }

    setupQuizListeners() {
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const quiz = e.target.closest('.quiz-container');
                const questionId = quiz.dataset.questionId;
                const isCorrect = e.target.dataset.correct === 'true';
                const allOptions = quiz.querySelectorAll('.quiz-option');
                
                // Disable all options
                allOptions.forEach(opt => opt.style.pointerEvents = 'none');
                
                // Mark selected
                if (isCorrect) {
                    e.target.classList.add('correct');
                    this.submitQuizAnswer(questionId, true);
                    this.showQuizFeedback(quiz, true);
                } else {
                    e.target.classList.add('incorrect');
                    // Show correct answer
                    allOptions.forEach(opt => {
                        if (opt.dataset.correct === 'true') {
                            opt.classList.add('correct');
                        }
                    });
                    this.showQuizFeedback(quiz, false);
                }
            });
        });
    }

    showQuizFeedback(quizContainer, isCorrect) {
        const feedback = quizContainer.querySelector('.quiz-feedback');
        if (feedback) {
            feedback.classList.add('show');
            feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
    }
}

// Initialize global course system
window.courseSystem = new CourseSystem();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get course ID from page
    const courseId = document.body.dataset.courseId;
    if (courseId && window.courseSystem) {
        window.courseSystem.initCoursePage(courseId);
    }
});
