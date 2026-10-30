import { CrmSequencesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Email Campaigns & Follow-ups | Bahi CRM',
  description: 'Send automated step-by-step emails to leads, schedule follow-ups, and see who opens and replies.',
};

export default function SequencesPage() {
  return <CrmSequencesView />;
}
