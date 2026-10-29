import prisma from '@/lib/prisma';

export type IntegrationProvider =
  | 'GREENHOUSE'
  | 'WORKDAY'
  | 'GMAIL'
  | 'SLACK'
  | 'GOOGLE_CALENDAR'
  | 'GITHUB'
  | 'GENERIC_WEBHOOK';

export interface ConnectorRecord {
  id?: string;
  provider: IntegrationProvider;
  status: 'ACTIVE' | 'READY' | 'DISCONNECTED';
  settings: Record<string, any>;
  lastSyncAt?: string | null;
  updatedAt?: string;
}

// In-memory fallback for local development or disconnected DB
const memoryStore = new Map<string, ConnectorRecord>();

function getStorageKey(organizationId: string, provider: string): string {
  return `${organizationId || 'default-org'}:${provider.toUpperCase()}`;
}

/**
 * Retrieve configuration & credentials for a given integration provider.
 */
export async function getConnectorConfig(
  organizationId: string,
  provider: IntegrationProvider
): Promise<ConnectorRecord> {
  const normProvider = provider.toUpperCase() as IntegrationProvider;
  const memKey = getStorageKey(organizationId, normProvider);

  try {
    if (prisma && prisma.connector) {
      const existing = await prisma.connector.findFirst({
        where: {
          provider: normProvider,
          ...(organizationId ? { organizationId } : {}),
        },
      });

      if (existing) {
        let parsedSettings: Record<string, any> = {};
        if (existing.accessToken) {
          try {
            parsedSettings = JSON.parse(existing.accessToken);
          } catch {
            parsedSettings = { apiKey: existing.accessToken };
          }
        }
        return {
          id: existing.id,
          provider: normProvider,
          status: (existing.status as any) || 'ACTIVE',
          settings: parsedSettings,
          lastSyncAt: existing.lastSyncAt ? existing.lastSyncAt.toISOString() : null,
          updatedAt: existing.updatedAt ? existing.updatedAt.toISOString() : undefined,
        };
      }
    }
  } catch (err) {
    // Database query failed, fallback to memory
  }

  const inMemory = memoryStore.get(memKey);
  if (inMemory) return inMemory;

  return {
    provider: normProvider,
    status: normProvider === 'GREENHOUSE' || normProvider === 'GITHUB' || normProvider === 'GENERIC_WEBHOOK' ? 'ACTIVE' : 'READY',
    settings: {},
    lastSyncAt: null,
  };
}

/**
 * Persist configuration and credentials for an integration provider.
 */
export async function setConnectorConfig(
  organizationId: string,
  provider: IntegrationProvider,
  settings: Record<string, any>,
  status: 'ACTIVE' | 'READY' | 'DISCONNECTED' = 'ACTIVE'
): Promise<ConnectorRecord> {
  const normProvider = provider.toUpperCase() as IntegrationProvider;
  const memKey = getStorageKey(organizationId, normProvider);
  const serialized = JSON.stringify(settings || {});
  const now = new Date();

  const record: ConnectorRecord = {
    provider: normProvider,
    status,
    settings,
    lastSyncAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  memoryStore.set(memKey, record);

  try {
    if (prisma && prisma.connector) {
      let targetOrgId = organizationId;
      if (!targetOrgId) {
        const firstOrg = await prisma.organization.findFirst();
        targetOrgId = firstOrg ? firstOrg.id : 'default-org';
      }

      const existing = await prisma.connector.findFirst({
        where: {
          provider: normProvider,
          organizationId: targetOrgId,
        },
      });

      if (existing) {
        const updated = await prisma.connector.update({
          where: { id: existing.id },
          data: {
            accessToken: serialized,
            status,
            lastSyncAt: now,
          },
        });
        record.id = updated.id;
      } else {
        // Create connector if org exists
        const orgExists = await prisma.organization.findUnique({
          where: { id: targetOrgId },
        });

        if (orgExists) {
          const created = await prisma.connector.create({
            data: {
              organizationId: targetOrgId,
              provider: normProvider,
              accessToken: serialized,
              status,
              lastSyncAt: now,
            },
          });
          record.id = created.id;
        }
      }
    }
  } catch (err) {
    // DB write failed, keep memory record
  }

  return record;
}

/**
 * List all 7 standard integrations with their current connection status.
 */
export async function listAllConnectors(organizationId: string): Promise<Record<IntegrationProvider, ConnectorRecord>> {
  const providers: IntegrationProvider[] = [
    'GREENHOUSE',
    'WORKDAY',
    'GMAIL',
    'SLACK',
    'GOOGLE_CALENDAR',
    'GITHUB',
    'GENERIC_WEBHOOK',
  ];

  const results = await Promise.all(
    providers.map((p) => getConnectorConfig(organizationId, p))
  );

  const map = {} as Record<IntegrationProvider, ConnectorRecord>;
  providers.forEach((p, idx) => {
    map[p] = results[idx];
  });
  return map;
}
