import { ROLE_LIST } from "~/server/configs/role";

const ROLE_NAMES = Object.entries(ROLE_LIST).reduce((acc, [name, value]) => {
  acc[value] = name;
  return acc;
}, {} as Record<number, string>);

// get role name from numeric value
export function getRoleName(roleValue: number | undefined) {
  if (roleValue) {
    return ROLE_NAMES[roleValue] || "Unknown";
  }
}

// get all role names for an array of role values
export function getRoleNames(roleValues: number[]): string[] {
  return roleValues.map((value) => ROLE_NAMES[value] || "Unknown");
}
