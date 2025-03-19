// visualizations.js
document.addEventListener('DOMContentLoaded', function() {
    // Visualization 1: Fairness Definitions Relationships
    createFairnessVennDiagram();
    
    // Visualization 2: Fairness Costs Comparison Chart
    createFairnessCostsChart();
    
    // Visualization 3: Base Rate Distributions
    createBaseRateChart();
  });
  
  // Visualization 1: Venn Diagram of Fairness Definitions
  function createFairnessVennDiagram() {
    const container = d3.select('#fairness-definitions-viz');
    if (container.empty()) return;
    
    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Define circles for the Venn diagram
    const circles = [
      { name: 'Independence', label: 'Demographic Parity', x: width * 0.3, y: height * 0.4, r: width * 0.2, color: '#3498db' },
      { name: 'Separation', label: 'Equalized Odds', x: width * 0.5, y: height * 0.6, r: width * 0.2, color: '#e74c3c' },
      { name: 'Sufficiency', label: 'Calibration', x: width * 0.7, y: height * 0.4, r: width * 0.2, color: '#2ecc71' }
    ];
    
    // Draw circles
    svg.selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.4)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);
    
    // Add labels
    svg.selectAll('.circle-label')
      .data(circles)
      .enter()
      .append('text')
      .attr('class', 'circle-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .text(d => d.name)
      .attr('font-weight', 'bold')
      .attr('font-size', '14px');
    
    // Add sublabels
    svg.selectAll('.circle-sublabel')
      .data(circles)
      .enter()
      .append('text')
      .attr('class', 'circle-sublabel')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 20)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .text(d => d.label)
      .attr('font-size', '12px');
    
    // Draw intersection label
    svg.append('text')
      .attr('x', width * 0.5)
      .attr('y', height * 0.5)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .text('?')
      .attr('font-weight', 'bold')
      .attr('font-size', '24px');
    
    // Add annotations
    svg.append('text')
      .attr('x', width * 0.5)
      .attr('y', height * 0.85)
      .attr('text-anchor', 'middle')
      .text('The Impossibility Theorem: These definitions cannot be simultaneously satisfied')
      .attr('font-style', 'italic')
      .attr('font-size', '14px');
  }
  
  // Visualization 2: Fairness Costs Comparison Chart
  function createFairnessCostsChart() {
    const container = d3.select('#fairness-costs-viz');
    if (container.empty()) return;
    
    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
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
      .attr('transform', (d, i) => `translate(0,${i * 20})`);
    
    legend.append('rect')
      .attr('x', width - 19)
      .attr('y', 9)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', color);
    
    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '0.32em')
      .text(d => d === 'ALevels' ? 'A-Levels' : d === 'FinalScore' ? 'Final Score' : 'Value Added');
  }
  
  // Visualization 3: Base Rate Distribution
  function createBaseRateChart() {
    const container = d3.select('#base-rate-viz');
    if (container.empty()) return;
    
    const width = container.node().getBoundingClientRect().width;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
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
      .call(d3.axisLeft(y).ticks(5, '%').tickFormat(d => d * 100 + '%'));
    
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
      .attr('transform', (d, i) => `translate(0,${i * 20})`);
    
    legend.append('rect')
      .attr('x', width - 19)
      .attr('y', 9)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d, i) => subgroupColors[i]);
    
    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '0.32em')
      .text(d => d);
  }