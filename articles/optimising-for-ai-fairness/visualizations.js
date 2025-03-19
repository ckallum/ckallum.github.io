// visualizations.js
document.addEventListener('DOMContentLoaded', function() {
    // Visualization 1: Fairness Definitions Relationships
    createFairnessVennDiagram();
    
    // Visualization 2: Base Rate Distributions
    createBaseRateChart();
    
    // Visualization 3: Fairness Costs Comparison Chart
    createFairnessCostsChart();
    
    // Add resize event listeners for responsive charts
    window.addEventListener('resize', function() {
      // Debounce the resize handler to prevent excessive redraws
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(function() {
        createFairnessVennDiagram();
        createBaseRateChart();
        createFairnessCostsChart();
      }, 250);
    });
  });
  
  // Visualization 1: Fairness Definitions Relationships
  function createFairnessVennDiagram() {
    const container = d3.select('#fairness-definitions-viz');
    if (container.empty()) return;
    
    // Get actual container dimensions for responsive sizing
    const containerWidth = container.node().getBoundingClientRect().width;
    const aspectRatio = 0.67; // height = 67% of width
    const height = Math.min(containerWidth * aspectRatio, 400);
    
    // Clear any existing content
    container.html("");
    
    // Create responsive SVG that will scale with the container
    const svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', '0 0 600 400')
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Title
    svg.append('text')
      .attr('x', 300)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Relationships Between Fairness Criteria');
    
    // Draw the three main fairness definitions
    const fairnessDefs = [
      { name: 'Independence', alt: 'Demographic Parity', color: '#3498db', x: 150, y: 80 },
      { name: 'Separation', alt: 'Equalized Odds', color: '#e74c3c', x: 300, y: 180 },
      { name: 'Sufficiency', alt: 'Calibration', color: '#2ecc71', x: 450, y: 80 }
    ];
    
    // Add circles for each definition
    svg.selectAll('.fairness-circle')
      .data(fairnessDefs)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 50)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.4)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);
    
    // Add main labels
    svg.selectAll('.fairness-label')
      .data(fairnessDefs)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y - 10)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(d => d.name);
    
    // Add alternative names
    svg.selectAll('.fairness-alt')
      .data(fairnessDefs)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.alt);
    
    // Draw connecting lines with conflict markers
    const connections = [
      { source: fairnessDefs[0], target: fairnessDefs[1], conflict: true },  // Independence - Separation
      { source: fairnessDefs[1], target: fairnessDefs[2], conflict: false }, // Separation - Sufficiency
      { source: fairnessDefs[0], target: fairnessDefs[2], conflict: true }   // Independence - Sufficiency
    ];
    
    // Draw lines
    svg.selectAll('.connection')
      .data(connections)
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', d => d.conflict ? '#e74c3c' : '#27ae60')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.conflict ? '5,5' : 'none');
    
    // Add conflict markers
    svg.selectAll('.conflict-marker')
      .data(connections.filter(d => d.conflict))
      .enter()
      .append('text')
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#e74c3c')
      .text('✗');
    
    // Add legend
    const legendItems = [
      { label: 'Compatible', color: '#27ae60', dash: 'none', x: 150, y: 350 },
      { label: 'In conflict', color: '#e74c3c', dash: '5,5', x: 350, y: 350 }
    ];
    
    // Legend lines
    svg.selectAll('.legend-line')
      .data(legendItems)
      .enter()
      .append('line')
      .attr('x1', d => d.x - 40)
      .attr('y1', d => d.y)
      .attr('x2', d => d.x - 10)
      .attr('y2', d => d.y)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.dash);
    
    // Legend text
    svg.selectAll('.legend-text')
      .data(legendItems)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .text(d => d.label);
    
    // Add note about the Impossibility Theorem
    svg.append('text')
      .attr('x', 300)
      .attr('y', 380)
      .attr('text-anchor', 'middle')
      .attr('font-style', 'italic')
      .attr('font-size', '12px')
      .text('The Impossibility Theorem: These criteria cannot generally be satisfied simultaneously');
  }
  
  // Visualization 2: Base Rate Distribution
  function createBaseRateChart() {
    const container = d3.select('#base-rate-viz');
    if (container.empty()) return;
    
    // Get actual container dimensions for responsive sizing
    const containerWidth = container.node().getBoundingClientRect().width;
    const aspectRatio = 0.5; // height = 50% of width
    const height = Math.min(containerWidth * aspectRatio, 300);
    
    // Clear any existing content
    container.html("");
    
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const width = 600;
    const innerHeight = 300 - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    
    // Create responsive SVG
    const svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${300}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Data for base rates
    const data = [
      { target: 'A-Levels', groupA: 0.65, groupB: 0.3 },
      { target: 'Final Score', groupA: 0.7, groupB: 0.4 },
      { target: 'Value Added', groupA: 0.5, groupB: 0.5 }
    ];
    
    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.target))
      .range([0, innerWidth])
      .padding(0.3);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);
    
    // Grouped bar setup
    const groups = g.selectAll('.target-group')
      .data(data)
      .enter().append('g')
      .attr('class', 'target-group')
      .attr('transform', d => `translate(${x(d.target)},0)`);
    
    const subgroups = ['groupA', 'groupB'];
    const subgroupColors = ['#f39c12', '#9b59b6'];
    
    const xSub = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding(0.05);
    
    // Add bars
    groups.selectAll('rect')
      .data(d => subgroups.map(key => ({key, value: d[key]})))
      .enter().append('rect')
      .attr('x', d => xSub(d.key))
      .attr('y', d => y(d.value))
      .attr('width', xSub.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', d => d.key === 'groupA' ? subgroupColors[0] : subgroupColors[1]);
    
    // Add x axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));
    
    // Add y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d * 100 + '%'));
    
    // Add y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Positive Outcome Rate');
    
    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(['Group A', 'Group B'])
      .enter().append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20 + margin.top})`);
    
    legend.append('rect')
      .attr('x', width - 19 - margin.right)
      .attr('y', 9)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d, i) => subgroupColors[i]);
      
    legend.append('text')
      .attr('x', width - 24 - margin.right)
      .attr('y', 9)
      .attr('dy', '0.32em')
      .text(d => d);
  }
  
  // Visualization 3: Fairness Costs Comparison Chart
  function createFairnessCostsChart() {
    const container = d3.select('#fairness-costs-viz');
    if (container.empty()) return;
    
    // Get actual container dimensions for responsive sizing
    const containerWidth = container.node().getBoundingClientRect().width;
    const aspectRatio = 0.67; // height = 67% of width
    const height = Math.min(containerWidth * aspectRatio, 400);
    
    // Clear any existing content
    container.html("");
    
    // Create responsive SVG
    const svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', '0 0 600 400')
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const innerWidth = 600 - margin.left - margin.right;
    const innerHeight = 400 - margin.top - margin.bottom;
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Data for fairness costs across different goals
    const data = [
      { constraint: "Demographic Parity", ALevels: 1.2, FinalScore: 0.7, ValueAdded: 0.2 },
      { constraint: "Equalized Odds", ALevels: 0.9, FinalScore: 0.4, ValueAdded: 0.3 },
      { constraint: "Equal Opportunity", ALevels: 0.8, FinalScore: 0.35, ValueAdded: 0.25 },
      { constraint: "Calibration", ALevels: 0.7, FinalScore: 0.5, ValueAdded: 0.3 },
      { constraint: "No Constraint", ALevels: 0.8, FinalScore: 0.4, ValueAdded: 0.1 }
    ];
    
    // Convert to format suitable for stacked bar chart
    const keys = ["ALevels", "FinalScore", "ValueAdded"];
    
    // X scale
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.constraint))
      .rangeRound([0, innerWidth])
      .paddingInner(0.1);
    
    const x1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 1.3])
      .rangeRound([innerHeight, 0]);
    
    // Color scale
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#3498db', '#e74c3c', '#2ecc71']);
    
    // Add bars
    g.append('g')
      .selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', d => `translate(${x0(d.constraint)},0)`)
      .selectAll('rect')
      .data(d => keys.map(key => ({ key, value: d[key] })))
      .enter().append('rect')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', d => color(d.key));
    
    // Add x axis
    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-25)');
    
    // Add y axis
    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(null, 's'))
      .append('text')
      .attr('x', 2)
      .attr('y', y(y.domain()[1]) - 10)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text('Total Fairness Cost');
    
    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter().append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20 + margin.top})`);
    
    legend.append('rect')
      .attr('x', 600 - 19 - margin.right)
      .attr('y', 9)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', color);
    
    legend.append('text')
      .attr('x', 600 - 24 - margin.right)
      .attr('y', 9)
      .attr('dy', '0.32em')
      .text(d => d === 'ALevels' ? 'A-Levels' : d === 'FinalScore' ? 'Final Score' : 'Value Added');
  }