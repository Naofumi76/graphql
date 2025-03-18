import * as profile from './profile.js';
import * as login from './login.js';

export async function loadAuditsPage(token, username) {
	try {
		const allAudits = await profile.fetchUserAudit(token, username);
		displayAudits(allAudits, username, token);
	} catch (error) {
		console.error('Failed to load audits:', error);
	}
}

function displayAudits(audits, username, token) {
	const filteredAudits = audits.filter(audit => audit.grade !== null);

	// Sort audits from newest to oldest
	const sortedAudits = filteredAudits.sort((a, b) =>
		new Date(b.group.createdAt) - new Date(a.group.createdAt)
	);

	document.body.innerHTML = `
		<div class="profile-container audit-page">
			<button id="back-to-profile" class="btn-primary">Back to Profile</button>
            <div class="audit-header-section">
                <h2>All Audits for ${username}</h2>
                <h3>Number of audits: ${filteredAudits.length}</h3>
            </div>
            <div class="audit-grid">
                ${sortedAudits.map((audit) => {
				const date = new Date(audit.group.createdAt).toLocaleDateString();
				return `
                    <div class="audit-card">
                        <div class="audit-content">
                            ${audit.group.object.name} - 
                            ${audit.group.captainLogin}
							<p>${date}</p>
                            <span class="${audit.grade < 1 ? 'grade-fail' : 'grade-success'}">
                                <p>${audit.grade < 1 ? 'FAILED' : 'PASSED'}</p>
                            </span>
                        </div>
                    </div>
                    `;
				}).join('')}
            </div>
        </div>
    `;

	document.getElementById('back-to-profile').addEventListener('click', async () => {
		try {
			// Fetch user info again to reload the profile page
			const userInfo = await login.fetchUserInfo(token);
			await profile.loadProfilePage(token, userInfo);
		} catch (error) {
			console.error('Failed to go back to profile:', error);
		}
	});
}