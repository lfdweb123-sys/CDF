import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Role } from "@/types";

interface LogParams {
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entity: string;
  entityId: string;
  companyId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Append-only audit trail. Entries are never updated or deleted through the
 * application layer (see firestore.rules: `audit_logs` allows create only for
 * CDF staff and denies update/delete for every role, admins included).
 */
export async function logAudit(params: LogParams): Promise<void> {
  await adminDb.collection("audit_logs").add({
    ...params,
    createdAt: new Date().toISOString(),
  });
}
