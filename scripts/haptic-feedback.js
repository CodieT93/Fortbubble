/**
 * Haptic Feedback System for Mobile Devices
 * Provides tactile feedback for buttons and links
 */

class HapticFeedback {
    constructor() {
        this.isSupported = this.checkSupport();
        this.init();
    }

    checkSupport() {
        // Check if device supports haptic feedback
        return 'vibrate' in navigator || 
               (navigator.userAgentData && navigator.userAgentData.mobile) ||
               /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (!this.isSupported) return;

        // Add haptic feedback to all buttons and links
        this.addHapticToElements();
        
        // Add CSS classes for visual feedback
        this.addHapticStyles();
    }

    addHapticStyles() {
        // Create style element if it doesn't exist
        if (document.getElementById('haptic-styles')) return;

        const style = document.createElement('style');
        style.id = 'haptic-styles';
        style.textContent = `
            /* Haptic feedback visual effects */
            .haptic-button, .haptic-link {
                transition: transform 0.1s ease, box-shadow 0.1s ease;
                cursor: pointer;
            }

            .haptic-button:active, .haptic-link:active {
                transform: scale(0.95);
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            /* Enhanced button feedback */
            .btn.haptic-button:active {
                transform: scale(0.98);
                box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.15);
            }

            /* Link feedback */
            a.haptic-link:active {
                transform: scale(0.98);
                opacity: 0.8;
            }

            /* Custom button feedback */
            .button-10.haptic-button:active {
                transform: scale(0.95);
                box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            /* CTA button feedback */
            .cta-button.haptic-button:active {
                transform: scale(0.95);
                box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            /* Navbar link feedback */
            .navbar-nav .nav-link.haptic-link:active {
                transform: scale(0.95);
                background-color: rgba(0, 0, 0, 0.05);
            }

            /* Social media link feedback */
            .social-links a.haptic-link:active {
                transform: scale(0.9);
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }

    addHapticToElements() {
        // Add haptic feedback to buttons
        const buttons = document.querySelectorAll('button, .btn, .button-10, .cta-button');
        buttons.forEach(button => {
            this.addHapticToElement(button, 'haptic-button');
        });

        // Add haptic feedback to links
        const links = document.querySelectorAll('a:not(.no-haptic)');
        links.forEach(link => {
            this.addHapticToElement(link, 'haptic-link');
        });

        // Add haptic feedback to form elements
        const formElements = document.querySelectorAll('input[type="submit"], input[type="button"]');
        formElements.forEach(element => {
            this.addHapticToElement(element, 'haptic-button');
        });
    }

    addHapticToElement(element, className) {
        // Add CSS class
        element.classList.add(className);

        // Add touch event listeners
        element.addEventListener('touchstart', (e) => {
            this.triggerHaptic('light');
            this.addVisualFeedback(element, true);
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            this.triggerHaptic('medium');
            this.addVisualFeedback(element, false);
        }, { passive: true });

        element.addEventListener('touchcancel', (e) => {
            this.addVisualFeedback(element, false);
        }, { passive: true });

        // Add mouse events for desktop testing
        element.addEventListener('mousedown', (e) => {
            this.addVisualFeedback(element, true);
        });

        element.addEventListener('mouseup', (e) => {
            this.addVisualFeedback(element, false);
        });

        element.addEventListener('mouseleave', (e) => {
            this.addVisualFeedback(element, false);
        });
    }

    triggerHaptic(type = 'light') {
        if (!this.isSupported) return;

        try {
            switch (type) {
                case 'light':
                    // Light tap feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(10);
                    }
                    break;
                case 'medium':
                    // Medium tap feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(20);
                    }
                    break;
                case 'heavy':
                    // Heavy tap feedback
                    if (navigator.vibrate) {
                        navigator.vibrate([30, 10, 30]);
                    }
                    break;
                case 'success':
                    // Success feedback pattern
                    if (navigator.vibrate) {
                        navigator.vibrate([50, 25, 50]);
                    }
                    break;
                case 'error':
                    // Error feedback pattern
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100, 50, 100]);
                    }
                    break;
            }
        } catch (error) {
            console.log('Haptic feedback not available:', error);
        }
    }

    addVisualFeedback(element, isPressed) {
        if (isPressed) {
            element.style.transform = 'scale(0.95)';
            element.style.transition = 'transform 0.1s ease';
        } else {
            element.style.transform = 'scale(1)';
        }
    }

    // Public methods for custom haptic feedback
    lightTap() {
        this.triggerHaptic('light');
    }

    mediumTap() {
        this.triggerHaptic('medium');
    }

    heavyTap() {
        this.triggerHaptic('heavy');
    }

    success() {
        this.triggerHaptic('success');
    }

    error() {
        this.triggerHaptic('error');
    }
}

// Initialize haptic feedback when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HapticFeedback();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        new HapticFeedback();
    });
} else {
    new HapticFeedback();
}
