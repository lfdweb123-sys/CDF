import type { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN_CDF: "Super administrateur CDF",
  ADMIN_CDF: "Administrateur CDF",
  CONSULTANT_CDF: "Consultant CDF",
  CONTROLEUR_TERRAIN: "Contrôleur terrain",
  CLIENT_ADMIN: "Administrateur entreprise",
  CLIENT_MANAGER: "Direction / Responsable opérationnel",
  CLIENT_VIEWER: "Lecture seule",
};

export const CDF_STAFF_ROLES: Role[] = [
  "SUPER_ADMIN_CDF",
  "ADMIN_CDF",
  "CONSULTANT_CDF",
  "CONTROLEUR_TERRAIN",
];

export const CLIENT_SIDE_ROLES: Role[] = ["CLIENT_ADMIN", "CLIENT_MANAGER", "CLIENT_VIEWER"];

export function isCdfStaff(role: Role | null | undefined): boolean {
  return !!role && CDF_STAFF_ROLES.includes(role);
}

export function isClientRole(role: Role | null | undefined): boolean {
  return !!role && CLIENT_SIDE_ROLES.includes(role);
}

export function canManagePlatform(role: Role | null | undefined): boolean {
  return role === "SUPER_ADMIN_CDF" || role === "ADMIN_CDF";
}

export function canManageMissions(role: Role | null | undefined): boolean {
  return isCdfStaff(role);
}

export function canWriteClientData(role: Role | null | undefined): boolean {
  return role === "CLIENT_ADMIN" || role === "CLIENT_MANAGER";
}

export function canManageUsers(role: Role | null | undefined): boolean {
  return role === "SUPER_ADMIN_CDF" || role === "ADMIN_CDF" || role === "CLIENT_ADMIN";
}

/** Default landing route once authenticated, based on role. */
export function homeRouteForRole(role: Role | null | undefined): string {
  if (isCdfStaff(role)) return "/admin";
  if (isClientRole(role)) return "/portail";
  return "/connexion";
}
