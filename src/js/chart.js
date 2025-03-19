export function createXPChart(projectData, containerId) {
	// Early return if no data or empty array
	if (!projectData || projectData.length === 0) {
		document.getElementById(containerId).innerHTML =
			'<p class="chart-no-data">No project data available for this module.</p>';
		return;
	}

	console.log("Chart data count:", projectData.length);

	// Sort data by creation date (newest first)
	const sortedData = [...projectData].sort((a, b) =>
		new Date(b.createdAt) - new Date(a.createdAt)
	);

	// Define chart dimensions and margins
	const margin = { top: 80, right: 30, bottom: 60, left: 80 };
	const width = 800 - margin.left - margin.right;
	const height = 400 - margin.top - margin.bottom;

	// Find maximum XP value for scaling
	const maxXP = Math.max(...sortedData.map(d => d.amount));
	console.log("Max XP for chart:", maxXP);

	// Calculate bar width based on data length - ensure minimum width for visibility
	const barWidth = Math.max(4, Math.min(50, (width / sortedData.length) - 2));

	// Create container with chart and info panel
	const container = document.getElementById(containerId);
	container.innerHTML = `
		<h3 class="chart-title">XP by Project (Oldest to Newest)</h3>
		<div class="chart-info-panel">
			<div class="project-name"></div>
			<div class="project-xp"></div>
			<div class="project-date"></div>
		</div>
		<div class="chart-svg-container"></div>
	`;

	// Generate the SVG - use 100% width with proper aspect ratio preservation
	const svg = `
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}">
      <g transform="translate(${margin.left}, ${margin.top})">
        <!-- X and Y axes -->
        <line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="#555" stroke-width="2" />
        <line x1="0" y1="0" x2="0" y2="${height}" stroke="#555" stroke-width="2" />
        
        <!-- Bars -->
        ${sortedData.reverse().map((project, i) => {
		// Ensure minimum height for visibility
		const barHeight = Math.max(1, (project.amount / maxXP) * height);
		const x = (width / sortedData.length) * i + (width / sortedData.length - barWidth) / 2;
		const y = height - barHeight;

		return `
            <g class="chart-bar-group" data-project="${project.object.name}" data-xp="${project.amount}" data-date="${new Date(project.createdAt).toLocaleDateString()}">
              <rect 
                x="${x}" 
                y="${y}" 
                width="${barWidth}" 
                height="${barHeight}" 
                fill="#ab54f1" 
                opacity="0.8"
                rx="2"
                class="chart-bar"
              />
            </g>
          `;
	}).join('')}
        
        <!-- Y-axis labels (XP values) -->
        ${[0, 0.25, 0.5, 0.75, 1].map(percent => {
		const yPos = height - (height * percent);
		const xpValue = Math.round(maxXP * percent);

		return `
            <g>
              <line 
                x1="-5" 
                y1="${yPos}" 
                x2="${width}" 
                y2="${yPos}" 
                stroke="#555" 
                stroke-dasharray="5,5" 
                opacity="0.3"
              />
              <text 
                x="-10" 
                y="${yPos + 5}" 
                text-anchor="end" 
                fill="#e0e0e0"
                font-size="12px"
              >
                ${xpValue} XP
              </text>
            </g>
          `;
	}).join('')}
      </g>
    </svg>
  `;

	// Insert the SVG into the container
	const svgContainer = container.querySelector('.chart-svg-container');
	svgContainer.innerHTML = svg;

	// Set a fixed height to maintain aspect ratio
	svgContainer.style.height = "500px";

	// Get info panel elements
	const infoPanel = container.querySelector('.chart-info-panel');
	const projectNameEl = infoPanel.querySelector('.project-name');
	const projectXpEl = infoPanel.querySelector('.project-xp');
	const projectDateEl = infoPanel.querySelector('.project-date');

	// Add event listeners for interactivity
	document.querySelectorAll('.chart-bar-group').forEach(group => {
		group.addEventListener('mouseenter', function () {
			const projectName = this.getAttribute('data-project');
			const xpAmount = this.getAttribute('data-xp');
			const date = this.getAttribute('data-date');
			const rect = this.querySelector('rect');

			// Highlight the bar
			rect.setAttribute('opacity', '1');
			rect.setAttribute('fill', '#c069ff');

			// Update info panel content
			projectNameEl.textContent = projectName;
			projectXpEl.textContent = `${xpAmount} XP`;
			projectDateEl.textContent = date;

			// Show the info panel
			infoPanel.classList.add('active');
		});

		group.addEventListener('mouseleave', function () {
			const rect = this.querySelector('rect');
			rect.setAttribute('opacity', '0.8');
			rect.setAttribute('fill', '#ab54f1');

			// Hide the info panel
			infoPanel.classList.remove('active');
		});
	});
}
