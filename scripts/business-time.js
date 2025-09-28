/**
 * Business Time Display for Fortbubble
 * Shows current AEST time and business hours status
 */

class BusinessTimeDisplay {
    constructor() {
        this.businessStartHour = 9; // 9:00 AM
        this.businessEndHour = 17; // 5:00 PM
        this.timezone = 'Australia/Sydney'; // AEST/AEDT
        this.updateInterval = 1000; // Update every second
        
        this.init();
    }

    init() {
        this.createTimeDisplay();
        this.updateTime();
        this.startTimer();
    }

    createTimeDisplay() {
        // Check if time display already exists to prevent duplication
        if (document.getElementById('business-time-display')) {
            return;
        }

        // Find the navbar collapse div
        const navbarCollapse = document.querySelector('#navbarNav .navbar-nav');
        if (!navbarCollapse) return;

        // Create business time container
        const businessTimeContainer = document.createElement('div');
        businessTimeContainer.className = 'business-time-center';
        businessTimeContainer.innerHTML = `
            <span class="time-display" id="business-time-display">--:-- --</span>
            <span class="status-indicator" id="business-status">
                <span class="status-dot"></span>
                <span class="status-text">Loading...</span>
            </span>
        `;

        // Insert in the center of the navbar
        navbarCollapse.insertBefore(businessTimeContainer, navbarCollapse.firstChild);
    }

    getCurrentAESTTime() {
        const now = new Date();
        const aestTime = new Date(now.toLocaleString("en-US", {timeZone: this.timezone}));
        return aestTime;
    }

    isBusinessHours() {
        const currentTime = this.getCurrentAESTTime();
        const currentHour = currentTime.getHours();
        const currentDay = currentTime.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Business hours: Monday-Friday, 9:00 AM - 5:00 PM AEST
        return currentDay >= 1 && currentDay <= 5 && 
               currentHour >= this.businessStartHour && 
               currentHour < this.businessEndHour;
    }

    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        return `${hours}:${minutes} ${ampm}`;
    }

    updateTime() {
        const timeDisplay = document.getElementById('business-time-display');
        const statusIndicator = document.getElementById('business-status');
        const statusText = statusIndicator.querySelector('.status-text');
        
        if (!timeDisplay || !statusIndicator || !statusText) return;

        const currentTime = this.getCurrentAESTTime();
        const isBusinessHours = this.isBusinessHours();
        
        // Update time display
        timeDisplay.textContent = this.formatTime(currentTime);
        
        // Update status
        if (isBusinessHours) {
            statusIndicator.className = 'status-indicator active';
            statusText.textContent = 'Active';
        } else {
            statusIndicator.className = 'status-indicator away';
            statusText.textContent = 'Away';
        }
    }

    startTimer() {
        // Update immediately
        this.updateTime();
        
        // Then update every second
        setInterval(() => {
            this.updateTime();
        }, this.updateInterval);
    }

    // Public method to get current status
    getStatus() {
        return {
            isBusinessHours: this.isBusinessHours(),
            currentTime: this.getCurrentAESTTime(),
            timezone: this.timezone
        };
    }
}

// Prevent multiple instances
let businessTimeInstance = null;

function initializeBusinessTime() {
    if (!businessTimeInstance) {
        businessTimeInstance = new BusinessTimeDisplay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBusinessTime);

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBusinessTime);
} else {
    initializeBusinessTime();
}
