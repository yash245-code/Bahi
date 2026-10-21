import { CrmSequencesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Outreach Cadences & Sequences | Bahi CRM',
  description: 'Automated multi-step outreach sequences, email and task cadences, and reply rate telemetry.',
};

export default function SequencesPage() {
  return <CrmSequencesView />;
}
