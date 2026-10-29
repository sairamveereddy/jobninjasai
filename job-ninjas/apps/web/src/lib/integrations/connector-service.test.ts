import { getConnectorConfig, setConnectorConfig, listAllConnectors } from './connector-service';

async function runTests() {
  console.log('Testing ConnectorService...');

  // Test set and get
  const updated = await setConnectorConfig(
    'org-123',
    'SLACK',
    { webhookUrl: 'https://hooks.slack.com/services/TEST/123', channel: '#hiring' },
    'ACTIVE'
  );
  if (updated.status !== 'ACTIVE' || updated.settings.channel !== '#hiring') {
    throw new Error('setConnectorConfig failed to store settings');
  }

  const fetched = await getConnectorConfig('org-123', 'SLACK');
  if (fetched.status !== 'ACTIVE' || fetched.settings.webhookUrl !== 'https://hooks.slack.com/services/TEST/123') {
    throw new Error('getConnectorConfig failed to retrieve settings');
  }

  // Test list all 7 providers
  const list = await listAllConnectors('org-123');
  const requiredProviders = [
    'GREENHOUSE',
    'WORKDAY',
    'GMAIL',
    'SLACK',
    'GOOGLE_CALENDAR',
    'GITHUB',
    'GENERIC_WEBHOOK',
  ];

  for (const prov of requiredProviders) {
    if (!list[prov as any]) {
      throw new Error(`Missing provider in listAllConnectors: ${prov}`);
    }
  }

  console.log('All ConnectorService tests passed!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
