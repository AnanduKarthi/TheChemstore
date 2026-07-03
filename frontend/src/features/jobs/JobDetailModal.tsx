import { useNavigate, useParams } from 'react-router';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { JobDetailPanel } from '@/features/jobs/JobDetailPanel';

export function JobDetailModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) navigate(-1);
      }}
    >
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-gray-100 px-6 py-5">
          <SheetTitle className="text-brand-navy">Job Details</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {id && <JobDetailPanel jobId={id} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
