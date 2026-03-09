// GET /api/raffle/report — report metadata
export async function onRequestGet() {
  return new Response(JSON.stringify({
    title: 'Enterprise AI Spend Report 2026',
    keyFinding: '56% of enterprise AI spend produces no measurable ROI',
    reportUrl: 'https://cloudlatitude.io/gcn-2026/report',
    fiveLayerStack: [
      'Graphiant (Network)',
      'Gravitee (Gateway)',
      'Elastic + A2A (Intelligence)',
      'Cloudflare Zero Trust (Security)',
      'Exa Instant (Discovery)'
    ],
    costReduction: '30% within 90 days',
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
