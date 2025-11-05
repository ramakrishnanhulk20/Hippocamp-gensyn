/**
 * Gensyn Story Slideshow
 * Interactive auto-playing slideshow for the Gensyn history story
 */

class GensynthStorySlideshow {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 14;
        this.isPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDuration = 5000; // Default 5 seconds per slide
        this.autoPlayTimeout = null; // For variable duration timing
        this.hasSeenStory = this.checkStoryStatus();
        
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.updateUI();
        
        // Show entry modal for first-time visitors
        if (!this.hasSeenStory) {
            setTimeout(() => {
                this.showEntryModal();
            }, 2000); // Show after 2 seconds
        } else {
            // If story has been seen, show the menu item
            this.showStoryMenuItem();
        }
    }

    bindElements() {
        // Entry modal elements
        this.entryModal = document.getElementById('storyEntryModal');
        this.watchStoryBtn = document.getElementById('watchStoryBtn');
        this.skipStoryBtn = document.getElementById('skipStoryBtn');
        
        // Story modal elements
        this.storyModal = document.getElementById('storyModal');
        this.storyClose = document.getElementById('storyClose');
        this.storySkip = document.getElementById('storySkip');
        this.storyStartLearning = document.getElementById('storyStartLearning');
        
        // Slideshow elements
        this.slideshow = document.querySelector('.story-slideshow');
        this.slides = document.querySelectorAll('.story-slide');
        this.prevBtn = document.getElementById('storyPrev');
        this.nextBtn = document.getElementById('storyNext');
        this.playPauseBtn = document.getElementById('storyPlayPause');
        this.progressBar = document.getElementById('storyProgress');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.autoplayStatus = document.querySelector('.autoplay-status');
        
        // Overlays
        this.entryOverlay = document.querySelector('.story-entry-overlay');
        this.storyOverlay = document.querySelector('.story-overlay');
    }

    bindEvents() {
        // Entry modal events
        this.watchStoryBtn?.addEventListener('click', () => this.startStory());
        this.skipStoryBtn?.addEventListener('click', () => this.skipStory());
        this.entryOverlay?.addEventListener('click', () => this.skipStory());
        
        // Story modal events
        this.storyClose?.addEventListener('click', () => this.closeStory());
        this.storySkip?.addEventListener('click', () => this.skipToEnd());
        this.storyStartLearning?.addEventListener('click', () => this.startLearning());
        this.storyOverlay?.addEventListener('click', () => this.closeStory());
        
        // Navigation events
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.goToSlide(this.currentSlide + 1));
        this.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe events
        this.bindTouchEvents();
        
        // Prevent modal closing on container click
        document.querySelector('.story-entry-container')?.addEventListener('click', (e) => e.stopPropagation());
        document.querySelector('.story-container')?.addEventListener('click', (e) => e.stopPropagation());
    }

    bindTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.slideshow?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.slideshow?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.previousSlide();
            }
        }
    }

    showEntryModal() {
        this.entryModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideEntryModal() {
        this.entryModal?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    startStory() {
        this.hideEntryModal();
        setTimeout(() => {
            this.showStoryModal();
            this.startAutoPlay();
        }, 300);
    }

    skipStory() {
        this.hideEntryModal();
        this.markStoryAsSeen();
    }

    showStoryModal() {
        this.storyModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateUI();
    }

    closeStory() {
        this.stopAutoPlay();
        this.storyModal?.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.markStoryAsSeen();
    }

    skipToEnd() {
        this.stopAutoPlay();
        this.goToSlide(this.totalSlides - 1);
        this.showStartLearningButton();
    }

    startLearning() {
        this.closeStory();
        // Scroll to courses section
        document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
    }

    goToSlide(slideIndex, direction = 'next') {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        
        const currentSlideEl = this.slides[this.currentSlide];
        const nextSlideEl = this.slides[slideIndex];
        
        // Stop current autoplay timing
        if (this.autoPlayTimeout) {
            clearTimeout(this.autoPlayTimeout);
            this.autoPlayTimeout = null;
        }
        
        // Remove active class from current slide
        currentSlideEl?.classList.remove('active');
        
        // Add directional classes for smooth animation
        if (direction === 'next') {
            currentSlideEl?.classList.add('exiting-left');
            nextSlideEl?.classList.add('entering-right');
        } else {
            currentSlideEl?.classList.add('exiting-right');
            nextSlideEl?.classList.add('entering-left');
        }
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Clean up animation classes and set new active slide
        setTimeout(() => {
            // Remove all animation classes
            this.slides.forEach(slide => {
                slide.classList.remove('exiting-left', 'exiting-right', 'entering-left', 'entering-right');
            });
            
            // Set new active slide
            nextSlideEl?.classList.add('active');
            
            this.updateUI();
            
            // Show start learning button on last slide
            if (this.currentSlide === this.totalSlides - 1) {
                this.showStartLearningButton();
                this.stopAutoPlay();
            } else if (this.isPlaying) {
                // Resume autoplay with new slide's duration
                this.scheduleNextSlide();
            }
        }, 600);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1, 'next');
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1, 'prev');
            this.hideStartLearningButton();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        if (this.currentSlide >= this.totalSlides - 1) return;
        
        this.isPlaying = true;
        this.scheduleNextSlide();
        this.updatePlayPauseButton();
    }

    scheduleNextSlide() {
        if (!this.isPlaying || this.currentSlide >= this.totalSlides - 1) return;
        
        // Get duration for current slide from data-duration attribute (in seconds)
        const currentSlideEl = this.slides[this.currentSlide];
        const duration = currentSlideEl?.getAttribute('data-duration') || 5;
        const durationMs = parseInt(duration) * 1000;
        
        // Clear any existing timeout
        if (this.autoPlayTimeout) {
            clearTimeout(this.autoPlayTimeout);
        }
        
        // Schedule next slide transition
        this.autoPlayTimeout = setTimeout(() => {
            if (this.isPlaying && this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
                this.scheduleNextSlide(); // Schedule the next one
            } else {
                this.stopAutoPlay();
            }
        }, durationMs);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        if (this.autoPlayTimeout) {
            clearTimeout(this.autoPlayTimeout);
            this.autoPlayTimeout = null;
        }
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        const icon = this.playPauseBtn?.querySelector('i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        if (this.autoplayStatus) {
            this.autoplayStatus.textContent = this.isPlaying ? 'Auto-playing' : 'Paused';
            this.autoplayStatus.classList.toggle('playing', this.isPlaying);
        }
    }

    updateUI() {
        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        
        // Update slide counter
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide + 1;
        }
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
        
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
        
        // Update play/pause button
        this.updatePlayPauseButton();
    }

    showStartLearningButton() {
        if (this.storySkip) this.storySkip.style.display = 'none';
        if (this.storyStartLearning) this.storyStartLearning.style.display = 'inline-flex';
    }

    hideStartLearningButton() {
        if (this.storySkip) this.storySkip.style.display = 'inline-flex';
        if (this.storyStartLearning) this.storyStartLearning.style.display = 'none';
    }

    handleKeyboard(e) {
        if (!this.storyModal?.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Escape':
                e.preventDefault();
                this.closeStory();
                break;
            case 'p':
            case 'P':
                e.preventDefault();
                this.togglePlayPause();
                break;
        }
    }

    checkStoryStatus() {
        return localStorage.getItem('gensynStoryViewed') === 'true';
    }

    markStoryAsSeen() {
        localStorage.setItem('gensynStoryViewed', 'true');
        this.hasSeenStory = true;
        // Optionally show story menu item for rewatching
        this.showStoryMenuItem();
    }

    showStoryMenuItem() {
        // Show existing story menu item if it exists
        const existingMenuItem = document.querySelector('.story-menu-item');
        if (existingMenuItem) {
            existingMenuItem.classList.add('visible');
            return;
        }
        
        // Add story option to navigation menu if it doesn't exist
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const storyMenuItem = document.createElement('li');
            storyMenuItem.className = 'story-menu-item visible';
            storyMenuItem.setAttribute('role', 'none');
            storyMenuItem.innerHTML = `
                <a href="#" class="nav-link story-rewatch" role="menuitem">
                    <i class="fas fa-book-open"></i> Gensyn Story
                </a>
            `;
            
            const homeItem = navLinks.querySelector('li');
            if (homeItem) {
                navLinks.insertBefore(storyMenuItem, homeItem.nextSibling);
            }
            
            // Bind rewatch event
            const rewatchLink = storyMenuItem.querySelector('.story-rewatch');
            rewatchLink?.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerStoryRewatch();
            });
        }
    }

    updateSlides() {
        // Reset all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'exiting-left', 'exiting-right', 'entering-left', 'entering-right');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            }
        });
    }

    // Public method to trigger story from external sources
    static triggerStory() {
        const instance = window.gensynStorySlideshow;
        if (instance) {
            instance.currentSlide = 0;
            instance.updateSlides();
            instance.showStoryModal();
            instance.hideStartLearningButton();
            // Start autoplay if not on last slide
            if (instance.currentSlide < instance.totalSlides - 1) {
                instance.startAutoPlay();
            }
        }
    }

    // Method to trigger story rewatch
    triggerStoryRewatch() {
        this.currentSlide = 0;
        this.updateSlides();
        this.showStoryModal();
        this.hideStartLearningButton();
        this.startAutoPlay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gensynStorySlideshow = new GensynthStorySlideshow();
});

// Global function to trigger story (accessible from HTML)
window.triggerGensynStory = function() {
    GensynthStorySlideshow.triggerStory();
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GensynthStorySlideshow;
}