import * as utils from './utils.js'
import * as audit from './audit.js'

export async function loadProfilePage(token, userInfo) {
	const audits = await fetchUserAudit(token, userInfo.login, true)
	console.log(userInfo.login)
	console.log(audits)
	document.body.innerHTML = `
        <div class="profile-container">
            <h2>Profile Page</h2>
            <div class="profile-section">
                <h3>User Information</h3>
                <p>ID: ${userInfo.id}</p>
                <p>Login: ${userInfo.login}</p>
                <p>First name: ${userInfo.attrs['firstName']}</p>
                <p>Last name: ${userInfo.attrs['lastName']}</p>
                <p>Email: ${userInfo.attrs['email']}</p>
                <p>Gender: ${userInfo.attrs['gender']}</p>
                <p>Country: ${userInfo.attrs['country']}</p>
                <!-- Add more user information here -->
            </div>
            <div class="profile-section">
                <h3>${userInfo.login}'s audit ratio</h3>
                <p>Done: ${utils.formatSize(userInfo.totalUp)}</p>
                <p>Received: ${utils.formatSize(userInfo.totalDown)}</p>
                <!-- Further informations to put here... -->
            </div>
            <div class="profile-section">
                <h3>Last audit</h3>
                <p>${audits[0].group.object.name} - ${audits[0].group.captainLogin}</p>
                <p>${new Date(audits[0].group.createdAt).toLocaleDateString()}</p>
                <span class="${audits[0].grade < 1 ? 'grade-fail' : 'grade-success'}">
                    <p>${audits[0].grade < 1 ? 'FAILED' : 'PASSED'}</p>
                </span>
                <button id="see-more-audits" class="btn-link">See more</button>
                <!-- Further informations to put here... -->
            </div>
            <div class="profile-section">
                <h3>Section 4: Graphical Statistics</h3>
                <!-- Further informations to put here... -->
            </div>
        </div>
    `;

	document.getElementById('see-more-audits').addEventListener('click', () => {
		audit.loadAuditsPage(token, userInfo.login);
	});
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

	// Entire Data Structure
	console.log(data)

	return data.data.audit
}

