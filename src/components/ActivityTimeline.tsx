import { Activity } from "../api/activity.api";

/* ================= ACTION LABELS ================= */

const actionLabel: Record<string, (a: Activity) => string> = {
  CREATE_PROJECT: () => "created the project",

  UPDATE_PROJECT: () => "updated the project",

  DELETE_PROJECT: () => "deleted the project",

  CHANGE_MEMBER_ROLE: () => "changed a member role",

  REMOVE_MEMBER: () => "removed a member",

  ISSUE_CREATED: (a) =>
    `created "${a.metadata?.title ?? "an issue"}"`,

  ISSUE_RESOLVED: (a) =>
    `resolved "${a.metadata?.issueTitle ?? "this issue"}"`,

  ISSUE_ASSIGNED: (a) =>
    `assigned "${a.metadata?.issueTitle}" to ${a.metadata?.assigneeName}`,
};

/* ================= PROPS ================= */

interface ActivityTimelineProps {
  activities?: Activity[];
}

/* ================= COMPONENT ================= */

export default function ActivityTimeline({
  activities = [],
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((a) => (
        <div
          key={a.id}
          className="flex gap-4 border-l-2 border-gray-700 pl-4"
        >
          <div className="text-xs text-gray-500 whitespace-nowrap">
            {new Date(a.created_at).toLocaleString()}
          </div>

          <div>
            <p className="text-sm text-gray-200">
              <span className="font-semibold">
                {a.actor_name}
              </span>{" "}
              {actionLabel[a.action]
                ? actionLabel[a.action](a)
                : a.action.toLowerCase().replace(/_/g, " ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
