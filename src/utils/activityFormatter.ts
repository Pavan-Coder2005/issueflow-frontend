/* =========================
   ACTIVITY FORMATTER
========================= */

export const formatActivity = (a: any) => {
  const m = a.metadata ?? {};
  const actor = a.actor_name ?? "Someone";

  switch (a.action) {
    /* ================= PROJECT ================= */

    case "PROJECT_CREATED":
      return `created project “${getProjectName(m)}”`;

    case "PROJECT_UPDATED":
      return `updated project “${getProjectName(m)}”`;

    case "PROJECT_DELETED":
      return `deleted project “${getProjectName(m)}”`;

    /* ================= MEMBERS ================= */

    case "CHANGE_MEMBER_ROLE": {
      if (!m.oldRole || !m.newRole) {
        return "changed a member’s role";
      }

      return `changed ${m.memberName ?? "a member"}’s role from ${capitalize(
        m.oldRole
      )} → ${capitalize(m.newRole)} in ${getProjectName(m)}`;
    }

    case "REMOVE_MEMBER":
      return `removed ${m.memberName ?? "a member"} from ${getProjectName(m)}`;

    /* ================= ISSUES ================= */

    case "ISSUE_CREATED":
      return `created issue “${m.issueTitle ?? "an issue"}” in ${getProjectName(
        m
      )}`;

    case "ISSUE_ASSIGNED":
      return `assigned issue “${m.issueTitle ?? "an issue"}” to ${
        m.assigneeName ?? "someone"
      }`;

    case "ISSUE_RESOLVED":
      return `resolved issue “${m.issueTitle ?? "an issue"}”`;

    /* ================= FALLBACK ================= */

    default:
      return a.action?.toLowerCase().replace(/_/g, " ") ?? "did something";
  }
};

/* =========================
   HELPERS
========================= */

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

const getProjectName = (m: any) =>
  m.projectName ?? m.name ?? "a project";
