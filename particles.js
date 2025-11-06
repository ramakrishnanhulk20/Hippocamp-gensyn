// Particle Animation for Hero Section
(function() {
    'use strict';

    function initParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;

        const particleCount = 30;
        const colors = [
            'rgba(255, 201, 212, 0.6)', // Primary pink
            'rgba(82, 212, 212, 0.5)',   // Secondary teal
            'rgba(139, 92, 246, 0.4)'    // Purple accent
        ];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-dot';
            
            // Random size between 3px and 15px
            const size = Math.random() * 12 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = `radial-gradient(circle, ${color}, transparent 70%)`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            // Random animation duration
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            container.appendChild(particle);
        }
    }

    // Initialize particles when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();
