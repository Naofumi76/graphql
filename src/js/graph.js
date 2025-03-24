export async function userXPPerProject(token, EVENT_ID, moduleType) {
	const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
			query: `
				query {
					transaction(
						where: {
							transaction_type: { type: { _eq: "xp" } },
							eventId: { _eq: ${EVENT_ID} }
						},
						order_by: { createdAt: desc }
					) {
						amount
						isBonus
						attrs
						eventId
						createdAt
						object {
						name
						type
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

	// Apply different filtering based on module type
	// For piscine: return all data
	// For cursus/module: filter to only show projects (exercises are skipped because they are from exams)
	if (moduleType === 'piscine') {
		return data.data.transaction;
	} else {
		// Filter for transactions that ARE project type
		const filteredData = data.data.transaction.filter((transaction) =>
			transaction.object && transaction.object.type === 'project'
		);
		return filteredData;
	}
}

export async function userXPLevel(token, EVENT_ID, userLogin) {
	const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
			query: `
				query {
					event_user(where: { userLogin: { _eq: "${userLogin}" }, eventId: { _eq: ${EVENT_ID} } }) {
						level
					}
				}
			`
		})
	});
	if (!response.ok) {
		throw new Error('Failed to fetch user level')
	}
	const data = await response.json()
	
	
	// Return the level or 0 if no data is found
	return data.data.event_user[0]?.level || 0;
}