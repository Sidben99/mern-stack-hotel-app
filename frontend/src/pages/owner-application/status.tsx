import { Navigate, useOutletContext } from 'react-router-dom';
import { APPLICATION_STATUS } from '@lankaStay/shared/consts/applicationStatus';
import PendingStatusCard from './pending-status-card';
import RejectedStatusCard from './rejected-status-card';
import type { OwnerApplicationContext } from './index';
export default function OwnerApplicationStatus() {
  const { authState } = useOutletContext<OwnerApplicationContext>();
  const ownerInfo = authState.user.ownerInfo;
  if (!ownerInfo) return <Navigate to="./apply" replace />;
  switch (ownerInfo.applicationStatus) {
    case APPLICATION_STATUS.PENDING:
      return <PendingStatusCard ownerInfoFromResponse={ownerInfo} />;
    case APPLICATION_STATUS.REJECTED:
      return <RejectedStatusCard rejectionNote={ownerInfo.rejectionNote} />;
    default:
      return <Navigate to="./apply" replace />;
  }
}
