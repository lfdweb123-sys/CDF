import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany, listCompanyUsers, listMissions } from "@/lib/queries";
import { createClientUser, updateCompanyStatus, updateCompanyRiskScore } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { MissionStatusBadge } from "@/components/ui/status-badge";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { scoreBand } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompany(id);
  return { title: company?.name ?? "Client" };
}

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, users, missions] = await Promise.all([getCompany(id), listCompanyUsers(id), listMissions(id)]);
  if (!company) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{company.sector}</p>
          <h1 className="mt-1 text-2xl font-semibold text-navy-950">{company.name}</h1>
        </div>
        <form action={updateCompanyStatus} className="flex items-center gap-2">
          <input type="hidden" name="companyId" value={company.id} />
          <Select name="status" defaultValue={company.status} className="w-auto">
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu</option>
            <option value="prospect">Prospect</option>
          </Select>
          <Button type="submit" size="sm" variant="outline">Mettre à jour</Button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <SectionHeading title="CDF Risk Score™" />
          <p className="mt-3 text-3xl font-semibold text-navy-950">
            {company.riskScore !== null ? `${company.riskScore}/100` : "—"}
          </p>
          {company.riskScore !== null && (
            <Badge tone="navy" className="mt-2">{scoreBand(company.riskScore).label}</Badge>
          )}
          <form action={updateCompanyRiskScore} className="mt-4 flex items-center gap-2">
            <input type="hidden" name="companyId" value={company.id} />
            <Input name="score" type="number" min={0} max={100} placeholder="Nouveau score" className="w-32" required />
            <Button type="submit" size="sm" variant="outline">Enregistrer</Button>
          </form>
          <p className="mt-2 text-xs text-slate-500">Ajoute une entrée à l&apos;historique affiché sur le dashboard client.</p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <SectionHeading title="Coordonnées" />
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-slate-500">Responsable</dt><dd className="mt-0.5 font-medium text-navy-900">{company.responsableName ?? "—"}</dd></div>
            <div><dt className="text-slate-500">Email</dt><dd className="mt-0.5 font-medium text-navy-900">{company.responsableEmail ?? "—"}</dd></div>
            <div><dt className="text-slate-500">Téléphone</dt><dd className="mt-0.5 font-medium text-navy-900">{company.responsablePhone ?? "—"}</dd></div>
            <div><dt className="text-slate-500">Localisation</dt><dd className="mt-0.5 font-medium text-navy-900">{company.location ?? "—"}</dd></div>
          </dl>
        </Card>
      </div>

      <div>
        <SectionHeading title="Utilisateurs de l'entreprise" />
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {users.length === 0 ? (
              <EmptyState title="Aucun utilisateur" description="Créez le premier utilisateur pour donner accès à l'espace client." />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Rôle</Th>
                    <Th>Statut</Th>
                  </tr>
                </Thead>
                <tbody>
                  {users.map((u) => (
                    <Tr key={u.uid}>
                      <Td>{u.displayName}</Td>
                      <Td>{u.email}</Td>
                      <Td>{ROLE_LABELS[u.role]}</Td>
                      <Td><Badge tone={u.active ? "navy" : "neutral"}>{u.active ? "Actif" : "Désactivé"}</Badge></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-navy-950">Ajouter un utilisateur</h3>
            <form action={createClientUser} className="mt-4 space-y-3">
              <input type="hidden" name="companyId" value={company.id} />
              <Field label="Nom complet" htmlFor="displayName"><Input id="displayName" name="displayName" required /></Field>
              <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" required /></Field>
              <Field label="Rôle" htmlFor="role">
                <Select id="role" name="role" defaultValue="CLIENT_VIEWER">
                  <option value="CLIENT_ADMIN">Administrateur entreprise</option>
                  <option value="CLIENT_MANAGER">Direction / Responsable opérationnel</option>
                  <option value="CLIENT_VIEWER">Lecture seule</option>
                </Select>
              </Field>
              <Button type="submit" size="sm" className="w-full">Créer l&apos;accès</Button>
            </form>
          </Card>
        </div>
      </div>

      <div>
        <SectionHeading title="Missions" />
        <div className="mt-4">
          {missions.length === 0 ? (
            <EmptyState title="Aucune mission" />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Référence</Th>
                  <Th>Type</Th>
                  <Th>Statut</Th>
                </tr>
              </Thead>
              <tbody>
                {missions.map((m) => (
                  <Tr key={m.id}>
                    <Td><Link href={`/admin/missions/${m.id}`} className="font-medium text-navy-900 hover:underline">{m.reference}</Link></Td>
                    <Td className="capitalize">{m.type.replace(/-/g, " ")}</Td>
                    <Td><MissionStatusBadge status={m.status} /></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
