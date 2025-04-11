import {logout, setCookie, getCookie, deleteCookie } from './login.js';

// Flag to track demo mode
let isDemoMode = false;

export function isInDemoMode() {
    return isDemoMode || getCookie('demo_mode') === 'true';
}

export function setDemoMode(value) {
    isDemoMode = value;
    if (value) {
        setCookie('demo_mode', 'true', 1);
    } else {
        deleteCookie('demo_mode');
    }
}

export function addDemoBanner() {
    // In case any banner was already here
    removeDemoBanner();
    
    const banner = document.createElement('div');
    banner.id = 'demo-banner';
    banner.className = 'demo-banner';
    banner.innerHTML = 'You are viewing a demo with sample data.<br><a href="#" id="exit-demo">Exit Demo</a>';
    document.body.insertAdjacentElement('afterbegin', banner);
    
    // Make sure banner doesn't hide content
    document.body.style.paddingTop = banner.offsetHeight + 'px';
    
    document.getElementById('exit-demo').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    // Ensure banner persists through DOM changes
    if (!window._demoBannerObserver) {
        window._demoBannerObserver = new MutationObserver(() => {
            if (isInDemoMode() && !document.getElementById('demo-banner')) {
                addDemoBanner();
            }
        });
        window._demoBannerObserver.observe(document.body, {
            childList: true,
            subtree: false
        });
    }
}

function removeDemoBanner() {
    const existingBanner = document.getElementById('demo-banner');
    if (existingBanner) {
        existingBanner.remove();
        document.body.style.paddingTop = '0';
    }
}

export function createDemoUserInfo() {
    return {
        id: "demo-user-123",
        login: "demo_user",
        attrs: {
            firstName: "Demo",
            lastName: "User",
            email: "demo@example.com",
            gender: "Other",
            dateOfBirth: "2000-01-01T00:00:00Z",
            country: "DemoLand",
            mailcheckAccepted: true
        },
        totalUp: 420000,
        totalDown: 280000
    };
}

export function getDemoAuditData(onlyLast = false) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    const auditData = [
        {
            private: { code: "demo-code-1" },
            grade: 1,
            resultId: "result-001",
            group: {
                captainLogin: "captain_correct",
                createdAt: new Date(now - 3 * day).toISOString(),
                object: { name: "go-reloaded", type: "piscine" }
            }
        },
        {
            private: { code: "demo-code-2" },
            grade: 0,
            resultId: "result-002",
            group: {
                captainLogin: "captain_fail",
                createdAt: new Date(now - 7 * day).toISOString(),
                object: { name: "lem-in", type: "project" }
            }
        }
    ];
    
    return onlyLast ? [auditData[0]] : auditData;
}

export function getDemoModuleData() {
    return [
        { event: { id: 101, object: { name: "Piscine Go", type: "piscine" } } },
        { event: { id: 102, object: { name: "Piscine JS", type: "piscine" } } },
        { event: { id: 103, object: { name: "Cursus", type: "module" } } }
    ];
}

export function getDemoXPData(eventId = 0) {
    switch (eventId) {
        case 101: // Piscine-Go
            return { amount: 68000 };
        case 102: // JS-Piscine
            return { amount: 42000 };
        case 103: // Cursus
            return { amount: 96000 };
        default:
            return { amount: 50000 };
    }
}

export function getDemoXPLevel(eventId = 0) {
    switch (eventId) {
        case 101: // Piscine-Go
            return 9;
        case 102: // JS-Piscine
            return 7;
        case 103: // Curriculum
            return 12;
        default:
            return 8;
    }
}

export function getDemoXPProject() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    return [
        {
            amount: 5000,
            isBonus: false,
            attrs: {},
            eventId: 101,
            createdAt: new Date(now - 90 * day).toISOString(),
            object: { name: "go-reloaded", type: "project" }
        },
        {
            amount: 10000,
            isBonus: false,
            attrs: {},
            eventId: 101,
            createdAt: new Date(now - 75 * day).toISOString(),
            object: { name: "ascii-art-web", type: "project" }
        },
        {
            amount: 8000,
            isBonus: true,
            attrs: {},
            eventId: 102,
            createdAt: new Date(now - 45 * day).toISOString(),
            object: { name: "lem-in", type: "project" }
        },
        {
            amount: 12000,
            isBonus: false,
            attrs: {},
            eventId: 102,
            createdAt: new Date(now - 30 * day).toISOString(),
            object: { name: "forum", type: "project" }
        },
        {
            amount: 7000,
            isBonus: false,
            attrs: {},
            eventId: 103,
            createdAt: new Date(now - 15 * day).toISOString(),
            object: { name: "make-your-game", type: "project" }
        }
    ];
}
