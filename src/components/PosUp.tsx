'use client';
import { useAppSelector } from '@/lib/redux/hook';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

function PosUp() {
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const [number, setNumber] = useState('');

	useEffect(() => {
		if (eventConfig) {
			const e_zalo = eventConfig.find((e) => e.name === 'e-zalo');
			setNumber(e_zalo?.option ?? '');
		}
	}, [eventConfig]);

	return (
		<div className="fixed bottom-5 right-5 flex flex-col items-center justify-center bg-transparent gap-4 z-[1000]">
			<Link
				href={`http://zalo.me/${number}`}
				target="_blank"
				className="btn btn-link bg-base-200 rounded-full">
				<SiZalo size={34} />
			</Link>
			<Link
				href={'http://m.me/61565053230557'}
				target="_blank"
				className="btn btn-link bg-base-200 rounded-full">
				<FaFacebookMessenger size={34} />
			</Link>
		</div>
	);
}

export default PosUp;
