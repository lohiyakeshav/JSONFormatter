// ========================================
// CYBER JSON NEXUS - Main JavaScript
// ========================================

// Global State
let currentTab = 'format';
let formatCount = 0;
let bytesProcessed = 0;
let currentJsonPath = '';

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initializeMatrixRain();
    initializeParticles();
    initializeTabs();
    initializeEditors();
    initializeKeyboardShortcuts();
    initializeSettings();
    initializeQuickTools();
    loadSampleJSON();
    updateStats();
});

// ========================================
// Matrix Rain Effect
// ========================================
function initializeMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// Particle Effects
// ========================================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 15000);
    }
    
    // Create initial particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createParticle(), i * 300);
    }
    
    // Continue creating particles
    setInterval(createParticle, 2000);
}

// ========================================
// Tab Management
// ========================================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            currentTab = tabName;
            
            // Show loading animation
            showLoading();
            setTimeout(() => hideLoading(), 300);
        });
    });
}

// ========================================
// JSON Editor Functionality
// ========================================
function initializeEditors() {
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    
    // Format Button
    document.getElementById('format-btn').addEventListener('click', formatJSON);
    document.getElementById('minify-quick-btn').addEventListener('click', minifyJSON);
    
    // Input handlers
    jsonInput.addEventListener('input', () => {
        updateLineNumbers('input-lines', jsonInput.value);
        updateSize('input-size', jsonInput.value);
        validateRealtime(jsonInput.value);
    });
    
    // Paste button
    document.getElementById('paste-btn').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            jsonInput.value = text;
            updateLineNumbers('input-lines', text);
            updateSize('input-size', text);
            showToast('Pasted from clipboard', 'success');
        } catch (err) {
            showToast('Failed to paste from clipboard', 'error');
        }
    });
    
    // Sample button
    document.getElementById('sample-btn').addEventListener('click', loadSampleJSON);
    
    // Clear button
    document.getElementById('clear-input-btn').addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.innerHTML = '';
        updateLineNumbers('input-lines', '');
        updateLineNumbers('output-lines', '');
        updateSize('input-size', '');
        updateSize('output-size', '');
        showToast('Cleared input', 'success');
    });
    
    // Copy button
    document.getElementById('copy-btn').addEventListener('click', () => {
        const text = jsonOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    });
    
    // Download button
    document.getElementById('download-btn').addEventListener('click', downloadJSON);
    
    // Tree view button
    document.getElementById('tree-view-btn').addEventListener('click', toggleTreeView);
    
    // Initialize other tab editors
    initializeMinifyTab();
    initializeValidateTab();
    initializeCSVTab();
    initializeDiffTab();
    initializeSchemaTab();
}

// ========================================
// JSON Formatting
// ========================================
function formatJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const indentSelect = document.getElementById('indent-select').value;
    
    if (!input.trim()) {
        showToast('Please enter JSON to format', 'error');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        let indent = 2;
        
        if (indentSelect === '4') indent = 4;
        else if (indentSelect === 'tab') indent = '\t';
        
        const formatted = JSON.stringify(parsed, null, indent);
        
        // Apply syntax highlighting
        output.innerHTML = syntaxHighlight(formatted);
        
        // Update line numbers
        updateLineNumbers('output-lines', formatted);
        updateSize('output-size', formatted);
        
        // Update stats
        formatCount++;
        bytesProcessed += input.length;
        updateStats();
        
        // Add click handlers for path finding
        addPathClickHandlers(output, parsed);
        
        showToast('JSON formatted successfully', 'success');
        
        // Update status
        document.getElementById('input-status').textContent = '✅ Valid JSON';
        document.getElementById('input-status').style.color = '#00ff00';
        
    } catch (error) {
        output.innerHTML = `<span style="color: #ff4444;">Error: ${error.message}</span>`;
        showToast('Invalid JSON: ' + error.message, 'error');
        
        document.getElementById('input-status').textContent = '❌ Invalid JSON';
        document.getElementById('input-status').style.color = '#ff4444';
    }
}

// ========================================
// JSON Minification
// ========================================
function minifyJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    
    if (!input.trim()) {
        showToast('Please enter JSON to minify', 'error');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        
        output.innerHTML = `<pre>${escapeHtml(minified)}</pre>`;
        updateSize('output-size', minified);
        
        showToast('JSON minified successfully', 'success');
        
    } catch (error) {
        showToast('Invalid JSON: ' + error.message, 'error');
    }
}

// ========================================
// Syntax Highlighting
// ========================================
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
        function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                    match = match.replace(/"/g, '&quot;');
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + ' json-clickable">' + match + '</span>';
        })
        .replace(/([{}\[\]])/g, '<span class="json-bracket">$1</span>')
        .replace(/,/g, '<span class="json-comma">,</span>');
}

// ========================================
// Path Finding
// ========================================
function addPathClickHandlers(container, jsonObj) {
    const clickables = container.querySelectorAll('.json-clickable');
    
    clickables.forEach(element => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            const path = findJsonPath(jsonObj, element.textContent.replace(/[":]/g, ''));
            document.getElementById('json-path').textContent = path || 'Path: root';
            
            // Highlight the clicked element
            clickables.forEach(el => el.style.background = 'transparent');
            element.style.background = 'rgba(0, 255, 255, 0.2)';
        });
    });
}

function findJsonPath(obj, target, currentPath = '') {
    if (obj === target) return currentPath || 'root';
    
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            const result = findJsonPath(obj[key], target, newPath);
            if (result) return result;
        }
    }
    
    return null;
}

// ========================================
// Minify Tab
// ========================================
function initializeMinifyTab() {
    const minifyInput = document.getElementById('minify-input');
    const minifyOutput = document.getElementById('minify-output');
    const minifyBtn = document.getElementById('minify-execute-btn');
    
    minifyBtn.addEventListener('click', () => {
        const input = minifyInput.value;
        
        if (!input.trim()) {
            showToast('Please enter JSON to minify', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            minifyOutput.value = minified;
            
            // Update compression stats
            const originalSize = input.length;
            const minifiedSize = minified.length;
            const compressionRatio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
            
            document.getElementById('original-size').textContent = formatBytes(originalSize);
            document.getElementById('minified-size').textContent = formatBytes(minifiedSize);
            document.getElementById('compression-ratio').textContent = compressionRatio + '%';
            
            showToast('JSON minified successfully', 'success');
            
        } catch (error) {
            showToast('Invalid JSON: ' + error.message, 'error');
        }
    });
}

// ========================================
// Validate Tab
// ========================================
function initializeValidateTab() {
    const validateInput = document.getElementById('validate-input');
    
    validateInput.addEventListener('input', () => {
        updateLineNumbers('validate-lines', validateInput.value);
        validateJSON(validateInput.value);
    });
}

function validateJSON(input) {
    const statusDiv = document.getElementById('validation-status');
    const errorList = document.getElementById('error-list');
    
    if (!input.trim()) {
        statusDiv.className = 'validation-status';
        statusDiv.innerHTML = '<span class="status-icon">⏳</span><span class="status-text">Ready to validate</span>';
        errorList.innerHTML = '';
        return;
    }
    
    try {
        JSON.parse(input);
        statusDiv.className = 'validation-status valid';
        statusDiv.innerHTML = '<span class="status-icon">✅</span><span class="status-text">Valid JSON!</span>';
        errorList.innerHTML = '';
        
    } catch (error) {
        statusDiv.className = 'validation-status invalid';
        statusDiv.innerHTML = '<span class="status-icon">❌</span><span class="status-text">Invalid JSON</span>';
        
        // Parse error message for line number
        const errorMatch = error.message.match(/position (\d+)/);
        const position = errorMatch ? parseInt(errorMatch[1]) : 0;
        const lines = input.substring(0, position).split('\n');
        const lineNumber = lines.length;
        
        errorList.innerHTML = `
            <div class="error-item">
                <span class="error-line">Line ${lineNumber}:</span> ${error.message}
            </div>
        `;
    }
}

function validateRealtime(input) {
    if (!input.trim()) return;
    
    try {
        JSON.parse(input);
        document.getElementById('input-status').textContent = '✅ Valid';
        document.getElementById('input-status').style.color = '#00ff00';
    } catch (error) {
        document.getElementById('input-status').textContent = '❌ Invalid';
        document.getElementById('input-status').style.color = '#ff4444';
    }
}

// ========================================
// CSV Tab
// ========================================
function initializeCSVTab() {
    const convertBtn = document.getElementById('convert-csv-btn');
    
    convertBtn.addEventListener('click', () => {
        const input = document.getElementById('csv-json-input').value;
        const output = document.getElementById('csv-output');
        
        if (!input.trim()) {
            showToast('Please enter JSON to convert', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            
            if (!Array.isArray(parsed)) {
                showToast('JSON must be an array for CSV conversion', 'error');
                return;
            }
            
            const csv = jsonToCSV(parsed);
            output.value = csv;
            
            showToast('Converted to CSV successfully', 'success');
            
        } catch (error) {
            showToast('Invalid JSON: ' + error.message, 'error');
        }
    });
}

function jsonToCSV(jsonArray) {
    if (jsonArray.length === 0) return '';
    
    // Get headers
    const headers = Object.keys(jsonArray[0]);
    const csvHeaders = headers.join(',');
    
    // Get rows
    const csvRows = jsonArray.map(obj => {
        return headers.map(header => {
            const value = obj[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
}

// ========================================
// Diff Tab
// ========================================
function initializeDiffTab() {
    const compareBtn = document.getElementById('compare-btn');
    
    compareBtn.addEventListener('click', () => {
        const input1 = document.getElementById('diff-input1').value;
        const input2 = document.getElementById('diff-input2').value;
        const results = document.getElementById('diff-results');
        
        if (!input1.trim() || !input2.trim()) {
            showToast('Please enter both JSON files to compare', 'error');
            return;
        }
        
        try {
            const json1 = JSON.parse(input1);
            const json2 = JSON.parse(input2);
            
            const diff = compareJSON(json1, json2);
            displayDiff(diff, results);
            
            showToast('JSON comparison complete', 'success');
            
        } catch (error) {
            showToast('Invalid JSON: ' + error.message, 'error');
        }
    });
}

function compareJSON(obj1, obj2, path = '') {
    const differences = [];
    
    // Check for additions
    for (const key in obj2) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (!(key in obj1)) {
            differences.push({
                type: 'added',
                path: currentPath,
                value: obj2[key]
            });
        } else if (typeof obj2[key] === 'object' && obj2[key] !== null) {
            if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                differences.push(...compareJSON(obj1[key], obj2[key], currentPath));
            } else {
                differences.push({
                    type: 'modified',
                    path: currentPath,
                    oldValue: obj1[key],
                    newValue: obj2[key]
                });
            }
        } else if (obj1[key] !== obj2[key]) {
            differences.push({
                type: 'modified',
                path: currentPath,
                oldValue: obj1[key],
                newValue: obj2[key]
            });
        }
    }
    
    // Check for removals
    for (const key in obj1) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (!(key in obj2)) {
            differences.push({
                type: 'removed',
                path: currentPath,
                value: obj1[key]
            });
        }
    }
    
    return differences;
}

function displayDiff(differences, container) {
    if (differences.length === 0) {
        container.innerHTML = '<div style="color: #00ff00; text-align: center; padding: 2rem;">✅ No differences found</div>';
        return;
    }
    
    const html = differences.map(diff => {
        let className = 'diff-' + diff.type;
        let content = '';
        
        switch (diff.type) {
            case 'added':
                content = `<strong>+ Added:</strong> ${diff.path} = ${JSON.stringify(diff.value)}`;
                break;
            case 'removed':
                content = `<strong>- Removed:</strong> ${diff.path} = ${JSON.stringify(diff.value)}`;
                break;
            case 'modified':
                content = `<strong>~ Modified:</strong> ${diff.path}<br>
                          Old: ${JSON.stringify(diff.oldValue)}<br>
                          New: ${JSON.stringify(diff.newValue)}`;
                break;
        }
        
        return `<div class="${className}">${content}</div>`;
    }).join('');
    
    container.innerHTML = html;
}

// ========================================
// Schema Tab
// ========================================
function initializeSchemaTab() {
    const generateBtn = document.getElementById('generate-schema-btn');
    
    generateBtn.addEventListener('click', () => {
        const input = document.getElementById('schema-input').value;
        const output = document.getElementById('schema-output');
        
        if (!input.trim()) {
            showToast('Please enter JSON to generate schema', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const schema = generateJSONSchema(parsed);
            
            output.innerHTML = syntaxHighlight(JSON.stringify(schema, null, 2));
            
            showToast('Schema generated successfully', 'success');
            
        } catch (error) {
            showToast('Invalid JSON: ' + error.message, 'error');
        }
    });
}

function generateJSONSchema(obj) {
    const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": getType(obj)
    };
    
    if (schema.type === "object") {
        schema.properties = {};
        schema.required = [];
        
        for (const key in obj) {
            schema.properties[key] = getPropertySchema(obj[key]);
            schema.required.push(key);
        }
    } else if (schema.type === "array" && obj.length > 0) {
        schema.items = getPropertySchema(obj[0]);
    }
    
    return schema;
}

function getPropertySchema(value) {
    const type = getType(value);
    const schema = { type };
    
    if (type === "object" && value !== null) {
        schema.properties = {};
        for (const key in value) {
            schema.properties[key] = getPropertySchema(value[key]);
        }
    } else if (type === "array" && value.length > 0) {
        schema.items = getPropertySchema(value[0]);
    }
    
    return schema;
}

function getType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
}

// ========================================
// Quick Tools
// ========================================
function initializeQuickTools() {
    // Escape JSON
    document.getElementById('escape-json').addEventListener('click', () => {
        const input = document.getElementById('json-input').value;
        if (!input) {
            showToast('Please enter JSON to escape', 'error');
            return;
        }
        const escaped = JSON.stringify(input);
        document.getElementById('json-output').innerHTML = `<pre>${escapeHtml(escaped)}</pre>`;
        showToast('JSON escaped', 'success');
    });
    
    // Unescape JSON
    document.getElementById('unescape-json').addEventListener('click', () => {
        const input = document.getElementById('json-input').value;
        if (!input) {
            showToast('Please enter JSON to unescape', 'error');
            return;
        }
        try {
            const unescaped = JSON.parse(input);
            document.getElementById('json-output').innerHTML = `<pre>${escapeHtml(unescaped)}</pre>`;
            showToast('JSON unescaped', 'success');
        } catch (error) {
            showToast('Invalid escaped JSON', 'error');
        }
    });
    
    // Sort Keys
    document.getElementById('sort-keys').addEventListener('click', () => {
        const input = document.getElementById('json-input').value;
        if (!input) {
            showToast('Please enter JSON to sort', 'error');
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const sorted = sortObjectKeys(parsed);
            const formatted = JSON.stringify(sorted, null, 2);
            document.getElementById('json-output').innerHTML = syntaxHighlight(formatted);
            showToast('Keys sorted alphabetically', 'success');
        } catch (error) {
            showToast('Invalid JSON', 'error');
        }
    });
    
    // Remove Nulls
    document.getElementById('remove-nulls').addEventListener('click', () => {
        const input = document.getElementById('json-input').value;
        if (!input) {
            showToast('Please enter JSON', 'error');
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const cleaned = removeNulls(parsed);
            const formatted = JSON.stringify(cleaned, null, 2);
            document.getElementById('json-output').innerHTML = syntaxHighlight(formatted);
            showToast('Null values removed', 'success');
        } catch (error) {
            showToast('Invalid JSON', 'error');
        }
    });
}

function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);
    
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
    });
    return sorted;
}

function removeNulls(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.filter(item => item !== null).map(removeNulls);
    
    const cleaned = {};
    for (const key in obj) {
        if (obj[key] !== null) {
            cleaned[key] = removeNulls(obj[key]);
        }
    }
    return cleaned;
}

// ========================================
// Settings
// ========================================
function initializeSettings() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.checked = true; // Dark mode by default
    
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    });
    
    // Line numbers toggle
    const lineNumbersToggle = document.getElementById('line-numbers-toggle');
    lineNumbersToggle.addEventListener('change', (e) => {
        const lineNumbers = document.querySelectorAll('.line-numbers');
        lineNumbers.forEach(ln => {
            ln.style.display = e.target.checked ? 'block' : 'none';
        });
    });
    
    // Font size slider
    const fontSizeSlider = document.getElementById('font-size-slider');
    fontSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value + 'px';
        document.querySelectorAll('.json-textarea, .json-output').forEach(element => {
            element.style.fontSize = size;
        });
    });
}

// ========================================
// Keyboard Shortcuts
// ========================================
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+F - Format
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            formatJSON();
        }
        
        // Ctrl+M - Minify
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            minifyJSON();
        }
        
        // Ctrl+V - Validate
        if (e.ctrlKey && e.key === 'v' && !e.shiftKey) {
            e.preventDefault();
            document.querySelector('[data-tab="validate"]').click();
        }
        
        // Ctrl+C - Copy (when output is focused)
        if (e.ctrlKey && e.key === 'c' && document.activeElement.id === 'json-output') {
            e.preventDefault();
            document.getElementById('copy-btn').click();
        }
    });
}

// ========================================
// Utility Functions
// ========================================
function updateLineNumbers(elementId, text) {
    const element = document.getElementById(elementId);
    const lines = text.split('\n').length;
    const numbers = [];
    
    for (let i = 1; i <= lines; i++) {
        numbers.push(i);
    }
    
    element.innerHTML = numbers.join('<br>');
}

function updateSize(elementId, text) {
    const element = document.getElementById(elementId);
    const bytes = new Blob([text]).size;
    element.textContent = formatBytes(bytes);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 bytes';
    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateStats() {
    document.getElementById('format-count').textContent = formatCount;
    document.getElementById('bytes-count').textContent = formatBytes(bytesProcessed);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    document.getElementById('loading-overlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('show');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function downloadJSON() {
    const output = document.getElementById('json-output').textContent;
    if (!output) {
        showToast('No JSON to download', 'error');
        return;
    }
    
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('JSON downloaded', 'success');
}

function toggleTreeView() {
    // This would implement a tree view toggle
    // For now, just show a message
    showToast('Tree view coming soon!', 'success');
}

function loadSampleJSON() {
    const sampleJSON = {
        "name": "CYBER JSON NEXUS",
        "version": "1.0.0",
        "description": "The ultimate JSON power tool",
        "features": [
            "Format JSON",
            "Minify JSON",
            "Validate JSON",
            "JSON to CSV",
            "JSON Diff",
            "Schema Generator"
        ],
        "stats": {
            "users": 10000,
            "formattedJSONs": 1000000,
            "rating": 4.9
        },
        "nested": {
            "level1": {
                "level2": {
                    "level3": {
                        "deep": "value",
                        "array": [1, 2, 3, 4, 5]
                    }
                }
            }
        },
        "technologies": {
            "frontend": ["HTML5", "CSS3", "JavaScript"],
            "design": ["Cyberpunk", "Neon", "Glitch"],
            "features": ["Real-time validation", "Syntax highlighting", "Path finding"]
        },
        "active": true,
        "premium": false,
        "lastUpdated": "2024-01-01T00:00:00Z"
    };
    
    const jsonString = JSON.stringify(sampleJSON, null, 2);
    document.getElementById('json-input').value = jsonString;
    updateLineNumbers('input-lines', jsonString);
    updateSize('input-size', jsonString);
    
    showToast('Sample JSON loaded', 'success');
}