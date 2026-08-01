// DOM Elements
const urlInput = document.getElementById('urlInput');
const goButton = document.getElementById('goButton');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const proxyFrame = document.getElementById('proxyFrame');
const proxyIframe = document.getElementById('proxyIframe');
const currentUrlDisplay = document.getElementById('currentUrl');
const backButton = document.getElementById('backButton');
const refreshButton = document.getElementById('refreshButton');
const closeButton = document.getElementById('closeButton');
const quickLinks = document.querySelectorAll('.quick-link');

let currentUrl = '';
let history = [];

// Validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Normalize URL
function normalizeUrl(url) {
    url = url.trim();
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    return url;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Show loading
function showLoading(show = true) {
    loadingMessage.style.display = show ? 'flex' : 'none';
}

// Load URL in proxy
function loadProxyUrl(url) {
    url = normalizeUrl(url);
    
    if (!isValidUrl(url)) {
        showError('Please enter a valid URL');
        return;
    }
    
    showLoading(true);
    
    try {
        currentUrl = url;
        history.push(url);
        
        // Update display
        currentUrlDisplay.textContent = url;
        
        // Construct proxy URL
        const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
        
        // Load in iframe
        proxyIframe.src = proxyUrl;
        
        // Show proxy frame
        proxyFrame.style.display = 'block';
        
        // Scroll to iframe
        proxyFrame.scrollIntoView({ behavior: 'smooth' });
        
        // Hide loading after delay
        setTimeout(() => showLoading(false), 1000);
        
    } catch (error) {
        showError('Failed to load URL: ' + error.message);
        showLoading(false);
    }
}

// Event Listeners
goButton.addEventListener('click', () => {
    const url = urlInput.value;
    if (url) {
        loadProxyUrl(url);
    } else {
        showError('Please enter a URL');
    }
});

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        goButton.click();
    }
});

backButton.addEventListener('click', () => {
    if (history.length > 1) {
        history.pop(); // Remove current
        const previousUrl = history[history.length - 1];
        loadProxyUrl(previousUrl);
    }
});

refreshButton.addEventListener('click', () => {
    if (currentUrl) {
        proxyIframe.src = proxyIframe.src;
    }
});

closeButton.addEventListener('click', () => {
    proxyFrame.style.display = 'none';
    proxyIframe.src = '';
    currentUrl = '';
    history = [];
    urlInput.value = '';
});

// Quick links
quickLinks.forEach(link => {
    link.addEventListener('click', () => {
        const url = link.getAttribute('data-url');
        urlInput.value = url;
        loadProxyUrl(url);
    });
});

// Handle iframe errors
proxyIframe.addEventListener('error', () => {
    showError('Failed to load the requested page');
    showLoading(false);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Check connection to proxy.dev7.xyz on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        console.log('✅ Connected to:', data.domain);
    } catch (error) {
        console.error('❌ Connection check failed:', error);
    }
});
