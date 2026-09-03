import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { canManagePlatform, ROLE_LABELS } from "@/lib/auth/roles";
import { listStaffUsers } from "@/lib/queries";
import { createStaffUser, setUserActive } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Contrôleurs & équipe" };

export default async function AdminTeamPage() {
  const session = await getSessionUser();
  const staff = await listStaffUsers();
  const canManage = canManagePlatform(session!.role);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Équipe CDF</h1>
        <p className="mt-1 text-sm text-slate-500">Consultants, contrôleurs terrain et administrateurs de la plateforme.</p>
      </div>

      {canManage && (
        <Card className="p-6">
          <SectionHeading title="Ajouter un membre de l'équipe" />
          <form action={createStaffUser} className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Nom complet" htmlFor="displayName"><Input id="displayName" name="displayName" required /></Field>
            <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" required /></Field>
            <Field label="Rôle" htmlFor="role">
              <Select id="role" name="role" defaultValue="CONSULTANT_CDF">
                <option value="ADMIN_CDF">Administrateur CDF</option>
                <option value="CONSULTANT_CDF">Consultant CDF</option>
                <option value="CONTROLEUR_TERRAIN">Contrôleur terrain</option>
              </Select>
            </Field>
            <div className="sm:col-span-3">
              <Button type="submit" size="sm">Créer l&apos;accès</Button>
            </div>
          </form>
        </Card>
      )}

      {staff.length === 0 ? (
        <EmptyState title="Aucun membre d'équipe enregistré" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Rôle</Th>
              <Th>Statut</Th>
              {canManage && <Th />}
            </tr>
          </Thead>
          <tbody>
            {staff.map((u) => (
              <Tr key={u.uid}>
                <Td>{u.displayName}</Td>
                <Td>{u.email}</Td>
                <Td>{ROLE_LABELS[u.role]}</Td>
                <Td><Badge tone={u.active ? "navy" : "neutral"}>{u.active ? "Actif" : "Désactivé"}</Badge></Td>
                {canManage && (
                  <Td>
                    <form action={setUserActive}>
                      <input type="hidden" name="uid" value={u.uid} />
                      <input type="hidden" name="active" value={String(!u.active)} />
                      <Button type="submit" size="sm" variant="outline">{u.active ? "Désactiver" : "Réactiver"}</Button>
                    </form>
                  </Td>
                )}
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
