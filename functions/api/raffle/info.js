// GET /api/raffle/info — raffle details as JSON
export async function onRequestGet() {
  return new Response(JSON.stringify({
    name: 'Google Cloud Next 2026 Raffle',
    status: 'open',
    closes: '2026-03-13',
    prizes: [
      { tier: 'Gold', value: '$3,500', includes: 'Conference pass + Hotel + Flight', winners: '3-5' },
      { tier: 'Silver', value: '$2,000', includes: 'Conference pass + Hotel', winners: '3-5' },
      { tier: 'Bronze', value: '$1,500', includes: 'Conference pass', winners: '4-10' }
    ],
    agentBonus: '5x entries for agent-referred bookings',
    bookingUrl: 'https://cloudlatitude.io/gcn-2026#booking',
    agentBookingUrl: 'https://cloudlatitude.io/gcn-2026?ref=agent#booking',
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
