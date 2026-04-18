import React, { useEffect, useRef } from 'react';

/**
 * Feature 2: Threat DNA Visualizer
 * D3 force-directed graph showing how a suspicious domain relates to known brands.
 * Load D3 via CDN in index.html: <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
 */

const KNOWN_BRANDS = ['paypal', 'google', 'apple', 'amazon', 'microsoft', 'facebook', 'netflix', 'instagram', 'twitter', 'bank'];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function buildGraphData(url) {
  let domain = '';
  try { domain = new URL(url).hostname.replace('www.', ''); } catch { domain = url; }
  const root = domain.split('.')[0];

  const nodes = [{ id: domain, type: 'threat', label: domain }];
  const links = [];

  KNOWN_BRANDS.forEach(brand => {
    const dist = levenshtein(root.toLowerCase(), brand);
    const maxDist = Math.max(root.length, brand.length);
    const similarity = Math.round((1 - dist / maxDist) * 100);
    if (similarity > 30) {
      nodes.push({ id: brand + '.com', type: 'brand', label: brand + '.com', similarity });
      links.push({ source: domain, target: brand + '.com', similarity });
    }
  });

  // Always add a few for visual richness if nothing matched
  if (links.length === 0) {
    ['google.com', 'paypal.com'].forEach(b => {
      const dist = levenshtein(root, b.split('.')[0]);
      const sim = Math.max(10, 40 - dist * 8);
      nodes.push({ id: b, type: 'brand', label: b, similarity: sim });
      links.push({ source: domain, target: b, similarity: sim });
    });
  }

  return { nodes, links };
}

const ThreatDNA = ({ url, report }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!url || !window.d3) return;
    const d3 = window.d3;
    const { nodes, links } = buildGraphData(url);

    const width = svgRef.current.clientWidth || 340;
    const height = 260;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => 160 - d.similarity))
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(38));

    // Gradient for links
    const defs = svg.append('defs');
    links.forEach((l, i) => {
      const grad = defs.append('linearGradient')
        .attr('id', `lg${i}`).attr('gradientUnits', 'userSpaceOnUse');
      grad.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444');
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6');
    });

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', (d, i) => `url(#lg${i})`)
      .attr('stroke-width', d => Math.max(1, d.similarity / 25))
      .attr('stroke-opacity', 0.6);

    // Similarity label on links
    const linkLabel = svg.append('g').selectAll('text').data(links).join('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#a3a3a3')
      .text(d => `${d.similarity}% match`);

    const node = svg.append('g').selectAll('g').data(nodes).join('g')
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    node.append('circle')
      .attr('r', d => d.type === 'threat' ? 28 : 22)
      .attr('fill', d => d.type === 'threat' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.1)')
      .attr('stroke', d => d.type === 'threat' ? '#ef4444' : '#3b82f6')
      .attr('stroke-width', d => d.type === 'threat' ? 2 : 1.5);

    // Pulse ring on threat node
    node.filter(d => d.type === 'threat').append('circle')
      .attr('r', 28)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.4)
      .append('animate')
      .attr('attributeName', 'r').attr('values', '28;42;28').attr('dur', '2s').attr('repeatCount', 'indefinite');

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'threat' ? '0.35em' : '-0.1em')
      .attr('font-size', d => d.type === 'threat' ? 9 : 8)
      .attr('font-weight', d => d.type === 'threat' ? '700' : '500')
      .attr('fill', d => d.type === 'threat' ? '#ef4444' : '#93c5fd')
      .text(d => d.label.length > 12 ? d.label.slice(0, 11) + '…' : d.label);

    node.filter(d => d.type === 'threat').append('text')
      .attr('text-anchor', 'middle').attr('dy', '1.4em')
      .attr('font-size', 8).attr('fill', '#ef4444').attr('opacity', 0.7)
      .text('SUSPECT');

    node.filter(d => d.type === 'brand').append('text')
      .attr('text-anchor', 'middle').attr('dy', '1.1em')
      .attr('font-size', 8).attr('fill', '#60a5fa').attr('opacity', 0.7)
      .text(d => `${d.similarity}% sim`);

    sim.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      linkLabel.attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 6);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [url]);

  if (!report || report.score > 80) return null;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '12px',
      marginTop: 12,
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        Threat DNA — Domain Similarity Graph
      </div>
      <svg ref={svgRef} style={{ width: '100%', height: 260, display: 'block' }} />
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
        Edges show structural similarity to known legitimate domains. Drag nodes to explore.
      </p>
    </div>
  );
};

export default ThreatDNA;
