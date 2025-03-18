/**
 * Global AI Landscape 2025-2030: Data Visualizations
 * 
 * This file contains D3.js visualizations for the AI trends article.
 * Created using D3.js v7
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all visualizations
  magnificentSevenChart();
  chineseTechChart();
  datacenterMap();
  gpuComparisonChart();
  modelComparisonChart();
});

/**
 * Create the Magnificent Seven revenue growth chart
 */
function magnificentSevenChart() {
  const container = document.querySelector('#magnificent-seven-chart .chart-container');
  if (!container) return;
  
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
  
  // Data centers by region and year
  const dataCenters = {
    2025: [
      {region: 'North America', count: 420, x: 220, y: 180},
      {region: 'Europe', count: 350, x: 450, y: 150},
      {region: 'China', count: 380, x: 680, y: 200},
      {region: 'India', count: 180, x: 630, y: 240},
      {region: 'Southeast Asia', count: 200, x: 700, y: 270},
      {region: 'Australia', count: 110, x: 780, y: 350},
      {region: 'South America', count: 90, x: 300, y: 320},
      {region: 'Middle East', count: 130, x: 550, y: 210},
      {region: 'Africa', count: 70, x: 480, y: 280}
    ],
    2026: [
      {region: 'North America', count: 470, x: 220, y: 180},
      {region: 'Europe', count: 390, x: 450, y: 150},
      {region: 'China', count: 450, x: 680, y: 200},
      {region: 'India', count: 210, x: 630, y: 240},
      {region: 'Southeast Asia', count: 230, x: 700, y: 270},
      {region: 'Australia', count: 125, x: 780, y: 350},
      {region: 'South America', count: 110, x: 300, y: 320},
      {region: 'Middle East', count: 150, x: 550, y: 210},
      {region: 'Africa', count: 85, x: 480, y: 280}
    ],
    2027: [
      {region: 'North America', count: 520, x: 220, y: 180},
      {region: 'Europe', count: 430, x: 450, y: 150},
      {region: 'China', count: 530, x: 680, y: 200},
      {region: 'India', count: 250, x: 630, y: 240},
      {region: 'Southeast Asia', count: 270, x: 700, y: 270},
      {region: 'Australia', count: 140, x: 780, y: 350},
      {region: 'South America', count: 130, x: 300, y: 320},
      {region: 'Middle East', count: 170, x: 550, y: 210},
      {region: 'Africa', count: 105, x: 480, y: 280}
    ],
    2028: [
      {region: 'North America', count: 580, x: 220, y: 180},
      {region: 'Europe', count: 480, x: 450, y: 150},
      {region: 'China', count: 620, x: 680, y: 200},
      {region: 'India', count: 300, x: 630, y: 240},
      {region: 'Southeast Asia', count: 320, x: 700, y: 270},
      {region: 'Australia', count: 160, x: 780, y: 350},
      {region: 'South America', count: 160, x: 300, y: 320},
      {region: 'Middle East', count: 200, x: 550, y: 210},
      {region: 'Africa', count: 130, x: 480, y: 280}
    ],
    2029: [
      {region: 'North America', count: 650, x: 220, y: 180},
      {region: 'Europe', count: 540, x: 450, y: 150},
      {region: 'China', count: 720, x: 680, y: 200},
      {region: 'India', count: 350, x: 630, y: 240},
      {region: 'Southeast Asia', count: 380, x: 700, y: 270},
      {region: 'Australia', count: 180, x: 780, y: 350},
      {region: 'South America', count: 190, x: 300, y: 320},
      {region: 'Middle East', count: 240, x: 550, y: 210},
      {region: 'Africa', count: 160, x: 480, y: 280}
    ],
    2030: [
      {region: 'North America', count: 730, x: 220, y: 180},
      {region: 'Europe', count: 610, x: 450, y: 150},
      {region: 'China', count: 850, x: 680, y: 200},
      {region: 'India', count: 420, x: 630, y: 240},
      {region: 'Southeast Asia', count: 450, x: 700, y: 270},
      {region: 'Australia', count: 205, x: 780, y: 350},
      {region: 'South America', count: 230, x: 300, y: 320},
      {region: 'Middle East', count: 280, x: 550, y: 210},
      {region: 'Africa', count: 190, x: 480, y: 280}
    ]
  };
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add a simple world map outline
  const mapGroup = svg.append('g');
  
  // Simple continents as rectangles with rounded corners
  const continents = [
    {name: 'North America', x: 150, y: 140, width: 120, height: 100},
    {name: 'South America', x: 220, y: 250, width: 80, height: 120},
    {name: 'Europe', x: 420, y: 120, width: 80, height: 70},
    {name: 'Africa', x: 420, y: 200, width: 120, height: 140},
    {name: 'Asia', x: 520, y: 120, width: 200, height: 180},
    {name: 'Australia', x: 750, y: 320, width: 80, height: 60}
  ];
  
  // Add continents
  mapGroup.selectAll('.continent')
    .data(continents)
    .enter()
    .append('rect')
    .attr('class', 'continent')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('rx', 20)
    .attr('ry', 20)
    .attr('fill', 'var(--bg-secondary)')
    .attr('stroke', 'var(--border-color)')
    .attr('stroke-width', 1)
    .attr('opacity', 0.6);
  
  // Function to update the visualization based on year
  function updateVisualization(year) {
    // Remove existing circles
    svg.selectAll('.data-center').remove();
    
    // Add data centers as circles
    svg.selectAll('.data-center')
      .data(dataCenters[year])
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
      .data(dataCenters[year])
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
  
  // Initialize with 2025 data
  updateVisualization(2025);
  
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