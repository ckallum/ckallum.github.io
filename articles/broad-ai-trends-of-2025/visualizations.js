/**
 * Global AI Landscape 2025-2030: Data Visualizations
 * 
 * This file contains D3.js visualizations for the AI trends article.
 * Created using D3.js v7
 * Modified to include lazy loading for better performance
 */

// Store visualization functions in a mapping by their container IDs
const visualizationFunctions = {
  'magnificent-seven-chart': magnificentSevenChart,
  'chinese-tech-chart': chineseTechChart,
  'datacenter-map': datacenterMap,
  'gpu-comparison-chart': gpuComparisonChart,
  'model-comparison-chart': modelComparisonChart,
  'hbm-comparison-chart': hbmComparisonChart,
  'hbm-market-share-chart': hbmMarketShareChart,
  'gpu-comparison-table': gpuExportControlTable,
  'dev-tool-adoption-chart': devToolAdoptionChart,
  'enterprise-adoption-chart': enterpriseAdoptionChart,
  // Add the new Amazon AI chart functions
  'three-tier-chart': threeTierAIStackChart,
  'ai-investment-chart': amazonAIInvestmentChart,
  'ai-accelerator-chart': aiAcceleratorComparisonChart,
  'ai-training-cost-chart': aiTrainingCostChart,
  'alexa-plus-chart': alexaPlusMetricsChart
};

// Keep track of which visualizations have been initialized
const initializedVisualizations = new Set();

/**
 * Initialize the lazy loading system
 */
function initLazyLoading() {
  console.log('Initializing lazy loading for visualizations');
  
  // Define options for the Intersection Observer
  const options = {
    root: null, // Use the viewport as the root
    rootMargin: '100px', // Start loading when within 100px of viewport
    threshold: 0.1 // Start when at least 10% is visible
  };

  // Create the Intersection Observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If the element is intersecting the viewport
      if (entry.isIntersecting) {
        const vizContainer = entry.target;
        const vizId = vizContainer.id;
        
        // Check if we have a visualization function for this container
        if (visualizationFunctions[vizId] && !initializedVisualizations.has(vizId)) {
          console.log(`Lazy loading visualization: ${vizId}`);
          
          try {
            // Call the visualization function
            visualizationFunctions[vizId]();
            
            // Mark this visualization as initialized
            initializedVisualizations.add(vizId);
            
            // Once loaded, stop observing this element
            observer.unobserve(vizContainer);
          } catch (error) {
            console.error(`Error initializing ${vizId}:`, error);
          }
        }
      }
    });
  }, options);

  // Find all visualization containers and observe them
  document.querySelectorAll('.visualization-container').forEach(container => {
    if (container.id) {
      observer.observe(container);
      console.log(`Observing container: ${container.id}`);
    } else {
      console.warn('Found visualization container without ID, cannot lazy load');
    }
  });
}

/**
 * Initialize the lazy loading system when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize lazy loading instead of calling all visualization functions
  initLazyLoading();
});

// Add a debugging utility to help with troubleshooting
function debugVisualizations() {
  const containers = document.querySelectorAll('.visualization-container');
  console.log(`Found ${containers.length} visualization containers:`);
  
  containers.forEach(container => {
    const id = container.id || 'NO-ID';
    const hasChartContainer = !!container.querySelector('.chart-container');
    const chartContainerEmpty = hasChartContainer && 
                               !container.querySelector('.chart-container').hasChildNodes();
    const dimensions = hasChartContainer ? 
                      `${container.querySelector('.chart-container').clientWidth}x${container.querySelector('.chart-container').clientHeight}` : 
                      'N/A';
    const isInitialized = initializedVisualizations.has(id);
    const hasFunction = !!visualizationFunctions[id];
    
    console.log({
      id,
      hasChartContainer,
      chartContainerEmpty,
      dimensions,
      isInitialized,
      hasFunction
    });
  });
}

// Expose debugging function globally
window.debugVisualizations = debugVisualizations;

/**
 * Create the Magnificent Seven revenue growth chart
 */
function magnificentSevenChart() {
  const container = document.querySelector('#magnificent-seven-chart .chart-container');
  if (!container) {
    console.error('Magnificent Seven chart container not found');
    return;
  }
  
  // Data
  const data = [
    {name: 'Microsoft', color: '#00a4ef', values: [
      {year: 2025, revenue: 42}, {year: 2026, revenue: 53}, 
      {year: 2027, revenue: 68}, {year: 2028, revenue: 84}, 
      {year: 2029, revenue: 97}, {year: 2030, revenue: 112}
    ]},
    {name: 'Alphabet', color: '#4285f4', values: [
      {year: 2025, revenue: 38}, {year: 2026, revenue: 47}, 
      {year: 2027, revenue: 59}, {year: 2028, revenue: 70}, 
      {year: 2029, revenue: 82}, {year: 2030, revenue: 95}
    ]},
    {name: 'Meta', color: '#1877f2', values: [
      {year: 2025, revenue: 28}, {year: 2026, revenue: 36}, 
      {year: 2027, revenue: 45}, {year: 2028, revenue: 55}, 
      {year: 2029, revenue: 65}, {year: 2030, revenue: 78}
    ]},
    {name: 'Amazon', color: '#ff9900', values: [
      {year: 2025, revenue: 32}, {year: 2026, revenue: 41}, 
      {year: 2027, revenue: 52}, {year: 2028, revenue: 64}, 
      {year: 2029, revenue: 78}, {year: 2030, revenue: 94}
    ]},
    {name: 'Apple', color: '#a2aaad', values: [
      {year: 2025, revenue: 24}, {year: 2026, revenue: 30}, 
      {year: 2027, revenue: 38}, {year: 2028, revenue: 48}, 
      {year: 2029, revenue: 57}, {year: 2030, revenue: 66}
    ]},
    {name: 'NVIDIA', color: '#76b900', values: [
      {year: 2025, revenue: 52}, {year: 2026, revenue: 68}, 
      {year: 2027, revenue: 85}, {year: 2028, revenue: 102}, 
      {year: 2029, revenue: 120}, {year: 2030, revenue: 142}
    ]},
    {name: 'Tesla', color: '#e82127', values: [
      {year: 2025, revenue: 18}, {year: 2026, revenue: 24}, 
      {year: 2027, revenue: 31}, {year: 2028, revenue: 38}, 
      {year: 2029, revenue: 44}, {year: 2030, revenue: 52}
    ]}
  ];
  
  // Add rest of the function body...
  // Original implementation continues below...
  
  // Dimensions
  const margin = {top: 30, right: 50, bottom: 50, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleLinear()
    .domain([2025, 2030])
    .range([0, width]);
  
  // Y scale
  const y = d3.scaleLinear()
    .domain([0, 150])
    .range([height, 0]);
  
  // Line generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.revenue))
    .curve(d3.curveMonotoneX);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => d.toString()))
    .style('color', 'var(--text-secondary)')
    .selectAll('text')
    .style('text-anchor', 'middle');
  
  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y).ticks(5))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('AI Revenue (Billions USD)')
    .style('fill', 'var(--text-primary)');
  
  // Add lines
  svg.selectAll('.line')
    .data(data)
    .join('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', d => d.color)
    .style('stroke-width', 3)
    .style('fill', 'none');
  
  // Add circles for data points
  data.forEach(company => {
    svg.selectAll(`.circles-${company.name}`)
      .data(company.values)
      .join('circle')
      .attr('cx', d => x(d.year))
      .attr('cy', d => y(d.revenue))
      .attr('r', 5)
      .style('fill', company.color)
      .style('stroke', 'var(--bg-primary)')
      .style('stroke-width', 2);
  });
  
  // Create legend
  const legend = document.querySelector('#magnificent-seven-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    data.forEach(company => {
      const item = document.createElement('div');
      item.className = 'chart-legend-item';
      
      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = company.color;
      
      const text = document.createElement('span');
      text.textContent = company.name;
      
      item.appendChild(colorBox);
      item.appendChild(text);
      legend.appendChild(item);
    });
  }
  
  console.log('Magnificent Seven chart rendered successfully');
}


/**
 * Create the Chinese Tech Giants R&D investment chart
 */
function chineseTechChart() {
  const container = document.querySelector('#chinese-tech-chart .chart-container');
  if (!container) return;
  
  // Data
  const data = [
    { 
      name: 'Alibaba', 
      western: 'Amazon', 
      chineseColor: '#FF6A00', 
      westernColor: '#FF9900',
      values: [
        {year: 2025, chinese: 8.2, western: 12.6},
        {year: 2026, chinese: 9.8, western: 14.9},
        {year: 2027, chinese: 11.7, western: 17.8},
        {year: 2028, chinese: 14.1, western: 21.2},
        {year: 2029, chinese: 16.8, western: 25.3},
        {year: 2030, chinese: 20.2, western: 30.1}
      ]
    },
    {
      name: 'Baidu', 
      western: 'Alphabet', 
      chineseColor: '#2932E1', 
      westernColor: '#4285F4',
      values: [
        {year: 2025, chinese: 7.5, western: 18.4},
        {year: 2026, chinese: 9.2, western: 21.6},
        {year: 2027, chinese: 11.3, western: 25.7},
        {year: 2028, chinese: 13.5, western: 30.4},
        {year: 2029, chinese: 16.1, western: 36.2},
        {year: 2030, chinese: 19.3, western: 43.1}
      ]
    },
    {
      name: 'ByteDance', 
      western: 'Meta', 
      chineseColor: '#25F4EE', 
      westernColor: '#1877F2',
      values: [
        {year: 2025, chinese: 6.8, western: 13.6},
        {year: 2026, chinese: 8.7, western: 16.2},
        {year: 2027, chinese: 11.2, western: 19.4},
        {year: 2028, chinese: 14.1, western: 23.1},
        {year: 2029, chinese: 17.6, western: 27.6},
        {year: 2030, chinese: 21.9, western: 32.8}
      ]
    }
  ];
  
  // Dimensions
  const margin = {top: 30, right: 50, bottom: 70, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleBand()
    .domain([2025, 2026, 2027, 2028, 2029, 2030].map(d => d.toString()))
    .range([0, width])
    .padding(0.2);
  
  // Y scale
  const y = d3.scaleLinear()
    .domain([0, 50])
    .range([height, 0]);
  
  // Create groups for each pair
  const groups = data.map(d => d.name);
  
  // Group scale
  const groupScale = d3.scaleBand()
    .domain(groups)
    .range([0, x.bandwidth()])
    .padding(0.05);
  
  // X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'middle')
    .style('color', 'var(--text-secondary)');
  
  // X axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text('Year')
    .style('fill', 'var(--text-primary)');
  
  // Y axis
  svg.append('g')
    .call(d3.axisLeft(y))
    .style('color', 'var(--text-secondary)');
  
  // Y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('R&D Investment (Billions USD)')
    .style('fill', 'var(--text-primary)');
  
  // Render the grouped bars for each year
  data.forEach(company => {
    // Create group for Chinese company
    const groupChinese = svg.append('g');
    company.values.forEach(yearData => {
      groupChinese.append('rect')
        .attr('x', x(yearData.year.toString()) + groupScale(company.name))
        .attr('y', y(yearData.chinese))
        .attr('width', groupScale.bandwidth() / 2)
        .attr('height', height - y(yearData.chinese))
        .attr('fill', company.chineseColor)
        .attr('stroke', 'var(--bg-primary)')
        .attr('stroke-width', 1);
    });
    
    // Create group for Western company
    const groupWestern = svg.append('g');
    company.values.forEach(yearData => {
      groupWestern.append('rect')
        .attr('x', x(yearData.year.toString()) + groupScale(company.name) + groupScale.bandwidth() / 2)
        .attr('y', y(yearData.western))
        .attr('width', groupScale.bandwidth() / 2)
        .attr('height', height - y(yearData.western))
        .attr('fill', company.westernColor)
        .attr('stroke', 'var(--bg-primary)')
        .attr('stroke-width', 1);
    });
  });
  
  // Create legend
  const legend = document.querySelector('#chinese-tech-chart .chart-legend');
  
  data.forEach(company => {
    // Chinese company
    const chineseItem = document.createElement('div');
    chineseItem.className = 'chart-legend-item';
    
    const chineseColorBox = document.createElement('span');
    chineseColorBox.className = 'legend-color';
    chineseColorBox.style.backgroundColor = company.chineseColor;
    
    const chineseText = document.createElement('span');
    chineseText.textContent = company.name;
    
    chineseItem.appendChild(chineseColorBox);
    chineseItem.appendChild(chineseText);
    legend.appendChild(chineseItem);
    
    // Western company
    const westernItem = document.createElement('div');
    westernItem.className = 'chart-legend-item';
    
    const westernColorBox = document.createElement('span');
    westernColorBox.className = 'legend-color';
    westernColorBox.style.backgroundColor = company.westernColor;
    
    const westernText = document.createElement('span');
    westernText.textContent = company.western;
    
    westernItem.appendChild(westernColorBox);
    westernItem.appendChild(westernText);
    legend.appendChild(westernItem);
  });
}

/**
 * Create the global data center distribution map
 */
function datacenterMap() {
  const container = document.querySelector('#datacenter-map .map-container');
  if (!container) return;
  
  // Map dimensions
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Data centers by region and year with coordinates for a proper world map
  // Coordinates are based on Mercator projection
  const dataCenters = {
    2025: [
      {region: 'North America', count: 420, lat: 40, lng: -100},
      {region: 'Europe', count: 350, lat: 50, lng: 10},
      {region: 'China', count: 380, lat: 35, lng: 105},
      {region: 'India', count: 180, lat: 20, lng: 77},
      {region: 'Southeast Asia', count: 200, lat: 10, lng: 115},
      {region: 'Australia', count: 110, lat: -25, lng: 135},
      {region: 'South America', count: 90, lat: -20, lng: -60},
      {region: 'Middle East', count: 130, lat: 25, lng: 45},
      {region: 'Africa', count: 70, lat: 0, lng: 20}
    ],
    2026: [
      {region: 'North America', count: 470, lat: 40, lng: -100},
      {region: 'Europe', count: 390, lat: 50, lng: 10},
      {region: 'China', count: 450, lat: 35, lng: 105},
      {region: 'India', count: 210, lat: 20, lng: 77},
      {region: 'Southeast Asia', count: 230, lat: 10, lng: 115},
      {region: 'Australia', count: 125, lat: -25, lng: 135},
      {region: 'South America', count: 110, lat: -20, lng: -60},
      {region: 'Middle East', count: 150, lat: 25, lng: 45},
      {region: 'Africa', count: 85, lat: 0, lng: 20}
    ],
    2027: [
      {region: 'North America', count: 520, lat: 40, lng: -100},
      {region: 'Europe', count: 430, lat: 50, lng: 10},
      {region: 'China', count: 530, lat: 35, lng: 105},
      {region: 'India', count: 250, lat: 20, lng: 77},
      {region: 'Southeast Asia', count: 270, lat: 10, lng: 115},
      {region: 'Australia', count: 140, lat: -25, lng: 135},
      {region: 'South America', count: 130, lat: -20, lng: -60},
      {region: 'Middle East', count: 170, lat: 25, lng: 45},
      {region: 'Africa', count: 105, lat: 0, lng: 20}
    ],
    2028: [
      {region: 'North America', count: 580, lat: 40, lng: -100},
      {region: 'Europe', count: 480, lat: 50, lng: 10},
      {region: 'China', count: 620, lat: 35, lng: 105},
      {region: 'India', count: 300, lat: 20, lng: 77},
      {region: 'Southeast Asia', count: 320, lat: 10, lng: 115},
      {region: 'Australia', count: 160, lat: -25, lng: 135},
      {region: 'South America', count: 160, lat: -20, lng: -60},
      {region: 'Middle East', count: 200, lat: 25, lng: 45},
      {region: 'Africa', count: 130, lat: 0, lng: 20}
    ],
    2029: [
      {region: 'North America', count: 650, lat: 40, lng: -100},
      {region: 'Europe', count: 540, lat: 50, lng: 10},
      {region: 'China', count: 720, lat: 35, lng: 105},
      {region: 'India', count: 350, lat: 20, lng: 77},
      {region: 'Southeast Asia', count: 380, lat: 10, lng: 115},
      {region: 'Australia', count: 180, lat: -25, lng: 135},
      {region: 'South America', count: 190, lat: -20, lng: -60},
      {region: 'Middle East', count: 240, lat: 25, lng: 45},
      {region: 'Africa', count: 160, lat: 0, lng: 20}
    ],
    2030: [
      {region: 'North America', count: 730, lat: 40, lng: -100},
      {region: 'Europe', count: 610, lat: 50, lng: 10},
      {region: 'China', count: 850, lat: 35, lng: 105},
      {region: 'India', count: 420, lat: 20, lng: 77},
      {region: 'Southeast Asia', count: 450, lat: 10, lng: 115},
      {region: 'Australia', count: 205, lat: -25, lng: 135},
      {region: 'South America', count: 230, lat: -20, lng: -60},
      {region: 'Middle East', count: 280, lat: 25, lng: 45},
      {region: 'Africa', count: 190, lat: 0, lng: 20}
    ]
  };
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create a projection for the map
  const projection = d3.geoMercator()
    .scale((width) / (2 * Math.PI))
    .translate([width / 2, height / 1.5]);
  
  // Create a path generator
  const path = d3.geoPath().projection(projection);
  
  // Create a group for the map
  const mapGroup = svg.append('g');
  
  // Load world map data (simplified GeoJSON)
  // Using a simplified world map outline
  fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
    .then(response => response.json())
    .then(data => {
      // Draw the map
      mapGroup.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'var(--bg-secondary)')
        .attr('stroke', 'var(--border-color)')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.6);
        
      // Initialize with 2025 data
      updateVisualization(2025);
    })
    .catch(error => {
      console.error('Error loading map data:', error);
      // Fallback if map data fails to load - simple regional outlines
      const continents = [
        {name: 'North America', d: "M52,102 Q63,83 102,92 Q142,106 166,150 Q152,172 136,175 Q125,203 96,207 Q79,196 62,163 Q56,130 52,102 Z"},
        {name: 'South America', d: "M136,209 Q145,229 155,256 Q157,284 148,323 Q126,348 105,337 Q90,312 78,259 Q99,228 136,209 Z"},
        {name: 'Europe', d: "M258,103 Q274,91 297,90 Q324,96 341,106 Q352,121 346,139 Q330,148 300,149 Q282,140 269,124 Q256,115 258,103 Z"},
        {name: 'Africa', d: "M271,155 Q295,155 318,163 Q344,184 351,216 Q340,245 320,264 Q295,278 269,271 Q250,249 243,216 Q252,177 271,155 Z"},
        {name: 'Asia', d: "M354,103 Q380,90 420,95 Q465,110 493,136 Q504,168 485,201 Q453,217 417,217 Q376,211 354,194 Q343,162 354,103 Z"},
        {name: 'Australia', d: "M466,267 Q495,267 507,282 Q507,302 495,316 Q481,323 458,312 Q448,298 451,279 Q461,269 466,267 Z"}
      ];
      
      mapGroup.selectAll('.continent')
        .data(continents)
        .enter()
        .append('path')
        .attr('class', 'continent')
        .attr('d', d => d.d)
        .attr('fill', 'var(--bg-secondary)')
        .attr('stroke', 'var(--border-color)')
        .attr('stroke-width', 1)
        .attr('opacity', 0.6);
      
      // Initialize with 2025 data
      updateVisualization(2025);
    });
  
  // Function to update the visualization based on year
  function updateVisualization(year) {
    // Remove existing circles and labels
    svg.selectAll('.data-center').remove();
    svg.selectAll('.region-label').remove();
    
    // Convert lat/lng to x/y coordinates
    const dataWithCoords = dataCenters[year].map(d => {
      const coords = projection([d.lng, d.lat]);
      return {
        ...d,
        x: coords ? coords[0] : null,
        y: coords ? coords[1] : null
      };
    });
    
    // Add data centers as circles
    svg.selectAll('.data-center')
      .data(dataWithCoords)
      .enter()
      .append('circle')
      .attr('class', 'data-center')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => Math.sqrt(d.count) / 2)
      .attr('fill', '#4285f4')
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
    
    // Add labels
    svg.selectAll('.region-label')
      .data(dataWithCoords)
      .enter()
      .append('text')
      .attr('class', 'region-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y + Math.sqrt(d.count) / 2 + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '12px')
      .text(d => `${d.region}: ${d.count}`);
    
    // Update selected year display
    document.getElementById('selected-year').textContent = year;
  }
  
  // Add event listener to the year slider
  document.getElementById('year-slider').addEventListener('input', function(e) {
    updateVisualization(e.target.value);
  });
  
  // Create legend
  const legend = document.querySelector('#datacenter-map .map-legend');
  
  // Clear existing legend
  legend.innerHTML = '';
  
  // Add legend title
  const legendTitle = document.createElement('div');
  legendTitle.textContent = 'Number of AI-Optimized Data Centers';
  legendTitle.style.fontWeight = 'bold';
  legendTitle.style.marginBottom = '5px';
  legend.appendChild(legendTitle);
  
  // Sample sizes
  const sizes = [100, 300, 600];
  
  // Create legend items
  sizes.forEach(size => {
    const item = document.createElement('div');
    item.className = 'chart-legend-item';
    item.style.marginBottom = '5px';
    
    const sizeIndicator = document.createElement('span');
    sizeIndicator.className = 'legend-circle';
    sizeIndicator.style.display = 'inline-block';
    sizeIndicator.style.width = `${Math.sqrt(size) / 2}px`;
    sizeIndicator.style.height = `${Math.sqrt(size) / 2}px`;
    sizeIndicator.style.borderRadius = '50%';
    sizeIndicator.style.backgroundColor = '#4285f4';
    sizeIndicator.style.opacity = '0.7';
    sizeIndicator.style.marginRight = '10px';
    
    const text = document.createElement('span');
    text.textContent = `${size} data centers`;
    
    item.appendChild(sizeIndicator);
    item.appendChild(text);
    legend.appendChild(item);
  });
}

/**
 * Create GPU performance comparison chart
 */
function gpuComparisonChart() {
  const container = document.querySelector('#gpu-comparison-chart .chart-container');
  if (!container) return;
  
  // Data
  const data = [
    {
      category: 'Training Performance (FLOPS)',
      nvidia: 100,
      chinese: 62,
      unit: 'TFLOPS'
    },
    {
      category: 'Inference Throughput',
      nvidia: 100,
      chinese: 74,
      unit: 'queries/sec'
    },
    {
      category: 'Memory Bandwidth',
      nvidia: 100,
      chinese: 82,
      unit: 'GB/s'
    },
    {
      category: 'Power Efficiency',
      nvidia: 100,
      chinese: 70,
      unit: 'TFLOPS/watt'
    },
    {
      category: 'Software Ecosystem',
      nvidia: 100,
      chinese: 58,
      unit: 'score'
    }
  ];
  
  // Dimensions
  const margin = {top: 40, right: 150, bottom: 50, left: 180};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
  
  // Y scale
  const y = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, height])
    .padding(0.3);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5))
    .style('color', 'var(--text-secondary)');
  
  // Add X axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text('Performance Index (NVIDIA H100 = 100)')
    .style('fill', 'var(--text-primary)');
  
  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y))
    .style('color', 'var(--text-secondary)');
  
  // NVIDIA bars
  svg.selectAll('.bar-nvidia')
    .data(data)
    .join('rect')
    .attr('class', 'bar-nvidia')
    .attr('x', 0)
    .attr('y', d => y(d.category))
    .attr('width', d => x(d.nvidia))
    .attr('height', y.bandwidth() / 2)
    .attr('fill', '#76b900') // NVIDIA green
    .attr('opacity', 0.8);
  
  // Chinese GPU bars
  svg.selectAll('.bar-chinese')
    .data(data)
    .join('rect')
    .attr('class', 'bar-chinese')
    .attr('x', 0)
    .attr('y', d => y(d.category) + y.bandwidth() / 2)
    .attr('width', d => x(d.chinese))
    .attr('height', y.bandwidth() / 2)
    .attr('fill', '#e60012') // Red for Chinese GPUs
    .attr('opacity', 0.8);
  
  // Add value labels
  svg.selectAll('.label-nvidia')
    .data(data)
    .join('text')
    .attr('class', 'label-nvidia')
    .attr('x', d => x(d.nvidia) + 5)
    .attr('y', d => y(d.category) + y.bandwidth() / 4)
    .attr('dy', '0.35em')
    .attr('fill', 'var(--text-primary)')
    .text(d => `${d.nvidia}`);
  
  svg.selectAll('.label-chinese')
    .data(data)
    .join('text')
    .attr('class', 'label-chinese')
    .attr('x', d => x(d.chinese) + 5)
    .attr('y', d => y(d.category) + y.bandwidth() * 3/4)
    .attr('dy', '0.35em')
    .attr('fill', 'var(--text-primary)')
    .text(d => `${d.chinese}`);
  
  // Create legend
  const legend = document.querySelector('#gpu-comparison-chart .chart-legend');
  
  // NVIDIA legend
  const nvidiaItem = document.createElement('div');
  nvidiaItem.className = 'chart-legend-item';
  
  const nvidiaColorBox = document.createElement('span');
  nvidiaColorBox.className = 'legend-color';
  nvidiaColorBox.style.backgroundColor = '#76b900';
  nvidiaColorBox.style.opacity = '0.8';
  
  const nvidiaText = document.createElement('span');
  nvidiaText.textContent = 'NVIDIA H100 (Export-Controlled)';
  
  nvidiaItem.appendChild(nvidiaColorBox);
  nvidiaItem.appendChild(nvidiaText);
  legend.appendChild(nvidiaItem);
  
  // Chinese GPU legend
  const chineseItem = document.createElement('div');
  chineseItem.className = 'chart-legend-item';
  
  const chineseColorBox = document.createElement('span');
  chineseColorBox.className = 'legend-color';
  chineseColorBox.style.backgroundColor = '#e60012';
  chineseColorBox.style.opacity = '0.8';
  
  const chineseText = document.createElement('span');
  chineseText.textContent = 'Chinese Domestic GPUs';
  
  chineseItem.appendChild(chineseColorBox);
  chineseItem.appendChild(chineseText);
  legend.appendChild(chineseItem);
}

/**
 * Create model performance comparison chart
 */
function modelComparisonChart() {
  const container = document.querySelector('#model-comparison-chart .chart-container');
  if (!container) return;
  
  // Model data
  const modelData = {
    inference: [
      {model: 'Claude 4', value: 95, color: '#6b67e5'},
      {model: 'GPT-5', value: 100, color: '#10a37f'},
      {model: 'Gemini Ultra 2', value: 98, color: '#4285f4'},
      {model: 'Llama 4', value: 92, color: '#0080ff'},
      {model: 'GLM-6', value: 86, color: '#e60012'},
      {model: 'Yi-Plus', value: 83, color: '#ff4c4c'}
    ],
    parameters: [
      {model: 'Claude 4', value: 2.1, color: '#6b67e5'},
      {model: 'GPT-5', value: 3.5, color: '#10a37f'},
      {model: 'Gemini Ultra 2', value: 2.7, color: '#4285f4'},
      {model: 'Llama 4', value: 1.2, color: '#0080ff'},
      {model: 'GLM-6', value: 1.0, color: '#e60012'},
      {model: 'Yi-Plus', value: 0.8, color: '#ff4c4c'}
    ],
    accuracy: [
      {model: 'Claude 4', value: 92, color: '#6b67e5'},
      {model: 'GPT-5', value: 95, color: '#10a37f'},
      {model: 'Gemini Ultra 2', value: 94, color: '#4285f4'},
      {model: 'Llama 4', value: 90, color: '#0080ff'},
      {model: 'GLM-6', value: 86, color: '#e60012'},
      {model: 'Yi-Plus', value: 85, color: '#ff4c4c'}
    ],
    training: [
      {model: 'Claude 4', value: 35, color: '#6b67e5'},
      {model: 'GPT-5', value: 52, color: '#10a37f'},
      {model: 'Gemini Ultra 2', value: 42, color: '#4285f4'},
      {model: 'Llama 4', value: 18, color: '#0080ff'},
      {model: 'GLM-6', value: 15, color: '#e60012'},
      {model: 'Yi-Plus', value: 12, color: '#ff4c4c'}
    ],
    energy: [
      {model: 'Claude 4', value: 28, color: '#6b67e5'},
      {model: 'GPT-5', value: 42, color: '#10a37f'},
      {model: 'Gemini Ultra 2', value: 36, color: '#4285f4'},
      {model: 'Llama 4', value: 22, color: '#0080ff'},
      {model: 'GLM-6', value: 18, color: '#e60012'},
      {model: 'Yi-Plus', value: 16, color: '#ff4c4c'}
    ]
  };
  
  // Labels and units for metrics
  const metricInfo = {
    inference: {label: 'Inference Speed', unit: 'tokens/sec (relative)', maxValue: 100},
    parameters: {label: 'Parameter Count', unit: 'trillion parameters', maxValue: 4},
    accuracy: {label: 'Accuracy (MMLU)', unit: 'percent correct', maxValue: 100},
    training: {label: 'Training Cost', unit: 'million USD', maxValue: 60},
    energy: {label: 'Energy Consumption', unit: 'megawatt-hours (thousands)', maxValue: 50}
  };
  
  // Dimensions
  const margin = {top: 30, right: 20, bottom: 70, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Initial metric
  let currentMetric = 'inference';
  
  // Function to update the chart
  function updateChart(metric) {
    // Clear previous chart
    svg.selectAll('*').remove();
    
    // Get data for the selected metric
    const data = modelData[metric];
    
    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.model))
      .range([0, width])
      .padding(0.3);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, metricInfo[metric].maxValue])
      .range([height, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .style('color', 'var(--text-secondary)');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('color', 'var(--text-secondary)');
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text(`${metricInfo[metric].label} (${metricInfo[metric].unit})`)
      .style('fill', 'var(--text-primary)');
    
    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.model))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => d.color);
    
    // Add value labels
    svg.selectAll('.value-label')
      .data(data)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.model) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .text(d => d.value);
    
    // Update the legend
    updateLegend(data);
  }
  
  // Function to update the legend
  function updateLegend(data) {
    const legend = document.querySelector('#model-comparison-chart .chart-legend');
    legend.innerHTML = '';
    
    data.forEach(model => {
      const item = document.createElement('div');
      item.className = 'chart-legend-item';
      
      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = model.color;
      
      const text = document.createElement('span');
      text.textContent = model.model;
      
      item.appendChild(colorBox);
      item.appendChild(text);
      legend.appendChild(item);
    });
  }
  
  // Initialize chart with 'inference' metric
  updateChart(currentMetric);
  
  // Add event listener to metric selector
  document.getElementById('metric-selector').addEventListener('change', function(e) {
    currentMetric = e.target.value;
    updateChart(currentMetric);
  });
}

// Add these two functions to your visualizations.js file
// and update the document.addEventListener call at the top of the file
// to include them in initialization

/**
 * Create HBM Memory Capacity and Bandwidth Evolution Chart
 */
function hbmComparisonChart() {
  const container = document.querySelector('#hbm-comparison-chart .chart-container');
  if (!container) return;
  
  // Data
  const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  const capacityData = [
    {name: 'HBM3', color: '#3366cc', values: [48, 64, 80, 96, 96, 0, 0, 0]},
    {name: 'HBM3e', color: '#dc3912', values: [0, 96, 128, 144, 192, 192, 0, 0]},
    {name: 'HBM4', color: '#ff9900', values: [0, 0, 0, 192, 256, 384, 512, 768]}
  ];
  const bandwidthData = [
    {name: 'HBM3', color: '#3366cc', values: [3.2, 3.8, 4.0, 4.2, 4.2, 0, 0, 0]},
    {name: 'HBM3e', color: '#dc3912', values: [0, 4.8, 5.2, 5.6, 6.0, 6.0, 0, 0]},
    {name: 'HBM4', color: '#ff9900', values: [0, 0, 0, 6.4, 8.0, 10.0, 12.0, 14.0]}
  ];
  
  // Dimensions
  const margin = {top: 40, right: 20, bottom: 50, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Add toggle buttons
  const controls = d3.select(container).insert('div', 'svg')
    .attr('class', 'chart-controls')
    .style('text-align', 'center')
    .style('margin-bottom', '10px');
  
  controls.append('button')
    .attr('id', 'capacity-btn')
    .attr('class', 'active')
    .text('Memory Capacity (GB)')
    .style('margin', '0 5px')
    .style('padding', '5px 10px')
    .style('border', '1px solid var(--border-color)')
    .style('border-radius', '4px')
    .style('background', 'var(--bg-primary)')
    .style('color', 'var(--text-primary)')
    .style('cursor', 'pointer')
    .on('click', () => updateChart('capacity'));
  
  controls.append('button')
    .attr('id', 'bandwidth-btn')
    .text('Bandwidth (TB/s)')
    .style('margin', '0 5px')
    .style('padding', '5px 10px')
    .style('border', '1px solid var(--border-color)')
    .style('border-radius', '4px')
    .style('background', 'var(--bg-primary)')
    .style('color', 'var(--text-primary)')
    .style('cursor', 'pointer')
    .on('click', () => updateChart('bandwidth'));
  
  // Active button style
  d3.select('#capacity-btn')
    .style('background', 'var(--bg-secondary)')
    .style('font-weight', 'bold');
  
  // X scale
  const x = d3.scaleBand()
    .domain(years)
    .range([0, width])
    .padding(0.2);
  
  // Y scales
  const yCapacity = d3.scaleLinear()
    .domain([0, 800])
    .range([height, 0]);
  
  const yBandwidth = d3.scaleLinear()
    .domain([0, 15])
    .range([height, 0]);
  
  // Create axes
  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('color', 'var(--text-secondary)');
  
  const yAxisCapacity = svg.append('g')
    .attr('class', 'y-axis-capacity')
    .call(d3.axisLeft(yCapacity))
    .style('color', 'var(--text-secondary)');
  
  const yAxisBandwidth = svg.append('g')
    .attr('class', 'y-axis-bandwidth')
    .call(d3.axisLeft(yBandwidth))
    .style('color', 'var(--text-secondary)')
    .style('opacity', 0);
  
  // Create legend
  const legend = document.querySelector('#hbm-comparison-chart .chart-legend');
  legend.innerHTML = '';
  
  capacityData.forEach((d) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'chart-legend-item';
    
    const colorBox = document.createElement('span');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = d.color;
    
    const text = document.createElement('span');
    text.textContent = d.name;
    
    legendItem.appendChild(colorBox);
    legendItem.appendChild(text);
    legend.appendChild(legendItem);
  });
  
  // Function to update chart based on selected view
  function updateChart(view) {
    // Update button styles
    d3.select('#capacity-btn')
      .style('background', view === 'capacity' ? 'var(--bg-secondary)' : 'var(--bg-primary)')
      .style('font-weight', view === 'capacity' ? 'bold' : 'normal');
    
    d3.select('#bandwidth-btn')
      .style('background', view === 'bandwidth' ? 'var(--bg-secondary)' : 'var(--bg-primary)')
      .style('font-weight', view === 'bandwidth' ? 'bold' : 'normal');
    
    // Update y-axis visibility
    yAxisCapacity.style('opacity', view === 'capacity' ? 1 : 0);
    yAxisBandwidth.style('opacity', view === 'bandwidth' ? 1 : 0);
    
    // Y axis label
    svg.selectAll('.y-axis-label').remove();
    svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text(view === 'capacity' ? 'Memory Capacity (GB)' : 'Bandwidth (TB/s)')
      .style('fill', 'var(--text-primary)');
    
    // Clear existing bars
    svg.selectAll('.bar-group').remove();
    
    // Draw new bars based on selected data
    const data = view === 'capacity' ? capacityData : bandwidthData;
    const yScale = view === 'capacity' ? yCapacity : yBandwidth;
    
    // Create bar groups
    data.forEach((series, seriesIndex) => {
      const barGroup = svg.append('g')
        .attr('class', 'bar-group');
      
      // Add bars for each year with a value
      years.forEach((year, i) => {
        if (series.values[i] > 0) {
          barGroup.append('rect')
            .attr('x', x(year) + (x.bandwidth() / data.length) * seriesIndex)
            .attr('y', yScale(series.values[i]))
            .attr('width', x.bandwidth() / data.length - 2)
            .attr('height', height - yScale(series.values[i]))
            .attr('fill', series.color)
            .attr('opacity', 0.8);
          
          // Add value labels
          barGroup.append('text')
            .attr('x', x(year) + (x.bandwidth() / data.length) * seriesIndex + (x.bandwidth() / data.length) / 2)
            .attr('y', yScale(series.values[i]) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', 'var(--text-primary)')
            .text(series.values[i]);
        }
      });
    });
  }
  
  // Initialize chart with capacity view
  updateChart('capacity');
}

/**
 * Create HBM Market Share Pie Chart
 */
function hbmMarketShareChart() {
  const container = document.querySelector('#hbm-market-share-chart .chart-container');
  if (!container) return;
  
  // Market share data for 2025
  const marketShareData = [
    { company: 'SK Hynix', share: 42, color: '#4285F4' },
    { company: 'Samsung', share: 31, color: '#34A853' },
    { company: 'Micron', share: 24, color: '#FBBC05' },
    { company: 'CXMT', share: 3, color: '#EA4335' }
  ];
  
  // Dimensions
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);
  
  // Create pie generator
  const pie = d3.pie()
    .value(d => d.share)
    .sort(null);
  
  // Create arc generators
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius * 0.8);
  
  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
  
  // Draw pie segments
  const slices = svg.selectAll('.arc')
    .data(pie(marketShareData))
    .enter()
    .append('g')
    .attr('class', 'arc');
  
  slices.append('path')
    .attr('d', arc)
    .attr('fill', d => d.data.color)
    .attr('stroke', 'var(--bg-primary)')
    .style('stroke-width', '2px')
    .style('opacity', 0.9);
  
  // Add labels with connecting lines
  slices.append('polyline')
    .attr('points', function(d) {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    })
    .style('fill', 'none')
    .style('stroke', 'var(--text-secondary)')
    .style('stroke-width', '1px');
  
  slices.append('text')
    .attr('transform', function(d) {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 0.98 * (midAngle(d) < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
    .text(d => `${d.data.company} (${d.data.share}%)`)
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px');
  
  // Helper function for angle calculation
  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
  
  // Create legend
  const legend = document.querySelector('#hbm-market-share-chart .chart-legend');
  legend.innerHTML = '';
  
  marketShareData.forEach(d => {
    const legendItem = document.createElement('div');
    legendItem.className = 'chart-legend-item';
    
    const colorBox = document.createElement('span');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = d.color;
    
    const text = document.createElement('span');
    text.textContent = `${d.company}: ${d.share}%`;
    
    legendItem.appendChild(colorBox);
    legendItem.appendChild(text);
    legend.appendChild(legendItem);
  });
}

/**
 * Create GPU export control comparison table
 */
function gpuExportControlTable() {
  const container = document.querySelector('#gpu-comparison-table');
  if (!container) return;
  
  // Data is already in the HTML table
  // This function could be used to add interactivity in the future
}

/**
 * Create AI Developer Tool Adoption Growth Chart
 */
function devToolAdoptionChart() {
  const container = document.querySelector('#dev-tool-adoption-chart .chart-container');
  if (!container) return;
  
  // Data
  const data = [
    {
      name: 'GitHub Copilot',
      color: '#6e40c9',
      values: [
        {year: 2023, adoption: 24},
        {year: 2024, adoption: 43},
        {year: 2025, adoption: 62}
      ]
    },
    {
      name: 'Amazon Q / CodeWhisperer',
      color: '#ff9900',
      values: [
        {year: 2023, adoption: 9},
        {year: 2024, adoption: 22},
        {year: 2025, adoption: 38}
      ]
    },
    {
      name: 'Cursor',
      color: '#0072ef',
      values: [
        {year: 2023, adoption: 8},
        {year: 2024, adoption: 18},
        {year: 2025, adoption: 35}
      ]
    },
    {
      name: 'VSCode AI Assistant',
      color: '#007acc',
      values: [
        {year: 2023, adoption: 17},
        {year: 2024, adoption: 32},
        {year: 2025, adoption: 48}
      ]
    },
    {
      name: 'JetBrains AI Assistant',
      color: '#f97a12',
      values: [
        {year: 2023, adoption: 11},
        {year: 2024, adoption: 28},
        {year: 2025, adoption: 42}
      ]
    }
  ];
  
  // Dimensions
  const margin = {top: 30, right: 80, bottom: 50, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleLinear()
    .domain([2023, 2025])
    .range([0, width]);
  
  // Y scale
  const y = d3.scaleLinear()
    .domain([0, 70])
    .range([height, 0]);
  
  // Line generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.adoption))
    .curve(d3.curveMonotoneX);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(3).tickFormat(d => d.toString()))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y).ticks(7))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('Developer Adoption (%)')
    .style('fill', 'var(--text-primary)');
  
  // Add lines
  svg.selectAll('.line')
    .data(data)
    .join('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', d => d.color)
    .style('stroke-width', 3)
    .style('fill', 'none');
  
  // Add points
  data.forEach(tool => {
    svg.selectAll(`.points-${tool.name.replace(/\s+/g, '-')}`)
      .data(tool.values)
      .join('circle')
      .attr('cx', d => x(d.year))
      .attr('cy', d => y(d.adoption))
      .attr('r', 5)
      .style('fill', tool.color)
      .style('stroke', 'var(--bg-primary)')
      .style('stroke-width', 2);
  });
  
  // Add labels for the last year
  data.forEach(tool => {
    const lastPoint = tool.values[tool.values.length - 1];
    svg.append('text')
      .attr('x', x(lastPoint.year) + 10)
      .attr('y', y(lastPoint.adoption))
      .attr('dy', '0.35em')
      .style('fill', 'var(--text-primary)')
      .style('font-size', '12px')
      .text(tool.name);
  });
  
  // Create legend
  const legend = document.querySelector('#dev-tool-adoption-chart .chart-legend');
  legend.innerHTML = '';
  
  data.forEach(tool => {
    const item = document.createElement('div');
    item.className = 'chart-legend-item';
    
    const colorBox = document.createElement('span');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = tool.color;
    
    const text = document.createElement('span');
    text.textContent = tool.name;
    
    item.appendChild(colorBox);
    item.appendChild(text);
    legend.appendChild(item);
  });
}

/**
 * Create Enterprise Concerns in AI Development Tool Adoption Chart
 */
function enterpriseAdoptionChart() {
  // First, check if the container exists and log the result
  const container = document.querySelector('#enterprise-adoption-chart .chart-container');
  console.log('Enterprise adoption chart container:', container);
  
  if (!container) {
    console.error('Enterprise adoption chart container not found. Make sure #enterprise-adoption-chart .chart-container exists in your HTML.');
    return;
  }
  
  try {
    // Data
    const data = [
      { category: 'Security & Compliance', value: 78 },
      { category: 'Intellectual Property', value: 72 },
      { category: 'Code Quality', value: 65 },
      { category: 'Integration with Existing Tools', value: 58 },
      { category: 'Training & Skills Gap', value: 52 },
      { category: 'Developer Productivity', value: 45 }
    ];
    
    // Sort data by value in descending order
    data.sort((a, b) => b.value - a.value);
    
    // Log the container dimensions
    console.log('Container dimensions:', { 
      width: container.clientWidth, 
      height: container.clientHeight 
    });
    
    // Dimensions - use minimum values if container is too small
    const minWidth = 400;
    const minHeight = 300;
    const margin = {top: 20, right: 20, bottom: 70, left: 220};
    const width = Math.max(minWidth, container.clientWidth) - margin.left - margin.right;
    const height = Math.max(minHeight, container.clientHeight) - margin.top - margin.bottom;
    
    // Create SVG with specific dimensions
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, height])
      .padding(0.3);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`))
      .style('color', 'var(--text-secondary, #666)');
    
    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Percentage of Enterprises Citing as Major Concern')
      .style('fill', 'var(--text-primary, #333)')
      .style('font-size', '12px');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('color', 'var(--text-secondary, #666)');
    
    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.category))
      .attr('width', d => x(d.value))
      .attr('height', y.bandwidth())
      .attr('fill', '#4285f4')
      .attr('opacity', 0.8);
    
    // Add value labels
    svg.selectAll('.value-label')
      .data(data)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => y(d.category) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('fill', 'var(--text-primary, #333)')
      .text(d => `${d.value}%`);
    
    // Create legend
    const legend = document.querySelector('#enterprise-adoption-chart .chart-legend');
    if (legend) {
      legend.innerHTML = '';
      
      const explanationText = document.createElement('div');
      explanationText.className = 'chart-explanation';
      explanationText.innerHTML = 'Percentage of enterprises citing each factor as a major concern when adopting AI development tools';
      explanationText.style.fontSize = '0.9rem';
      explanationText.style.fontStyle = 'italic';
      explanationText.style.marginBottom = '8px';
      legend.appendChild(explanationText);
      
      const sourceText = document.createElement('div');
      sourceText.className = 'chart-source';
      sourceText.innerHTML = 'Based on survey data from enterprise CTOs and development leaders, 2025';
      sourceText.style.fontSize = '0.8rem';
      legend.appendChild(sourceText);
    } else {
      console.warn('Enterprise adoption chart legend container not found.');
    }
    
    console.log('Enterprise adoption chart successfully created');
  } catch (error) {
    console.error('Error creating enterprise adoption chart:', error);
  }
}

/**
 * Create Three-Tier AI Stack Chart
 */
function threeTierAIStackChart() {
  const container = document.querySelector('#three-tier-chart .chart-container');
  if (!container) {
    console.error('Three-tier AI stack chart container not found');
    return;
  }
  
  // Data
  const data = [
    { tier: "Infrastructure Layer", customersUsing: 12000, growthRate: 68 },
    { tier: "Model Customization Layer", customersUsing: 8500, growthRate: 145 },
    { tier: "Application Layer", customersUsing: 27000, growthRate: 120 }
  ];
  
  // Dimensions
  const margin = {top: 30, right: 60, bottom: 70, left: 80};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleBand()
    .domain(data.map(d => d.tier))
    .range([0, width])
    .padding(0.3);
  
  // Y scales for primary and secondary axis
  const yCustomers = d3.scaleLinear()
    .domain([0, 30000])
    .range([height, 0]);
  
  const yGrowth = d3.scaleLinear()
    .domain([0, 150])
    .range([height, 0]);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-25)')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .style('color', 'var(--text-secondary)');
  
  // Add primary Y axis
  svg.append('g')
    .call(d3.axisLeft(yCustomers).ticks(5).tickFormat(d => `${d/1000}k`))
    .style('color', 'var(--text-secondary)');
  
  // Add secondary Y axis
  svg.append('g')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(yGrowth).ticks(5).tickFormat(d => `${d}%`))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis label - primary
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('Customers Using')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px');
  
  // Add Y axis label - secondary
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', width + margin.right - 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('YoY Growth Rate (%)')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px');
  
  // Add bars for customers
  svg.selectAll('.bar-customers')
    .data(data)
    .join('rect')
    .attr('class', 'bar-customers')
    .attr('x', d => x(d.tier))
    .attr('y', d => yCustomers(d.customersUsing))
    .attr('width', x.bandwidth() / 2 - 5)
    .attr('height', d => height - yCustomers(d.customersUsing))
    .attr('fill', '#ff9900')
    .attr('rx', 4)
    .attr('ry', 4);
  
  // Add bars for growth rate
  svg.selectAll('.bar-growth')
    .data(data)
    .join('rect')
    .attr('class', 'bar-growth')
    .attr('x', d => x(d.tier) + x.bandwidth() / 2 + 5)
    .attr('y', d => yGrowth(d.growthRate))
    .attr('width', x.bandwidth() / 2 - 5)
    .attr('height', d => height - yGrowth(d.growthRate))
    .attr('fill', '#232f3e')
    .attr('rx', 4)
    .attr('ry', 4);
  
  // Add value labels for customers
  svg.selectAll('.label-customers')
    .data(data)
    .join('text')
    .attr('class', 'label-customers')
    .attr('x', d => x(d.tier) + (x.bandwidth() / 4))
    .attr('y', d => yCustomers(d.customersUsing) - 5)
    .attr('text-anchor', 'middle')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px')
    .text(d => `${(d.customersUsing/1000).toFixed(1)}k`);
  
  // Add value labels for growth
  svg.selectAll('.label-growth')
    .data(data)
    .join('text')
    .attr('class', 'label-growth')
    .attr('x', d => x(d.tier) + (x.bandwidth() * 3/4))
    .attr('y', d => yGrowth(d.growthRate) - 5)
    .attr('text-anchor', 'middle')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px')
    .text(d => `${d.growthRate}%`);
  
  // Create legend
  const legend = document.querySelector('#three-tier-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    // Customer adoption legend item
    const customersItem = document.createElement('div');
    customersItem.className = 'chart-legend-item';
    
    const customersColor = document.createElement('span');
    customersColor.className = 'legend-color';
    customersColor.style.backgroundColor = '#ff9900';
    
    const customersText = document.createElement('span');
    customersText.textContent = 'Adoption';
    
    customersItem.appendChild(customersColor);
    customersItem.appendChild(customersText);
    legend.appendChild(customersItem);
    
    // Growth rate legend item
    const growthItem = document.createElement('div');
    growthItem.className = 'chart-legend-item';
    
    const growthColor = document.createElement('span');
    growthColor.className = 'legend-color';
    growthColor.style.backgroundColor = '#232f3e';
    
    const growthText = document.createElement('span');
    growthText.textContent = 'YoY Growth';
    
    growthItem.appendChild(growthColor);
    growthItem.appendChild(growthText);
    legend.appendChild(growthItem);
  }
  
  console.log('Three-tier AI stack chart rendered successfully');
}

/**
 * Create Amazon AI Investment Breakdown Chart
 */
function amazonAIInvestmentChart() {
  const container = document.querySelector('#ai-investment-chart .chart-container');
  if (!container) {
    console.error('Amazon AI investment chart container not found');
    return;
  }
  
  // Data
  const data = [
    { category: "Infrastructure (GPUs, Data Centers)", percentage: 45 },
    { category: "Foundation Model Development", percentage: 20 },
    { category: "AI Application Development", percentage: 15 },
    { category: "Talent Acquisition & Research", percentage: 12 },
    { category: "Strategic Acquisitions & Partnerships", percentage: 8 }
  ];
  
  // Color scheme (Amazon colors)
  const colors = ['#ff9900', '#232f3e', '#37475a', '#007eb9', '#4d8ac0'];
  
  // Dimensions
  const margin = {top: 20, right: 30, bottom: 20, left: 30};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);
  
  // Pie and arc generators
  const pie = d3.pie()
    .value(d => d.percentage)
    .sort(null);
  
  const arc = d3.arc()
    .innerRadius(radius * 0.4)
    .outerRadius(radius * 0.8);
  
  const labelArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
  
  // Create pie chart segments
  const segments = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc');
  
  segments.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .attr('stroke', 'var(--bg-primary)')
    .attr('stroke-width', 2);
  
  // Add percentage labels inside arcs
  segments.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .attr('fill', '#fff')
    .attr('font-weight', 'bold')
    .text(d => `${d.data.percentage}%`);
  
  // Create legend
  const legend = document.querySelector('#ai-investment-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    data.forEach((d, i) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'chart-legend-item';
      
      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = colors[i];
      
      const text = document.createElement('span');
      text.textContent = `${d.category}: ${d.percentage}%`;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(text);
      legend.appendChild(legendItem);
    });
  }
  
  console.log('Amazon AI investment chart rendered successfully');
}

/**
 * Create Amazon Q Developer Adoption Chart
 */
function amazonQDeveloperChart() {
  const container = document.querySelector('#amazon-q-chart .chart-container');
  if (!container) {
    console.error('Amazon Q Developer chart container not found');
    return;
  }
  
  // Data
  const data = [
    { quarter: "Q1 2024", users: 0.8 },
    { quarter: "Q2 2024", users: 1.6 },
    { quarter: "Q3 2024", users: 2.5 },
    { quarter: "Q4 2024", users: 3.7 },
    { quarter: "Q1 2025", users: 5.1 }
  ];
  
  // Dimensions
  const margin = {top: 30, right: 30, bottom: 50, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleBand()
    .domain(data.map(d => d.quarter))
    .range([0, width])
    .padding(0.4);
  
  // Y scale
  const y = d3.scaleLinear()
    .domain([0, 6])
    .range([height, 0]);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => `${d}M`))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('Active Users (millions)')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px');
  
  // Add the 1M user milestone reference line
  svg.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(1))
    .attr('y2', y(1))
    .attr('stroke', '#232f3e')
    .attr('stroke-dasharray', '5,5')
    .attr('stroke-width', 1);
  
  svg.append('text')
    .attr('x', 10)
    .attr('y', y(1) - 5)
    .attr('fill', '#232f3e')
    .style('font-size', '12px')
    .text('1M Developer Milestone');
  
  // Add bars
  svg.selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.quarter))
    .attr('y', d => y(d.users))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.users))
    .attr('fill', '#ff9900')
    .attr('rx', 4)
    .attr('ry', 4);
  
  // Add value labels
  svg.selectAll('.label')
    .data(data)
    .join('text')
    .attr('class', 'label')
    .attr('x', d => x(d.quarter) + x.bandwidth() / 2)
    .attr('y', d => y(d.users) - 5)
    .attr('text-anchor', 'middle')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px')
    .text(d => `${d.users}M`);
  
  // Add trend line
  const line = d3.line()
    .x(d => x(d.quarter) + x.bandwidth() / 2)
    .y(d => y(d.users))
    .curve(d3.curveMonotoneX);
  
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#232f3e')
    .attr('stroke-width', 2)
    .attr('d', line);
  
  // Add circle points on the line
  svg.selectAll('.point')
    .data(data)
    .join('circle')
    .attr('class', 'point')
    .attr('cx', d => x(d.quarter) + x.bandwidth() / 2)
    .attr('cy', d => y(d.users))
    .attr('r', 5)
    .attr('fill', '#ff9900')
    .attr('stroke', '#232f3e')
    .attr('stroke-width', 2);
  
  // Create legend
  const legend = document.querySelector('#amazon-q-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    const growthText = document.createElement('div');
    growthText.className = 'chart-explanation';
    growthText.innerHTML = 'Amazon Q has seen a 537% increase in adoption over the past year';
    growthText.style.fontSize = '0.9rem';
    growthText.style.fontStyle = 'italic';
    growthText.style.marginBottom = '8px';
    legend.appendChild(growthText);
  }
  
  console.log('Amazon Q Developer chart rendered successfully');
}

/**
 * Create Three-Tier AI Stack Chart
 */
function threeTierAIStackChart() {
  const container = document.querySelector('#three-tier-chart .chart-container');
  if (!container) {
    console.error('Three-tier AI stack chart container not found');
    return;
  }
  
  // Data
  const data = [
    { tier: "Infrastructure Layer", customersUsing: 12000, growthRate: 68 },
    { tier: "Model Customization Layer", customersUsing: 8500, growthRate: 145 },
    { tier: "Application Layer", customersUsing: 27000, growthRate: 120 }
  ];
  
  // Dimensions
  const margin = {top: 30, right: 60, bottom: 70, left: 80};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // X scale
  const x = d3.scaleBand()
    .domain(data.map(d => d.tier))
    .range([0, width])
    .padding(0.3);
  
  // Y scales for primary and secondary axis
  const yCustomers = d3.scaleLinear()
    .domain([0, 30000])
    .range([height, 0]);
  
  const yGrowth = d3.scaleLinear()
    .domain([0, 150])
    .range([height, 0]);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-25)')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .style('color', 'var(--text-secondary)');
  
  // Add primary Y axis
  svg.append('g')
    .call(d3.axisLeft(yCustomers).ticks(5).tickFormat(d => `${d/1000}k`))
    .style('color', 'var(--text-secondary)');
  
  // Add secondary Y axis
  svg.append('g')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(yGrowth).ticks(5).tickFormat(d => `${d}%`))
    .style('color', 'var(--text-secondary)');
  
  // Add Y axis label - primary
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('Customers Using')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px');
  
  // Add Y axis label - secondary
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', width + margin.right - 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('YoY Growth Rate (%)')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px');
  
  // Add bars for customers
  svg.selectAll('.bar-customers')
    .data(data)
    .join('rect')
    .attr('class', 'bar-customers')
    .attr('x', d => x(d.tier))
    .attr('y', d => yCustomers(d.customersUsing))
    .attr('width', x.bandwidth() / 2 - 5)
    .attr('height', d => height - yCustomers(d.customersUsing))
    .attr('fill', '#ff9900')
    .attr('rx', 4)
    .attr('ry', 4);
  
  // Add bars for growth rate
  svg.selectAll('.bar-growth')
    .data(data)
    .join('rect')
    .attr('class', 'bar-growth')
    .attr('x', d => x(d.tier) + x.bandwidth() / 2 + 5)
    .attr('y', d => yGrowth(d.growthRate))
    .attr('width', x.bandwidth() / 2 - 5)
    .attr('height', d => height - yGrowth(d.growthRate))
    .attr('fill', '#232f3e')
    .attr('rx', 4)
    .attr('ry', 4);
  
  // Add value labels for customers
  svg.selectAll('.label-customers')
    .data(data)
    .join('text')
    .attr('class', 'label-customers')
    .attr('x', d => x(d.tier) + (x.bandwidth() / 4))
    .attr('y', d => yCustomers(d.customersUsing) - 5)
    .attr('text-anchor', 'middle')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px')
    .text(d => `${(d.customersUsing/1000).toFixed(1)}k`);
  
  // Add value labels for growth
  svg.selectAll('.label-growth')
    .data(data)
    .join('text')
    .attr('class', 'label-growth')
    .attr('x', d => x(d.tier) + (x.bandwidth() * 3/4))
    .attr('y', d => yGrowth(d.growthRate) - 5)
    .attr('text-anchor', 'middle')
    .style('fill', 'var(--text-primary)')
    .style('font-size', '12px')
    .text(d => `${d.growthRate}%`);
  
  // Create legend
  const legend = document.querySelector('#three-tier-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    // Customer adoption legend item
    const customersItem = document.createElement('div');
    customersItem.className = 'chart-legend-item';
    
    const customersColor = document.createElement('span');
    customersColor.className = 'legend-color';
    customersColor.style.backgroundColor = '#ff9900';
    
    const customersText = document.createElement('span');
    customersText.textContent = 'Adoption';
    
    customersItem.appendChild(customersColor);
    customersItem.appendChild(customersText);
    legend.appendChild(customersItem);
    
    // Growth rate legend item
    const growthItem = document.createElement('div');
    growthItem.className = 'chart-legend-item';
    
    const growthColor = document.createElement('span');
    growthColor.className = 'legend-color';
    growthColor.style.backgroundColor = '#232f3e';
    
    const growthText = document.createElement('span');
    growthText.textContent = 'YoY Growth';
    
    growthItem.appendChild(growthColor);
    growthItem.appendChild(growthText);
    legend.appendChild(growthItem);
  }
  
  console.log('Three-tier AI stack chart rendered successfully');
}

/**
 * Create Amazon AI Investment Breakdown Chart
 */
function amazonAIInvestmentChart() {
  const container = document.querySelector('#ai-investment-chart .chart-container');
  if (!container) {
    console.error('Amazon AI investment chart container not found');
    return;
  }
  
  // Data
  const data = [
    { category: "Infrastructure (GPUs, Data Centers)", percentage: 45 },
    { category: "Foundation Model Development", percentage: 20 },
    { category: "AI Application Development", percentage: 15 },
    { category: "Talent Acquisition & Research", percentage: 12 },
    { category: "Strategic Acquisitions & Partnerships", percentage: 8 }
  ];
  
  // Color scheme (Amazon colors)
  const colors = ['#ff9900', '#232f3e', '#37475a', '#007eb9', '#4d8ac0'];
  
  // Dimensions
  const margin = {top: 20, right: 30, bottom: 20, left: 30};
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);
  
  // Pie and arc generators
  const pie = d3.pie()
    .value(d => d.percentage)
    .sort(null);
  
  const arc = d3.arc()
    .innerRadius(radius * 0.4)
    .outerRadius(radius * 0.8);
  
  const labelArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
  
  // Create pie chart segments
  const segments = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc');
  
  segments.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .attr('stroke', 'var(--bg-primary)')
    .attr('stroke-width', 2);
  
  // Add percentage labels inside arcs
  segments.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .attr('fill', '#fff')
    .attr('font-weight', 'bold')
    .text(d => `${d.data.percentage}%`);
  
  // Create legend
  const legend = document.querySelector('#ai-investment-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    data.forEach((d, i) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'chart-legend-item';
      
      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = colors[i];
      
      const text = document.createElement('span');
      text.textContent = `${d.category}: ${d.percentage}%`;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(text);
      legend.appendChild(legendItem);
    });
  }
  
  console.log('Amazon AI investment chart rendered successfully');
}

/**
 * Create AI Accelerator Performance Comparison Chart
 */
function aiAcceleratorComparisonChart() {
  const container = document.querySelector('#ai-accelerator-chart .chart-container');
  if (!container) {
    console.error('AI accelerator chart container not found');
    return;
  }
  
  // Training chips data
  const trainingData = [
    { chip: "NVIDIA H100", performanceScore: 100, price: 100, pricePerformance: 1.00, category: "Training" },
    { chip: "NVIDIA H200", performanceScore: 130, price: 140, pricePerformance: 0.93, category: "Training" },
    { chip: "AWS Trainium2", performanceScore: 75, price: 60, pricePerformance: 1.25, category: "Training" },
    { chip: "AWS Trainium3", performanceScore: 110, price: 75, pricePerformance: 1.47, category: "Training" },
    { chip: "AMD MI300X", performanceScore: 80, price: 70, pricePerformance: 1.14, category: "Training" }
  ];
  
  // Inference chips data
  const inferenceData = [
    { chip: "NVIDIA A100", performanceScore: 100, price: 100, pricePerformance: 1.00, category: "Inference" },
    { chip: "NVIDIA L4", performanceScore: 45, price: 30, pricePerformance: 1.50, category: "Inference" },
    { chip: "AWS Inferentia2", performanceScore: 65, price: 40, pricePerformance: 1.63, category: "Inference" },
    { chip: "AWS Inferentia3", performanceScore: 90, price: 55, pricePerformance: 1.64, category: "Inference" },
    { chip: "AMD MI300", performanceScore: 75, price: 60, pricePerformance: 1.25, category: "Inference" }
  ];
  
  // Color mapping function
  const getChipColor = (chipName) => {
    if (chipName.includes("NVIDIA")) return "#76b900";
    if (chipName.includes("AWS")) return "#ff9900";
    if (chipName.includes("AMD")) return "#ed1c24";
    if (chipName.includes("Google")) return "#4285F4";
    return "#888888";
  };
  
  // Dimensions
  const margin = {top: 40, right: 20, bottom: 100, left: 60};
  const chartHeight = 180; // Height for each chart
  const chartSpacing = 40; // Space between charts
  const totalHeight = (chartHeight * 2) + chartSpacing + margin.top + margin.bottom;
  const width = container.clientWidth - margin.left - margin.right;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', totalHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Function to create each bar chart
  function createBarChart(data, title, yPosition) {
    // Group for this chart
    const chartGroup = svg.append('g')
      .attr('transform', `translate(0, ${yPosition})`);
    
    // Add title for this chart
    chartGroup.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('fill', 'var(--text-primary)')
      .text(title);
    
    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.chip))
      .range([0, width])
      .padding(0.2);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 150])
      .range([chartHeight, 0]);
    
    // Add X axis
    chartGroup.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .style('color', 'var(--text-secondary)');
    
    // Add Y axis
    chartGroup.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .style('color', 'var(--text-secondary)');
    
    // Add reference line at 100%
    chartGroup.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(100))
      .attr('y2', y(100))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);
    
    // Add performance bars
    chartGroup.selectAll('.bar-performance')
      .data(data)
      .join('rect')
      .attr('class', 'bar-performance')
      .attr('x', d => x(d.chip))
      .attr('y', d => y(d.performanceScore))
      .attr('width', x.bandwidth() / 2 - 2)
      .attr('height', d => chartHeight - y(d.performanceScore))
      .attr('fill', d => getChipColor(d.chip))
      .attr('rx', 3)
      .attr('ry', 3);
    
    // Add price bars
    chartGroup.selectAll('.bar-price')
      .data(data)
      .join('rect')
      .attr('class', 'bar-price')
      .attr('x', d => x(d.chip) + x.bandwidth() / 2 + 2)
      .attr('y', d => y(d.price))
      .attr('width', x.bandwidth() / 2 - 2)
      .attr('height', d => chartHeight - y(d.price))
      .attr('fill', d => getChipColor(d.chip))
      .attr('fill-opacity', 0.5)
      .attr('rx', 3)
      .attr('ry', 3);
    
    // Add performance labels
    chartGroup.selectAll('.label-performance')
      .data(data)
      .join('text')
      .attr('class', 'label-performance')
      .attr('x', d => x(d.chip) + x.bandwidth() / 4)
      .attr('y', d => y(d.performanceScore) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-primary)')
      .style('font-size', '10px')
      .text(d => `${d.performanceScore}%`);
    
    // Add price labels
    chartGroup.selectAll('.label-price')
      .data(data)
      .join('text')
      .attr('class', 'label-price')
      .attr('x', d => x(d.chip) + x.bandwidth() * 3/4)
      .attr('y', d => y(d.price) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-primary)')
      .style('font-size', '10px')
      .text(d => `${d.price}%`);
    
    // Legend for this chart
    const legendItems = [
      { name: "Performance", opacity: 1 },
      { name: "Price", opacity: 0.5 }
    ];
    
    chartGroup.selectAll('.chart-legend')
      .data(legendItems)
      .join('g')
      .attr('class', 'chart-legend')
      .attr('transform', (d, i) => `translate(${width - 180 + (i * 90)}, -20)`)
      .each(function(d, i) {
        const g = d3.select(this);
        
        g.append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', "#666")
          .attr('fill-opacity', d.opacity);
        
        g.append('text')
          .attr('x', 16)
          .attr('y', 10)
          .text(d.name)
          .style('font-size', '10px')
          .style('fill', 'var(--text-primary)');
      });
  }
  
  // Create the training accelerators chart
  createBarChart(trainingData, "Training Accelerators", 0);
  
  // Create the inference accelerators chart
  createBarChart(inferenceData, "Inference Accelerators", chartHeight + chartSpacing);
  
  // Create legend
  const legend = document.querySelector('#ai-accelerator-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    // Create a legend entry for each chip manufacturer
    const manufacturers = [
      { name: "NVIDIA", color: "#76b900" },
      { name: "AWS", color: "#ff9900" },
      { name: "AMD", color: "#ed1c24" }
    ];
    
    manufacturers.forEach(manufacturer => {
      const item = document.createElement('div');
      item.className = 'chart-legend-item';
      
      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.backgroundColor = manufacturer.color;
      
      const text = document.createElement('span');
      text.textContent = manufacturer.name;
      
      item.appendChild(colorBox);
      item.appendChild(text);
      legend.appendChild(item);
    });
    
    // Add explanation text
    const explanationText = document.createElement('div');
    explanationText.className = 'chart-explanation';
    explanationText.innerHTML = 'Performance and price normalized to NVIDIA flagship chips (H100/A100 = 100%)';
    explanationText.style.fontSize = '0.8rem';
    explanationText.style.fontStyle = 'italic';
    explanationText.style.marginTop = '8px';
    legend.appendChild(explanationText);
  }
  
  console.log('AI accelerator performance chart rendered successfully');
}

/**
 * Create AI Training Cost Comparison Chart
 */
function aiTrainingCostChart() {
  const container = document.querySelector('#ai-training-cost-chart .chart-container');
  if (!container) {
    console.error('AI training cost chart container not found');
    return;
  }
  
  // Token cost data for different model sizes
  const tokenCostData = [
    { 
      modelSize: "7B Parameters", 
      "NVIDIA H100": 0.30,
      "AWS Trainium2": 0.18,
      "AMD MI300X": 0.22 
    },
    { 
      modelSize: "13B Parameters", 
      "NVIDIA H100": 0.55,
      "AWS Trainium2": 0.35,
      "AMD MI300X": 0.44 
    },
    { 
      modelSize: "70B Parameters", 
      "NVIDIA H100": 2.75,
      "AWS Trainium2": 1.65,
      "AMD MI300X": 1.95 
    }
  ];
  
  // Power efficiency data
  const efficiencyData = [
    { 
      chip: "NVIDIA H100", 
      efficiencyScore: 1.0,
      color: "#76b900" 
    },
    { 
      chip: "NVIDIA H200", 
      efficiencyScore: 1.15,
      color: "#76b900" 
    },
    { 
      chip: "AWS Trainium2", 
      efficiencyScore: 1.75,
      color: "#ff9900" 
    },
    { 
      chip: "AWS Trainium3", 
      efficiencyScore: 2.2,
      color: "#ff9900" 
    },
    { 
      chip: "AMD MI300X", 
      efficiencyScore: 1.25,
      color: "#ed1c24" 
    },
    { 
      chip: "Google TPU v4", 
      efficiencyScore: 1.4,
      color: "#4285F4" 
    }
  ];
  
  // Dimensions
  const margin = {top: 40, right: 20, bottom: 50, left: 60};
  const width = container.clientWidth - margin.left - margin.right;
  
  // Determine height based on container height and allocate for two charts
  const containerHeight = container.clientHeight;
  const chartHeight = Math.min(250, (containerHeight - 130) / 2);
  const totalHeight = chartHeight * 2 + 130;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', totalHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Create the token cost chart
  createTokenCostChart(svg, tokenCostData, width, chartHeight);
  
  // Create the efficiency chart
  createEfficiencyChart(svg, efficiencyData, width, chartHeight, chartHeight + 80);
  
  // Add metrics grid
  createMetricsGrid(container, totalHeight - 60);
  
  // Function to create token cost chart
  function createTokenCostChart(svg, data, width, height) {
    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('fill', 'var(--text)')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('fill', 'var(--text-primary)')
      .text('Training Cost per Million Tokens (USD)');
    
    // Prepare data for grouped bar chart
    const chipNames = Object.keys(data[0]).filter(key => key !== 'modelSize');
    const modelSizes = data.map(d => d.modelSize);
    
    // X scale for model sizes
    const x0 = d3.scaleBand()
      .domain(modelSizes)
      .range([0, width])
      .padding(0.2);
    
    // X scale for individual chips within each model size
    const x1 = d3.scaleBand()
      .domain(chipNames)
      .range([0, x0.bandwidth()])
      .padding(0.05);
    
    // Y scale
    const maxCost = d3.max(data, d => d3.max(chipNames, key => d[key]));
    const y = d3.scaleLinear()
      .domain([0, maxCost * 1.1]) // Add 10% padding
      .range([height, 0]);
    
    // Color scale
    const color = d3.scaleOrdinal()
      .domain(chipNames)
      .range(["#76b900", "#ff9900", "#ed1c24"]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .style('color', 'var(--text-secondary)');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d.toFixed(2)}`))
      .style('color', 'var(--text-secondary)');
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Cost per Million Tokens (USD)')
      .style('fill', 'var(--text-primary)')
      .style('font-size', '12px');
    
    // Create groups for each model size
    const modelGroup = svg.selectAll('.model-group')
      .data(data)
      .join('g')
      .attr('class', 'model-group')
      .attr('transform', d => `translate(${x0(d.modelSize)},0)`);
    
    // Add bars for each chip within model groups
    modelGroup.selectAll('.bar')
      .data(d => chipNames.map(key => ({key, value: d[key]})))
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => color(d.key))
      .attr('rx', 3)
      .attr('ry', 3);
    
    // Add value labels
    modelGroup.selectAll('.label')
      .data(d => chipNames.map(key => ({key, value: d[key]})))
      .join('text')
      .attr('class', 'label')
      .attr('x', d => x1(d.key) + x1.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-primary)')
      .style('font-size', '10px')
      .text(d => `$${d.value.toFixed(2)}`);
    
    // Add legend
    const legend = svg.selectAll('.token-cost-legend')
      .data(chipNames)
      .join('g')
      .attr('class', 'token-cost-legend')
      .attr('transform', (d, i) => `translate(${width - 230 + (i * 80)}, ${height + 30})`);
    
    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => color(d));
    
    legend.append('text')
      .attr('x', 16)
      .attr('y', 10)
      .text(d => d.replace('NVIDIA ', '').replace('AWS ', ''))
      .style('font-size', '10px')
      .style('fill', 'var(--text-primary)');
  }
  
  // Function to create efficiency chart
  function createEfficiencyChart(svg, data, width, height, yPosition) {
    // Chart group
    const group = svg.append('g')
      .attr('transform', `translate(0, ${yPosition})`);
    
    // Add chart title
    group.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('fill', 'var(--text-primary)')
      .text('Performance-per-Watt Efficiency');
    
    // X scale (horizontal bars)
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.efficiencyScore) * 1.1])
      .range([0, width]);
    
    // Y scale (chip names)
    const y = d3.scaleBand()
      .domain(data.map(d => d.chip))
      .range([0, height])
      .padding(0.2);
    
    // Add X axis
    group.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d.toFixed(1)}x`))
      .style('color', 'var(--text-secondary)');
    
    // Add Y axis
    group.append('g')
      .call(d3.axisLeft(y))
      .style('color', 'var(--text-secondary)');
    
    // Add reference line at 1.0
    group.append('line')
      .attr('x1', x(1))
      .attr('x2', x(1))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);
    
    // Add efficiency bars
    group.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.chip))
      .attr('width', d => x(d.efficiencyScore))
      .attr('height', y.bandwidth())
      .attr('fill', d => d.color)
      .attr('rx', 3)
      .attr('ry', 3);
    
    // Add value labels
    group.selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => x(d.efficiencyScore) + 5)
      .attr('y', d => y(d.chip) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('fill', 'var(--text-primary)')
      .style('font-size', '10px')
      .text(d => `${d.efficiencyScore.toFixed(1)}x`);
    
    // Add explanation
    group.append('text')
      .attr('x', 5)
      .attr('y', height + 25)
      .style('fill', 'var(--text-secondary)')
      .style('font-size', '10px')
      .style('font-style', 'italic')
      .text('Higher is better (normalized to NVIDIA H100 = 1.0)');
  }
  
  // Function to create metrics grid
  function createMetricsGrid(container, yPosition) {
    const metricsContainer = d3.select(container)
      .append('div')
      .style('display', 'grid')
      .style('grid-template-columns', 'repeat(3, 1fr)')
      .style('gap', '10px')
      .style('margin-top', `${yPosition}px`)
      .style('margin-left', `${margin.left}px`)
      .style('margin-right', `${margin.right}px`);
    
    const metrics = [
      { title: "Cost Savings", value: "30-40%", description: "Average savings with AWS custom silicon vs. NVIDIA" },
      { title: "Power Efficiency", value: "75%", description: "Better performance-per-watt than industry standard" },
      { title: "Availability", value: "99.9%", description: "Availability of Trainium2/Inferentia instances on AWS" }
    ];
    
    metrics.forEach(metric => {
      const card = metricsContainer.append('div')
        .style('background-color', 'var(--bg-primary, white)')
        .style('border', '1px solid var(--border-color, #ddd)')
        .style('border-radius', '8px')
        .style('padding', '10px');
      
      card.append('div')
        .style('font-size', '0.9rem')
        .style('font-weight', 'bold')
        .style('color', 'var(--text-secondary, #666)')
        .text(metric.title);
      
      card.append('div')
        .style('font-size', '1.5rem')
        .style('font-weight', 'bold')
        .style('color', '#ff9900')
        .style('margin', '5px 0')
        .text(metric.value);
      
      card.append('div')
        .style('font-size', '0.8rem')
        .style('color', 'var(--text-secondary, #666)')
        .text(metric.description);
    });
  }
  
  // Create legend for the main chart
  const legend = document.querySelector('#ai-training-cost-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    const sourceText = document.createElement('div');
    sourceText.className = 'chart-source';
    sourceText.innerHTML = 'Source: AWS Performance Benchmarks, Industry Testing, Energy Efficiency Reports (2025)';
    sourceText.style.fontSize = '0.8rem';
    sourceText.style.fontStyle = 'italic';
    legend.appendChild(sourceText);
  }
  
  console.log('AI training cost chart rendered successfully');
}

