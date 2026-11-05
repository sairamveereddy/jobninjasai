import prisma from '@/lib/prisma';
import { slugifyRole } from './slug';

export async function resolveRole(identifier: string) {
  if (!identifier) return null;

  const clean = decodeURIComponent(identifier).trim();

  // 1. Direct UUID match
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  if (isUuid) {
    const role = await prisma.role.findUnique({
      where: { id: clean },
      include: {
        boards: true,
      },
    });
    if (role) return role;
  }

  // 2. Trailing UUID or short hash match (e.g. "ai-agentic-developer-170a8b7d")
  const trailingUuidMatch = clean.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  if (trailingUuidMatch) {
    const role = await prisma.role.findUnique({
      where: { id: trailingUuidMatch[1] },
      include: { boards: true },
    });
    if (role) return role;
  }

  const trailingShortHexMatch = clean.match(/-([0-9a-f]{8})$/i);
  if (trailingShortHexMatch) {
    const prefix = trailingShortHexMatch[1];
    const role = await prisma.role.findFirst({
      where: { id: { startsWith: prefix } },
      include: { boards: true },
    });
    if (role) return role;
  }

  // 3. Exact title match (with dashes replaced with spaces)
  const titleCandidate = clean.replace(/-/g, ' ');
  let role = await prisma.role.findFirst({
    where: {
      title: {
        equals: titleCandidate,
        mode: 'insensitive',
      },
    },
    include: { boards: true },
  });
  if (role) return role;

  // 4. In-memory slug match over all roles in org
  const allRoles = await prisma.role.findMany({
    include: { boards: true },
    orderBy: { createdAt: 'desc' },
  });

  const slugTarget = clean.toLowerCase();
  const matched = allRoles.find((r) => {
    const s = slugifyRole(r.title);
    return s === slugTarget || slugTarget.startsWith(s) || s.startsWith(slugTarget);
  });

  if (matched) return matched;

  // 5. Partial title match
  role = await prisma.role.findFirst({
    where: {
      title: {
        contains: titleCandidate,
        mode: 'insensitive',
      },
    },
    include: { boards: true },
  });

  return role;
}
