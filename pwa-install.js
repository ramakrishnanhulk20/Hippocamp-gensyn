// PWA Installation and Management
// Add this to index.html

(function() {
    'use strict';

    let deferredPrompt;
    let isInstalled = false;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        isInstalled = true;
        console.log('[PWA] App is running in standalone mode');
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('[PWA] Service Worker registered:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });
    }

    // Capture beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] beforeinstallprompt event fired');
        
        // Prevent the mini-infobar from appearing
        e.preventDefault();
        
        // Store event for later use
        deferredPrompt = e;
        
        // Show custom install button
        showInstallButton();
    });

    // Handle app installed
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        isInstalled = true;
        hideInstallButton();
        
        // Track installation
        trackInstallation();
        
        // Show success message
        showInstallSuccess();
    });

    // Create and show install button
    function showInstallButton() {
        if (isInstalled) return;

        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Install App</span>
        `;
        installBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #FFC9D4, #52D4D4);
            color: #1e293b;
            border: none;
            padding: 16px 24px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(255, 201, 212, 0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
            animation: slideIn 0.5s ease, pulse 2s ease-in-out 2s infinite;
        `;

        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.transform = 'scale(1.05) translateY(-2px)';
            installBtn.style.boxShadow = '0 12px 32px rgba(255, 201, 212, 0.6)';
        });

        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.transform = 'scale(1) translateY(0)';
            installBtn.style.boxShadow = '0 8px 24px rgba(255, 201, 212, 0.4)';
        });

        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            // Show install prompt
            deferredPrompt.prompt();

            // Wait for user choice
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[PWA] User choice: ${outcome}`);

            if (outcome === 'accepted') {
                console.log('[PWA] User accepted installation');
            } else {
                console.log('[PWA] User dismissed installation');
            }

            // Clear deferred prompt
            deferredPrompt = null;
            hideInstallButton();
        });

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #1e293b;
            border: 2px solid #FFC9D4;
            color: #FFC9D4;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
        `;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideInstallButton();
        });

        installBtn.appendChild(closeBtn);
        document.body.appendChild(installBtn);

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(200px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }

    function hideInstallButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) {
            btn.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => btn.remove(), 500);
        }
    }

    function showInstallSuccess() {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(34, 197, 94, 0.4);
            animation: slideDown 0.5s ease;
        `;
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            App installed successfully! Launch it from your home screen.
        `;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => successMsg.remove(), 500);
        }, 5000);
    }

    function showUpdateNotification() {
        const updateMsg = document.createElement('div');
        updateMsg.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 201, 212, 0.3);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 20px;
        `;
        updateMsg.innerHTML = `
            <div>
                <strong>🎉 Update Available!</strong>
                <p style="margin: 5px 0 0; font-size: 0.9rem; opacity: 0.8;">A new version of Hippocamp Academy is ready.</p>
            </div>
            <button id="update-btn" style="
                background: linear-gradient(135deg, #FFC9D4, #52D4D4);
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                color: #1e293b;
                font-weight: 700;
                cursor: pointer;
            ">Update Now</button>
        `;
        document.body.appendChild(updateMsg);

        document.getElementById('update-btn').addEventListener('click', () => {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
            window.location.reload();
        });
    }

    function trackInstallation() {
        // Track in analytics
        const analytics = JSON.parse(localStorage.getItem('hippocamp_analytics') || '[]');
        analytics.push({
            event: 'pwa_installed',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('hippocamp_analytics', JSON.stringify(analytics));
    }

    // Expose PWA utilities globally
    window.hippocampPWA = {
        isInstalled: () => isInstalled,
        install: () => {
            const btn = document.getElementById('pwa-install-btn');
            if (btn) btn.click();
        },
        clearCache: () => {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ action: 'clearCache' });
            }
        }
    };

    console.log('[PWA] PWA utilities initialized');
})();
