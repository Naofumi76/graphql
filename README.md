# 🚀 Zone01 GraphQL Dashboard  

A modern, interactive dashboard for visualizing student progress using the Zone01 GraphQL API. This application offers authentication, profile management, XP tracking, and audit information visualization in an intuitive interface.  

## 📌 Features  

### 🔐 **Authentication & Profile Management**  
- Secure **JWT-based authentication** with cookie persistence  
- View and manage your personal profile and progress stats  

### 📊 **Progress & XP Tracking**  
- **Graphical XP representation** across different modules  
- **Bar charts** for comparing project XP  
- **Timeline view** to track XP progression over time  

### 📑 **Audit Management**  
- Detailed audit history tracking  
- **Visual audit ratio comparison** for performance insights  

### 📱 **User Experience**  
- **Interactive data visualizations** using custom SVG-based charts  
- **Fully responsive design**, optimized for both desktop and mobile devices  

## 🛠️ Technologies Used  

| Technology | Purpose |
|------------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **API** | GraphQL |
| **Data Visualization** | Custom SVG-based charts |
| **Authentication** | JWT token-based authentication |
| **Storage** | Browser cookies for session persistence |

## 🏗️ Installation & Setup  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/Naofumi76/graphql
cd graphql
```

### **2️⃣ Run the Application**
You can use any local web server to run the application. Here are a few options:

**Option 1: Using Python's built-in server**
```bash
# For Python 3
python3 -m http.server
```
Then go to `localhost:8000/` (or the endpoint specified by python) to access the website.

**Option 2: Using VS Code Live Server extension**
If you're using Visual Studio Code, you can install the "Live Server" extension and start the server by clicking on "Go Live" in the status bar. Then go to the endpoint specified by the extension.

**Option 3: Directly access the original website**
You can access the original website at this link :
[GraphQL-Zone01](https://naofumi76.github.io/graphql/)

## 📖 How to Use

### Login
1. Enter your Zone01 username/email and your password
2. The system will authenticate you and load your personal dashboard

### Dashboard Navigation
- **Module Selection**: Switch between different modules using the top tabs
- **XP Information**: View your total XP and current level for each module
- **Charts**: Toggle between bar chart and timeline views using the chart tabs
- **Project Details**: Hover over chart elements to see detailed information

### Profile Management
- Click the profile icon in the top-right corner to view detailed profile information
- Use the logout button to securely end your session

## 🔍 Troubleshooting

### Authentication Issues
- Ensure you're using the correct Zone01 credentials
- Clear browser cookies and try logging in again
- Check your internet connection to ensure API requests can be made

### Display Problems
- This application works best in modern browsers (Chrome, Firefox, Edge)
- If charts aren't displaying properly, try refreshing the page
- For mobile users: rotate to landscape mode for optimal chart viewing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 👨‍💻 Credits

This project was made by [Naofumi76](https://github.com/Naofumi76). Check out my GitHub for more information.