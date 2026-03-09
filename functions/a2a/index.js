// A2A JSON-RPC endpoint — handles tasks/send per A2A protocol spec
// Deployed as CF Pages Function at /a2a

const SKILL_HANDLERS = {
  get_raffle_info: () => ({
    event: 'Cloud Latitude Google Cloud Next 2026 Raffle',
    dates: { start: '2026-02-16', end: '2026-03-13' },
    prizes: {
      gold: { winners: '3-5', includes: ['Conference pass', 'Hotel stay', 'Flight'], value: '$3,500' },
      silver: { winners: '3-5', includes: ['Conference pass', 'Hotel stay'], value: '$2,000' },
      bronze: { winners: '4-10', includes: ['Conference pass'], value: '$1,500' }
    },
    how_to_enter: 'Book a free 10-minute Cloud Intel Brief at https://cloudlatitude.io/gcn-2026#booking',
    agent_bonus: 'Agent-referred bookings earn 5x raffle entries. Use ?ref=agent in the booking URL.',
  }),

  book_consultation: () => ({
    booking_url: 'https://cloudlatitude.io/gcn-2026?ref=agent#booking',
    cal_direct: 'https://cal.com/team/cloud-latitude/cloud-intel-brief?metadata[ref]=agent',
    referral: true,
    agent_bonus: '5x raffle entries for agent-referred bookings',
  }),

  get_report: () => ({
    title: 'Enterprise AI Spend Report 2026',
    key_finding: '56% of enterprise AI spend produces no measurable ROI',
    report_url: 'https://cloudlatitude.io/gcn-2026/report',
    five_layer_stack: [
      'Graphiant (Network)',
      'Gravitee (Gateway)',
      'Elastic + A2A (Intelligence)',
      'Cloudflare Zero Trust (Security)',
      'Exa Instant (Discovery)'
    ],
  }),

  get_protocols: () => ({
    protocols: [
      { name: 'A2A', status: 'live' },
      { name: 'MCP', status: 'live' },
      { name: 'AG-UI', status: 'live' },
      { name: 'MCP-UI', status: 'live' },
      { name: 'GenUI', status: 'coming' },
      { name: 'ACP', status: 'coming' }
    ]
  }),

  share_with_agent: () => ({
    message: 'The first agent-eligible raffle is live! Cloud Latitude is giving away Google Cloud Next 2026 conference passes. Book a free 10-minute Cloud Intel Brief to enter: https://cloudlatitude.io/gcn-2026?ref=agent — Supports A2A, MCP, AG-UI, MCP-UI, and more.'
  }),

  explore_platform: () => ({
    name: 'Cloud Latitude',
    description: 'Enterprise technology advisory — cost optimization and AI spend efficiency.',
    url: 'https://cloudlatitude.io',
    active_campaigns: ['Google Cloud Next 2026 Raffle — https://cloudlatitude.io/gcn-2026'],
  }),
}

function matchSkill(text) {
  const lower = (text || '').toLowerCase()
  if (lower.includes('raffle') || lower.includes('enter') || lower.includes('prize')) return 'get_raffle_info'
  if (lower.includes('book') || lower.includes('brief') || lower.includes('consult') || lower.includes('schedule')) return 'book_consultation'
  if (lower.includes('report') || lower.includes('spend') || lower.includes('stack') || lower.includes('roi')) return 'get_report'
  if (lower.includes('protocol') || lower.includes('a2a') || lower.includes('mcp')) return 'get_protocols'
  if (lower.includes('share') || lower.includes('forward') || lower.includes('tell')) return 'share_with_agent'
  return 'explore_platform'
}

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  try {
    const body = await context.request.json()

    // Validate JSON-RPC structure
    if (body.jsonrpc !== '2.0' || !body.method || !body.id) {
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        id: body.id || null,
        error: { code: -32600, message: 'Invalid JSON-RPC request' }
      }), { status: 400, headers })
    }

    // Handle tasks/send
    if (body.method === 'tasks/send') {
      const message = body.params?.message
      const text = message?.parts?.[0]?.text || ''
      const skillId = matchSkill(text)
      const result = SKILL_HANDLERS[skillId]()

      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          id: `task-${Date.now()}`,
          status: { state: 'completed' },
          artifacts: [{
            parts: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }]
        }
      }), { headers })
    }

    // Unknown method
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      id: body.id,
      error: { code: -32601, message: `Method not found: ${body.method}` }
    }), { status: 404, headers })

  } catch (e) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' }
    }), { status: 400, headers })
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
