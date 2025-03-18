import * as utils from './utils.js'
import * as audit from './audit.js'

export async function loadProfilePage(token, userInfo, selectedModuleId = null) {
	const audits = await fetchUserAudit(token, userInfo.login, true)
	const modules = await fetchUserModule(token)

	// Find Piscine-Go module or default to the first module
	if (selectedModuleId === null) {
		const piscineGoModule = modules.find(mod => mod.event.object.name === 'Piscine-Go');
		selectedModuleId = piscineGoModule ? piscineGoModule.event.id : (modules[0]?.event.id || 0);
	}

	const xp = await fetchUserXP(token, selectedModuleId)

	console.log("XP:", xp)
	console.log("Modules:", modules)
	console.log(audits)

	document.body.innerHTML = `
        <div class="welcome-banner">
            <h1>Welcome, ${userInfo.attrs['firstName']} ${userInfo.attrs['lastName']}</h1>
            <div class="user-icon-container">
                <svg id="user-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            </div>
        </div>

        <div class="profile-container">
            <h2>Profile Page</h2>
            
            <div class="module-tabs">
                ${modules.map(mod => `
                    <div class="module-tab ${selectedModuleId == mod.event.id ? 'selected' : ''}" 
                         data-module-id="${mod.event.id}">
                        ${mod.event.object.name}
                    </div>
                `).join('')}
            </div>
            
            <div class="xp-display">
                <h3>XP for ${modules.find(m => m.event.id == selectedModuleId)?.event.object.name || 'Selected Module'}</h3>
                <p class="xp-amount">${xp.amount !== null ? utils.formatSize(xp.amount) : '0 XP'}</p>
            </div>
            
            <div class="profile-sections-grid">
                <div class="profile-section audit-ratio">
                    <h3>${userInfo.login}'s audit ratio</h3>
                    <p class="audit-stat up">
                        <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                            <path d="M4,12l1.41,1.41L11,7.83V20h2V7.83l5.58,5.59L20,12l-8-8L4,12z" fill="#4CAF50"/>
                        </svg>
                        Done: ${utils.formatSize(userInfo.totalUp)}
                    </p>
                    <p class="audit-stat down">
                        <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                            <path d="M20,12l-1.41-1.41L13,16.17V4h-2v12.17l-5.58-5.59L4,12l8,8L20,12z" fill="#F44336"/>
                        </svg>
                        Received: ${utils.formatSize(userInfo.totalDown)}
                    </p>
                </div>
                
                <div class="profile-section last-audit">
                    <h3>Last audit</h3>
                    <p class="audit-info">${audits[0]?.group.object.name || 'No audits'} - ${audits[0]?.group.captainLogin || ''}</p>
                    <p class="audit-info">${audits[0] ? new Date(audits[0].group.createdAt).toLocaleDateString() : ''}</p>
                    ${audits[0] ? `
                    <div class="audit-info">
                        <span class="${audits[0].grade < 1 ? 'grade-fail' : 'grade-success'}">
                            ${audits[0].grade < 1 ? 'FAILED' : 'PASSED'}
                        </span>
                    </div>
                    ` : ''}
                    <div class="audit-info">
                        <button id="see-more-audits" class="btn-link">See more</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- User info sliding panel -->
        <div class="user-panel" id="user-panel">
            <div class="user-panel-header">
                <h3>${userInfo.attrs['firstName']} ${userInfo.attrs['lastName']}'s Profile</h3>
                <button class="close-panel" id="close-panel">×</button>
            </div>
            <div class="user-panel-content">
                <div class="user-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                </div>
                <div class="user-info-section">
                    <p><strong>ID:</strong> ${userInfo.id}</p>
                    <p><strong>Login:</strong> ${userInfo.login}</p>
                    <p><strong>Email:</strong> ${userInfo.attrs['email']}</p>
                    <p><strong>Gender:</strong> ${userInfo.attrs['gender']}</p>
					<p><strong>Date of birth:</strong> ${new Date(userInfo.attrs['dateOfBirth']).toLocaleDateString()}</p>
                    <p><strong>Country:</strong> ${userInfo.attrs['country']}</p>
					<p><strong>Email Validated:</strong> ${userInfo.attrs['mailcheckAccepted'] ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
        <div class="overlay" id="overlay"></div>
    `;

	// Add event listener for "See more" audits button
	document.getElementById('see-more-audits').addEventListener('click', () => {
		audit.loadAuditsPage(token, userInfo.login);
	});

	// Add event listeners to module tabs
	document.querySelectorAll('.module-tab').forEach(tab => {
		tab.addEventListener('click', async () => {
			const moduleId = parseInt(tab.getAttribute('data-module-id'));
			await loadProfilePage(token, userInfo, moduleId);
		});
	});

	// Add event listeners for user panel toggle
	const userIcon = document.getElementById('user-icon');
	const userPanel = document.getElementById('user-panel');
	const closePanel = document.getElementById('close-panel');
	const overlay = document.getElementById('overlay');

	userIcon.addEventListener('click', () => {
		userPanel.classList.add('show');
		overlay.classList.add('active');
		document.body.classList.add('no-scroll');
	});

	closePanel.addEventListener('click', closeUserPanel);
	overlay.addEventListener('click', closeUserPanel);

	function closeUserPanel() {
		userPanel.classList.remove('show');
		overlay.classList.remove('active');
		document.body.classList.remove('no-scroll');
	}
}

export async function fetchUserAudit(token, userName, onlyLast = false) {
	const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
			query: `
                query {
                    audit(
                        where: {
                            _and: [
                                {auditorLogin: {_eq: "${userName}"}},
								{grade: {_is_null: false}}
                            ]
                        }
                        ${onlyLast ? ', limit: 1' : ''},
                        order_by: {group: {createdAt: desc}}
                    ) {
                        private {
                            code 
                        }
                        grade
                        resultId
                        group {
                            captainLogin
                            createdAt
                            object {
                                name
                                type
                            }
                        }
                    }
                }
            `
		})
	});
	if (!response.ok) {
		throw new Error('Failed to fetch user info')
	}
	const data = await response.json()


	return data.data.audit
}

export async function fetchUserXP(token, id = 0) {
	const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
			query: `
				query {
					transaction_aggregate(where: {
						type: { _eq: "xp" },
						eventId: {_eq: ${id}}
					}) {
						aggregate {
							sum {
								amount
							}
						}
					}
				}
            `
		})
	});
	if (!response.ok) {
		throw new Error('Failed to fetch user info')
	}
	const data = await response.json()

	return data.data.transaction_aggregate.aggregate.sum
}

export async function fetchUserModule(token) {
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
						events(where:{ event: { object: { type : { _in: ["piscine", "module"] }}}}) {
						event {
						id
						object {
							name
							type
								}
							}
						}
					}
				}
            `
		})
	});
	if (!response.ok) {
		throw new Error('Failed to fetch user info')
	}
	const data = await response.json()

	return data.data.user[0].events
}