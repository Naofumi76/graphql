export function loadProfilePage(userInfo) {
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
                <h3>Section 2: Additional Information</h3>

                <!-- Further informations to put here... -->

            </div>
            <div class="profile-section">
                <h3>Section 3: Additional Informations</h3>

                <!-- Further informations to put here... -->

            </div>
            <div class="profile-section">
                <h3>Section 4: Graphical Statistics</h3>

                <!-- Further informations to put here... -->
                
            </div>
        </div>
    `
}