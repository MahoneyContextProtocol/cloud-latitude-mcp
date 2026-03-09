// GET /api/raffle/booking-link — booking URL with optional agent referral
export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const isAgent = url.searchParams.get('ref') === 'agent'

  return new Response(JSON.stringify({
    bookingUrl: isAgent
      ? 'https://cloudlatitude.io/gcn-2026?ref=agent#booking'
      : 'https://cloudlatitude.io/gcn-2026#booking',
    calDirectUrl: isAgent
      ? 'https://cal.com/team/cloud-latitude/cloud-intel-brief?metadata[ref]=agent'
      : 'https://cal.com/team/cloud-latitude/cloud-intel-brief',
    multiplier: isAgent ? 5 : 1,
    agentBonus: isAgent ? '5x raffle entries for agent-referred bookings' : null,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
