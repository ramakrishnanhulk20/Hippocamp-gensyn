// Social Sharing Utilities for Hippocamp Academy

class SocialShare {
    constructor() {
        this.baseUrl = window.location.origin;
        this.twitterHandle = '@gensyn_ai';
    }

    // Share achievement on Twitter
    shareAchievement(achievement, points, badge = null) {
        const text = badge 
            ? `🎓 Just earned the "${badge}" badge on Hippocamp Academy! ${points} points earned learning @gensyn_ai Protocol 🦛✨`
            : `🚀 Just completed "${achievement}" on Hippocamp Academy! ${points} points earned 🦛 Learning @gensyn_ai Protocol`;
        
        const hashtags = 'Web3,MachineLearning,GensynAI,DecentralizedAI';
        const url = `${this.baseUrl}/badges.html`;
        
        this.openTwitterShare(text, url, hashtags);
    }

    // Share course completion
    shareCourseCompletion(courseName, lessonsCompleted, points) {
        const text = `📚 Completed "${courseName}" on Hippocamp Academy!\n\n✅ ${lessonsCompleted} lessons\n⭐ ${points} points earned\n\nLearning @gensyn_ai Protocol 🦛`;
        const hashtags = 'Web3Education,Gensyn,LearnWeb3';
        const url = `${this.baseUrl}`;
        
        this.openTwitterShare(text, url, hashtags);
    }

    // Share progress milestone
    shareProgress(totalLessons, totalPoints, badgesEarned) {
        const text = `📊 My Hippocamp Academy Progress:\n\n📖 ${totalLessons} lessons completed\n⭐ ${totalPoints} points earned\n🏆 ${badgesEarned} badges unlocked\n\nMastering @gensyn_ai Protocol 🦛🚀`;
        const hashtags = 'DecentralizedAI,Web3Learning,Gensyn';
        const url = `${this.baseUrl}/badges.html`;
        
        this.openTwitterShare(text, url, hashtags);
    }

    // Share on LinkedIn
    shareOnLinkedIn(title, summary) {
        const url = `${this.baseUrl}`;
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        
        window.open(linkedInUrl, 'linkedin-share', 'width=600,height=600');
    }

    // Generic Twitter share
    openTwitterShare(text, url, hashtags) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
        window.open(twitterUrl, 'twitter-share', 'width=600,height=400');
    }

    // Copy share link
    copyShareLink(text = null) {
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showCopyNotification('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyNotification('Link copied!');
        }
    }

    // Show copy notification
    showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
            animation: slideDown 0.3s ease;
        `;
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Generate share image (for Open Graph)
    generateShareImage(title, stats) {
        // This would generate a custom share image
        // For now, we'll use meta tags with pre-made images
        return `${this.baseUrl}/share-images/achievement.png`;
    }

    // Create share buttons HTML
    createShareButtons(config) {
        const { 
            achievement = null, 
            points = 0, 
            badge = null,
            showCopy = true,
            showLinkedIn = false 
        } = config;

        const buttonsHTML = `
            <div class="share-buttons" style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
                <button class="share-btn twitter-btn" onclick="socialShare.shareAchievement('${achievement}', ${points}, ${badge ? `'${badge}'` : 'null'})" style="
                    background: #1DA1F2;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                ">
                    <i class="fab fa-twitter"></i>
                    Share on Twitter
                </button>
                ${showLinkedIn ? `
                    <button class="share-btn linkedin-btn" onclick="socialShare.shareOnLinkedIn('Hippocamp Achievement', '${achievement}')" style="
                        background: #0077B5;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.2s ease;
                    ">
                        <i class="fab fa-linkedin"></i>
                        Share on LinkedIn
                    </button>
                ` : ''}
                ${showCopy ? `
                    <button class="share-btn copy-btn" onclick="socialShare.copyShareLink()" style="
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.2s ease;
                    ">
                        <i class="fas fa-link"></i>
                        Copy Link
                    </button>
                ` : ''}
            </div>
            <style>
                .share-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }
                .share-btn:active {
                    transform: translateY(0);
                }
            </style>
        `;

        return buttonsHTML;
    }

    // Add share button to element
    addShareButton(elementId, config) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML += this.createShareButtons(config);
        }
    }
}

// Initialize global instance
window.socialShare = new SocialShare();

// Add CSS animations if not already present
if (!document.getElementById('share-animations')) {
    const style = document.createElement('style');
    style.id = 'share-animations';
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translate(-50%, -100%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        @keyframes slideUp {
            from {
                transform: translate(-50%, 0);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('[Social Share] Social sharing utilities loaded');
