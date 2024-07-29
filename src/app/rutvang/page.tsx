import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const RutVangContent = dynamic(() => import('./RutVangContent'), {
	ssr: false,
});

function RutVangPage() {
	return (
		<Suspense>
			<RutVangContent />
		</Suspense>
	);
}

export default RutVangPage;
