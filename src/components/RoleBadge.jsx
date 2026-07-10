import { Badge } from './ui/Badge'

export default function RoleBadge({ role }) {
  const roleName = role || 'member';
  
  const badges = {
    admin: { label: 'Admin', variant: 'brand' },
    faculty: { label: 'Faculty', variant: 'indigo' },
    placement_cell: { label: 'Placement Cell', variant: 'emerald' },
    student: { label: 'Member', variant: 'blue' },
    member: { label: 'Member', variant: 'blue' },
  };

  const badge = badges[roleName] || badges.member;

  return <Badge variant={badge.variant}>{badge.label}</Badge>;
}
