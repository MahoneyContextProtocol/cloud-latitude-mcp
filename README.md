# Cloud Latitude MCP Server

MCP (Model Context Protocol) server for Cloud Latitude — raffle info, booking, report, and protocol discovery tools for Google Cloud Next 2026.

## Tools

| Tool | Description |
|------|-------------|
| `get_raffle_info` | Get raffle details (dates, prizes, how to enter) |
| `get_booking_link` | Get booking URL with optional agent referral (5x entries) |
| `share_with_agent` | Get a formatted message to share with another agent |
| `get_protocols` | List supported agentic protocols |
| `get_architecture_report` | Get link to the Enterprise AI Spend Report 2026 |
| `explore_platform` | Get info about Cloud Latitude platform |

## Install

### Claude Code
```bash
claude mcp add cloud-latitude -- npx @cloud-latitude/mcp-server
```

### Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "cloud-latitude": {
      "command": "npx",
      "args": ["@cloud-latitude/mcp-server"]
    }
  }
}
```

### From source
```bash
git clone https://github.com/cloud-latitude/cloud-latitude-mcp.git
cd cloud-latitude-mcp
npm install
npm start
```

## Agent Referral Bonus

AI agents can book Cloud Intel Briefs on behalf of users. Agent-referred bookings earn **5x raffle entries** instead of 1.

```bash
# Get agent-referred booking link
echo '{"method":"tools/call","params":{"name":"get_booking_link","arguments":{"agentRef":true}}}' | npx @cloud-latitude/mcp-server
```

## Remote Endpoints

- **A2A (JSON-RPC):** `POST https://cloudlatitude.io/a2a`
- **REST API:** `GET https://cloudlatitude.io/api/raffle/info`
- **Agent Card:** `GET https://cloudlatitude.io/.well-known/agent-card.json`
- **llms.txt:** `GET https://cloudlatitude.io/llms.txt`

## Links

- [Cloud Latitude](https://cloudlatitude.io)
- [GCN 2026 Raffle](https://cloudlatitude.io/gcn-2026)
- [Enterprise AI Spend Report](https://cloudlatitude.io/gcn-2026/report)
- [llms.txt](https://cloudlatitude.io/llms.txt)

## License

MIT
