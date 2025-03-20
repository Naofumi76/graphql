import * as profile from './profile.js'

// Track failed login attempts
let failedLoginAttempts = 0;

// Check for existing session when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Try to auto-login with stored token
        const token = getCookie('auth_token');
        if (token) {
            const userInfo = await fetchUserInfo(token);
            await profile.loadProfilePage(token, userInfo);
            return; // Skip login form if session exists
        }
    } catch (error) {
        console.error('Auto-login failed:', error);
        // Clear invalid cookie if auto-login fails
        deleteCookie('auth_token');
    }

    // Only set up the login form if no valid session exists
    setupLoginForm();
});

function setupLoginForm() {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = form.querySelector('input[type="text"]').value
        const password = form.querySelector('input[type="password"]').value
        try {
            const token = await login(username, password)
            // Reset failed attempts counter on successful login
            failedLoginAttempts = 0;
            // Set cookie with token upon successful login
            setCookie('auth_token', token, 7); // Store for 7 days (adjust as needed)
            const userInfo = await fetchUserInfo(token)
            await profile.loadProfilePage(token, userInfo)
        } catch (error) {
            failedLoginAttempts++;
            displayErrorMessage(`Invalid credentials. Please try again.`)
            console.error('Login failed:', error)
        }
    });
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
    
    // Entire Data Structure
    console.log(data)

    // Entire User Array
    console.log(data.data.user[0])
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
    
    document.querySelector('.auth-container').appendChild(errorContainer);
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
    window.location.reload();
}
