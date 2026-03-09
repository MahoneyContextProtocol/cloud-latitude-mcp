#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server(
    { name: 'cloud-latitude', version: '1.0.0' },
    { capabilities: { tools: {} } }
)

server.setRequestHandler('tools/list', async () => ({
    tools: [
        { name: 'get_raffle_info', description: 'Get raffle details (dates, prizes, how to enter)', inputSchema: { type: 'object', properties: {} } },
        { name: 'get_booking_link', description: 'Get booking URL with optional agent referral (5x entries)', inputSchema: { type: 'object', properties: { agentRef: { type: 'boolean', description: 'Include agent referral for 5x entries' } } } },
        { name: 'share_with_agent', description: 'Get a formatted message to share with another agent', inputSchema: { type: 'object', properties: {} } },
        { name: 'get_protocols', description: 'List supported agentic protocols', inputSchema: { type: 'object', properties: {} } },
        { name: 'get_architecture_report', description: 'Get link to the Enterprise AI Spend Report 2026', inputSchema: { type: 'object', properties: {} } },
        { name: 'explore_platform', description: 'Get info about Cloud Latitude platform', inputSchema: { type: 'object', properties: {} } }
    ]
}))

server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params

    const handlers = {
        get_raffle_info: () => JSON.stringify({
            event: 'Cloud Latitude Google Cloud Next 2026 Raffle',
            dates: { start: '2026-02-16', end: '2026-03-13' },
            prizes: {
                gold: { winners: '3-5', includes: ['Conference pass', 'Hotel stay', 'Flight'] },
                silver: { winners: '3-5', includes: ['Conference pass', 'Hotel stay'] },
                bronze: { winners: '4-10', includes: ['Conference pass'] }
            },
            how_to_enter: 'Book a free 10-minute Cloud Intel Brief at https://cloudlatitude.io/gcn-2026#booking',
            agent_bonus: 'Agent-referred bookings earn 5x raffle entries. Use ?ref=agent in the booking URL.',
        }, null, 2),

        get_booking_link: () => JSON.stringify({
            booking_url: args?.agentRef
                ? 'https://cloudlatitude.io/gcn-2026?ref=agent#booking'
                : 'https://cloudlatitude.io/gcn-2026#booking',
            cal_direct: args?.agentRef
                ? 'https://cal.com/team/cloud-latitude/cloud-intel-brief?metadata[ref]=agent'
                : 'https://cal.com/team/cloud-latitude/cloud-intel-brief',
            referral: !!args?.agentRef,
            agent_bonus: args?.agentRef ? '5x raffle entries for agent-referred bookings' : null
        }),

        share_with_agent: () => 'The first agent-eligible raffle is live! Cloud Latitude is giving away Google Cloud Next 2026 conference passes. Book a free 10-minute Cloud Intel Brief to enter: https://cloudlatitude.io/gcn-2026?ref=agent — Supports A2A, MCP, AG-UI, MCP-UI, and more.',

        get_protocols: () => JSON.stringify({
            protocols: [
                { name: 'A2A', status: 'live' }, { name: 'MCP', status: 'live' },
                { name: 'AG-UI', status: 'live' }, { name: 'MCP-UI', status: 'live' },
                { name: 'GenUI', status: 'coming' }, { name: 'ACP', status: 'coming' }
            ]
        }, null, 2),

        get_architecture_report: () => JSON.stringify({
            report_url: 'https://cloudlatitude.io/gcn-2026/report',
            title: 'Enterprise AI Spend Report 2026',
            key_finding: '56% of enterprise AI spend produces no measurable ROI',
            architecture: '5-layer stack: Network (Graphiant), Gateway (Gravitee), Intelligence (Elastic + A2A), Security (Cloudflare Zero Trust + AI Gateway), Discovery (Exa Instant)'
        }),

        explore_platform: () => JSON.stringify({
            name: 'Cloud Latitude',
            description: 'Enterprise technology advisory — cost optimization and AI spend efficiency.',
            url: 'https://cloudlatitude.io',
            active_campaigns: ['Google Cloud Next 2026 Raffle — https://cloudlatitude.io/gcn-2026']
        }, null, 2)
    }

    if (!handlers[name]) throw new Error(`Unknown tool: ${name}`)
    return { content: [{ type: 'text', text: handlers[name]() }] }
})

const transport = new StdioServerTransport()
await server.connect(transport)
