// JSON Formatter Application
class JSONFormatter {
    constructor() {
        this.input = document.getElementById('jsonInput');
        this.output = document.getElementById('jsonOutput');
        this.inputStatus = document.getElementById('inputStatus');
        this.outputStatus = document.getElementById('outputStatus');
        
        this.initializeEventListeners();
        this.loadFromLocalStorage();
    }
    
    initializeEventListeners() {
        // Button event listeners
        document.getElementById('formatBtn').addEventListener('click', () => this.formatJSON());
        document.getElementById('minifyBtn').addEventListener('click', () => this.minifyJSON());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateJSON());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyOutput());
        
        // Auto-validate on input
        this.input.addEventListener('input', () => {
            this.saveToLocalStorage();
            this.validateJSON(false);
        });
        
        // Handle paste events
        this.input.addEventListener('paste', (e) => {
            setTimeout(() => {
                this.validateJSON(false);
                this.formatJSON();
            }, 10);
        });
    }
    
    formatJSON() {
        const inputValue = this.input.value.trim();
        
        if (!inputValue) {
            this.showError('Please enter JSON data');
            return;
        }
        
        try {
            const parsed = JSON.parse(inputValue);
            const formatted = JSON.stringify(parsed, null, 2);
            
            // Display formatted JSON with syntax highlighting
            this.output.innerHTML = this.syntaxHighlight(formatted);
            this.showSuccess('JSON formatted successfully');
            this.outputStatus.textContent = 'Valid JSON';
            this.outputStatus.className = 'status valid';
            
            // Save to localStorage
            this.saveToLocalStorage();
        } catch (error) {
            this.showError(`Invalid JSON: ${error.message}`);
            this.outputStatus.textContent = 'Invalid JSON';
            this.outputStatus.className = 'status error';
        }
    }
    
    minifyJSON() {
        const inputValue = this.input.value.trim();
        
        if (!inputValue) {
            this.showError('Please enter JSON data');
            return;
        }
        
        try {
            const parsed = JSON.parse(inputValue);
            const minified = JSON.stringify(parsed);
            
            this.output.textContent = minified;
            this.showSuccess('JSON minified successfully');
            this.outputStatus.textContent = 'Minified';
            this.outputStatus.className = 'status valid';
            
            this.saveToLocalStorage();
        } catch (error) {
            this.showError(`Invalid JSON: ${error.message}`);
            this.outputStatus.textContent = 'Invalid JSON';
            this.outputStatus.className = 'status error';
        }
    }
    
    validateJSON(showAlert = true) {
        const inputValue = this.input.value.trim();
        
        if (!inputValue) {
            this.inputStatus.textContent = '';
            return false;
        }
        
        try {
            JSON.parse(inputValue);
            this.inputStatus.textContent = 'Valid JSON';
            this.inputStatus.className = 'status valid';
            
            if (showAlert) {
                this.showSuccess('JSON is valid!');
            }
            return true;
        } catch (error) {
            this.inputStatus.textContent = 'Invalid JSON';
            this.inputStatus.className = 'status error';
            
            if (showAlert) {
                this.showError(`Invalid JSON: ${error.message}`);
            }
            return false;
        }
    }
    
    clearAll() {
        this.input.value = '';
        this.output.innerHTML = '';
        this.inputStatus.textContent = '';
        this.outputStatus.textContent = '';
        localStorage.removeItem('jsonInput');
        this.showSuccess('Cleared');
    }
    
    copyOutput() {
        const outputText = this.output.textContent;
        
        if (!outputText) {
            this.showError('Nothing to copy');
            return;
        }
        
        // Create temporary textarea for copying
        const textarea = document.createElement('textarea');
        textarea.value = outputText;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showSuccess('Copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy');
        }
        
        document.body.removeChild(textarea);
    }
    
    syntaxHighlight(json) {
        // Replace special characters for HTML
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Apply syntax highlighting
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#52c41a' : '#ff4757',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    saveToLocalStorage() {
        localStorage.setItem('jsonInput', this.input.value);
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('jsonInput');
        if (saved) {
            this.input.value = saved;
            this.validateJSON(false);
        }
    }
}

// Add CSS for syntax highlighting and animations
const style = document.createElement('style');
style.textContent = `
    .json-key { color: #e06c75; font-weight: 500; }
    .json-string { color: #98c379; }
    .json-number { color: #d19a66; }
    .json-boolean { color: #56b6c2; }
    .json-null { color: #abb2bf; }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the formatter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new JSONFormatter();
    
    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Simulate ad loading (in production, replace with actual ad code)
    setTimeout(() => {
        document.querySelectorAll('.ad-placeholder').forEach(ad => {
            ad.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            ad.style.minHeight = '50px';
        });
    }, 1000);
    
    // Handle responsive behavior
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
});

function handleResponsive() {
    const width = window.innerWidth;
    const editorContainer = document.querySelector('.editor-container');
    
    // Adjust layout based on screen size
    if (width < 768) {
        // Mobile: Stack everything vertically
        if (editorContainer) {
            editorContainer.style.gridTemplateColumns = '1fr';
        }
        
        // Hide sticky ad on mobile
        const stickyAd = document.querySelector('.ad-sticky');
        if (stickyAd) {
            stickyAd.style.display = 'none';
        }
    } else if (width < 1200) {
        // Tablet: Two columns
        if (editorContainer) {
            editorContainer.style.gridTemplateColumns = '1fr 1fr';
        }
    } else {
        // Desktop: Three columns with ad in middle
        if (editorContainer) {
            editorContainer.style.gridTemplateColumns = '1fr auto 1fr';
        }
    }
    
    // Adjust font sizes for very small screens
    if (width < 375) {
        document.documentElement.style.fontSize = '14px';
    } else {
        document.documentElement.style.fontSize = '16px';
    }
}

// Performance optimization: Debounce resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResponsive, 250);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to format
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('formatBtn').click();
    }
    
    // Ctrl/Cmd + Shift + C to copy
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        document.getElementById('copyBtn').click();
    }
    
    // Ctrl/Cmd + Shift + X to clear
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        document.getElementById('clearBtn').click();
    }
});