document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = form.querySelector('input[type="text"]').value
        const password = form.querySelector('input[type="password"]').value
        try {
            const token = await login(username, password)
            const userInfo = await fetchUserInfo(token)
            loadProfilePage(userInfo)
        } catch (error) {
            console.error('Login failed:', error)
        }
    });
});

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

async function fetchUserInfo(token) {
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

function loadProfilePage(userInfo) {
    document.body.innerHTML = `
        <div class="auth-container">
            <p>Hello, ${userInfo.login}</p>
        </div>
    `;
}
