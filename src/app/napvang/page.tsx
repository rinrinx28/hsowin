import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const NapVangContent = dynamic(() => import('./NapVangContent'), {
	ssr: false,
});

function NapVangPage() {
	return (
		<Suspense>
			<NapVangContent />
		</Suspense>
	);
}

export default NapVangPage;
