import { useAppSelector } from '@/lib/redux/hook';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function PosUp() {
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const [number, setNumber] = useState('');

	useEffect(() => {
		if (eventConfig) {
			const e_zalo = eventConfig.find((e) => e.name === 'e_zalo');
			setNumber(e_zalo?.option ?? '');
		}
	}, [eventConfig]);

	return (
		<div className="fixed bottom-0 right-0 size-28 flex items-center justify-center bg-transparent">
			<Link
				href={`http://zalo.me/${number}`}
				target="_blank"
				className="btn btn-link z-50">
				<Image
					src={'/image/social/Icon_of_Zalo.svg.png'}
					alt="logo zalo"
					height={50}
					width={50}
				/>
			</Link>
		</div>
	);
}

export default PosUp;
