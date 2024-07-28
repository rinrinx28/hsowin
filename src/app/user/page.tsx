import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const UserContent = dynamic(() => import('./UserContent'), { ssr: false });

function UserPage() {
	return (
		<Suspense>
			<UserContent />
		</Suspense>
	);
}

export default UserPage;
