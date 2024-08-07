import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const VipClaimContent = dynamic(() => import('./VipClaimContent'), {
	ssr: false,
});

function VipClaimPage() {
	return (
		<Suspense>
			<VipClaimContent />
		</Suspense>
	);
}

export default VipClaimPage;
