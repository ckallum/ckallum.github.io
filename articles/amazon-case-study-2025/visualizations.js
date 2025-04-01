/**
 * Global AI Landscape 2025-2030: Data Visualizations
 * 
 * This file contains D3.js visualizations for the AI trends article.
 * Created using D3.js v7
 * Modified to include lazy loading for better performance
 */

// Store visualization functions in a mapping by their container IDs
const visualizationFunctions = {
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

/**
 * Create Alexa+ Performance Metrics Chart
 */
function alexaPlusMetricsChart() {
  const container = document.querySelector('#alexa-plus-chart .chart-container');
  if (!container) {
    console.error('Alexa+ metrics chart container not found');
    return;
  }
  
  // Metrics data
  const metricsData = [
    { metric: "Active Users", value: 175, fullMark: 200, displayValue: "175M users" },
    { metric: "Daily Interactions", value: 2.8, fullMark: 3, displayValue: "2.8B interactions" },
    { metric: "YoY Growth", value: 32, fullMark: 50, displayValue: "32% growth" },
    { metric: "Satisfaction", value: 87, fullMark: 100, displayValue: "87% satisfaction" }
  ];
  
  // Dimensions for the radar chart
  const margin = {top: 50, right: 50, bottom: 50, left: 50};
  const width = Math.min(container.clientWidth, container.clientHeight) - margin.left - margin.right;
  const height = width;
  const radius = width / 2;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left + radius},${margin.top + radius})`);
  
  // Scales
  // Angle scale for metrics
  const angleScale = d3.scaleBand()
    .domain(metricsData.map(d => d.metric))
    .range([0, 2 * Math.PI]);
  
  // Radius scale for values
  const radiusScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, radius]);
  
  // Function to calculate point coordinates
  function getCoordinates(metric, value) {
    const angle = angleScale(metric) + angleScale.bandwidth() / 2;
    // Normalize the value as a percentage of fullMark
    const normalizedValue = metricsData.find(d => d.metric === metric).fullMark;
    const percentage = (value / normalizedValue) * 100;
    const r = radiusScale(percentage);
    return {
      x: r * Math.sin(angle),
      y: -r * Math.cos(angle)
    };
  }
  
  // Add circular axis lines
  const circleAxes = [25, 50, 75, 100];
  circleAxes.forEach(percentage => {
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radiusScale(percentage))
      .attr('fill', 'none')
      .attr('stroke', 'var(--border-color)')
      .attr('stroke-dasharray', percentage === 100 ? 'none' : '2,3')
      .attr('stroke-width', percentage === 100 ? 2 : 1);
    
    // Add percentage label
    if (percentage < 100) {
      svg.append('text')
        .attr('x', 5)
        .attr('y', -radiusScale(percentage) - 2)
        .attr('text-anchor', 'start')
        .attr('font-size', '9px')
        .style('fill', 'var(--text-secondary)')
        .text(`${percentage}%`);
    }
  });
  
  // Add radial axis lines and labels
  metricsData.forEach(d => {
    const angle = angleScale(d.metric) + angleScale.bandwidth() / 2;
    const lineEnd = getCoordinates(d.metric, d.fullMark);
    
    // Draw axis line
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', lineEnd.x)
      .attr('y2', lineEnd.y)
      .attr('stroke', 'var(--border-color)')
      .attr('stroke-width', 1);
    
    // Position for label, slightly beyond the outer circle
    const labelDistance = radius * 1.15;
    const labelX = labelDistance * Math.sin(angle);
    const labelY = -labelDistance * Math.cos(angle);
    
    // Add metric label
    svg.append('text')
      .attr('x', labelX)
      .attr('y', labelY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12px')
      .style('fill', 'var(--text-primary)')
      .text(d.metric);
  });
  
  // Calculate polygon points
  const polygonPoints = metricsData.map(d => {
    const coords = getCoordinates(d.metric, d.value);
    return [coords.x, coords.y];
  });
  
  // Draw the radar polygon
  svg.append('polygon')
    .attr('points', polygonPoints.flat().join(','))
    .attr('fill', '#ff9900')
    .attr('fill-opacity', 0.6)
    .attr('stroke', '#ff9900')
    .attr('stroke-width', 2);
  
  // Add data points
  metricsData.forEach(d => {
    const coords = getCoordinates(d.metric, d.value);
    
    // Add point
    svg.append('circle')
      .attr('cx', coords.x)
      .attr('cy', coords.y)
      .attr('r', 5)
      .attr('fill', '#ff9900')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);
    
    // Add value label
    const labelDistance = radiusScale((d.value / d.fullMark) * 100) * 1.1;
    const angle = angleScale(d.metric) + angleScale.bandwidth() / 2;
    const labelX = labelDistance * Math.sin(angle);
    const labelY = -labelDistance * Math.cos(angle);
    
    svg.append('text')
      .attr('x', labelX)
      .attr('y', labelY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .style('fill', 'var(--text-primary)')
      .text(d.displayValue);
  });
  
  // Create metrics cards
  const metricsContainer = d3.select(container)
    .append('div')
    .style('display', 'grid')
    .style('grid-template-columns', 'repeat(auto-fit, minmax(120px, 1fr))')
    .style('gap', '10px')
    .style('margin-top', '20px');
  
  metricsData.forEach(metric => {
    const card = metricsContainer.append('div')
      .style('background-color', 'var(--bg-primary, white)')
      .style('border', '1px solid var(--border-color, #ddd)')
      .style('border-radius', '8px')
      .style('padding', '10px')
      .style('text-align', 'center');
    
    card.append('div')
      .style('font-size', '0.9rem')
      .style('font-weight', 'bold')
      .style('color', 'var(--text-secondary, #666)')
      .text(metric.metric);
    
    // Format value based on metric
    let formattedValue;
    if (metric.metric === "Active Users") {
      formattedValue = "175M";
    } else if (metric.metric === "Daily Interactions") {
      formattedValue = "2.8B";
    } else if (metric.metric === "YoY Growth") {
      formattedValue = "32%";
    } else if (metric.metric === "Satisfaction") {
      formattedValue = "87%";
    } else {
      formattedValue = metric.value;
    }
    
    card.append('div')
      .style('font-size', '1.5rem')
      .style('font-weight', 'bold')
      .style('color', '#ff9900')
      .style('margin', '5px 0')
      .text(formattedValue);
    
    // Description text based on metric
    let description;
    if (metric.metric === "Active Users") {
      description = "Monthly active users globally";
    } else if (metric.metric === "Daily Interactions") {
      description = "Daily voice commands processed";
    } else if (metric.metric === "YoY Growth") {
      description = "Year-over-year increase in usage";
    } else if (metric.metric === "Satisfaction") {
      description = "User satisfaction rating";
    } else {
      description = "";
    }
    
    card.append('div')
      .style('font-size', '0.8rem')
      .style('color', 'var(--text-secondary, #666)')
      .text(description);
  });
  
  // Create legend
  const legend = document.querySelector('#alexa-plus-chart .chart-legend');
  if (legend) {
    legend.innerHTML = '';
    
    const sourceText = document.createElement('div');
    sourceText.className = 'chart-source';
    sourceText.innerHTML = 'Source: Amazon Consumer Technology Report (2025)';
    sourceText.style.fontSize = '0.8rem';
    sourceText.style.fontStyle = 'italic';
    legend.appendChild(sourceText);
  }
  
  console.log('Alexa+ metrics chart rendered successfully');
}