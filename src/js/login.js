import * as profile from './profile.js'
import * as demo from './demo.js'

// Track failed login attempts
let failedLoginAttempts = 0;

// Check for existing session when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const loadingContainer = document.getElementById('loading-container');
    const loginContainer = document.getElementById('login-container');
    
    // Check for demo mode cookie
    if (demo.isInDemoMode()) {
        const demoUserInfo = demo.createDemoUserInfo();
        window.scrollTo(0, 0);
        document.documentElement.style.overflowY = 'auto';
        await profile.loadProfilePage('demo_token', demoUserInfo);
        demo.addDemoBanner();
        return;
    }
    
    // Check if token exists in cookies
    const token = getCookie('auth_token');
    
    if (!token) {
        document.documentElement.style.overflowY = 'hidden';
        loadingContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        setupLoginForm();
        return;
    }
    
    try {
        const userInfo = await fetchUserInfo(token);
        await profile.loadProfilePage(token, userInfo);
    } catch (error) {
        console.error('Auto-login failed:', error);
        // Clear invalid cookie if auto-login fails
        deleteCookie('auth_token');
        loadingContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        setupLoginForm();
    }
});

function setupLoginForm() {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = form.querySelector('input[type="text"]').value
        const password = form.querySelector('input[type="password"]').value
        
        // Show loading during login attempt
        const loginContainer = document.getElementById('login-container');
        const loadingContainer = document.getElementById('loading-container');
        loginContainer.style.display = 'none';
        loadingContainer.style.display = 'flex';
        loadingContainer.querySelector('h2').textContent = 'Logging in...';
        
        try {
            const token = await login(username, password)
            // Reset failed attempts counter on successful login
            failedLoginAttempts = 0;
            // Set cookie with token upon successful login
            setCookie('auth_token', token, 7); // Store for 7 days
            const userInfo = await fetchUserInfo(token)
            await profile.loadProfilePage(token, userInfo)
            window.scrollTo(0, 0);
            document.documentElement.style.overflowY = 'auto';
        } catch (error) {
            failedLoginAttempts++;
            loginContainer.style.display = 'block';
            loadingContainer.style.display = 'none';
            
            displayErrorMessage(`Invalid credentials. Please try again.`)
            console.error('Login failed:', error)
        }
    });
    
    // Listener for demo mode button
    const demoButton = document.getElementById('demo-mode-button');
    if (demoButton) {
        demoButton.addEventListener('click', async () => {
            // Loading animation
            const loginContainer = document.getElementById('login-container');
            const loadingContainer = document.getElementById('loading-container');
            loginContainer.style.display = 'none';
            loadingContainer.style.display = 'flex';
            loadingContainer.querySelector('h2').textContent = 'Loading demo environment...';
            
            // Set demo mode
            demo.setDemoMode(true);
            const demoUserInfo = demo.createDemoUserInfo();
            
            // Load profile page with demo data
            setTimeout(async () => {
                await profile.loadProfilePage('demo_token', demoUserInfo);
                window.scrollTo(0, 0);
                document.documentElement.style.overflowY = 'auto';
                demo.addDemoBanner();
            }, 1500); // Small delay to show the loading animation
        });
    }
}

async function login(username, password) {
    const credentials = btoa(`${username}:${password}`)
    const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Basic ${credentials}`
        }
    });
    const data = await response.json()
    if (!response.ok) {
        console.error('Login response:', data)
        throw new Error('Failed to login')
    }
    return data
}

export async function fetchUserInfo(token) {
    if (demo.isInDemoMode() || token === 'demo_token') {
        return demo.createDemoUserInfo();
    }
    
    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query {
                    user {
                        id
                        login
                        attrs
                        totalUp
                        totalDown
                    }
                }
            `
        })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user info')
    }
    const data = await response.json()
    
    return data.data.user[0]
}

function displayErrorMessage(message) {
    // Remove any existing error messages first
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message with animated effect
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    
    // Add a shake animation for multiple failed attempts
    if (failedLoginAttempts > 1) {
        errorContainer.classList.add('shake');
    }
    
    document.getElementById('login-container').appendChild(errorContainer);
}

// Cookie management functions
export function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

export function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
}

export function logout() {
    deleteCookie('auth_token');
    deleteCookie('demo_mode');
    window.location.reload();
}
