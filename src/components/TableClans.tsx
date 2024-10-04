'use client';

import apiClient from '@/lib/apiClient';
import { updateclansRanks } from '@/lib/redux/features/rank/clanRanks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useEffect, useState } from 'react';

export default function TableClans() {
	const clansRank = useAppSelector((state) => state.clanRanks);
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const [limited, setLimited] = useState(5);
	const [prizes, setPrizes] = useState<any | null>(null);
	const dispatch = useAppDispatch();
	useEffect(() => {
		let loop_up_rank = setInterval(async () => {
			try {
				const res = await apiClient.get('/user/rank/clans');
				dispatch(updateclansRanks(res.data));
			} catch (err: any) {}
		}, 1e3 * 30);
		return () => {
			clearInterval(loop_up_rank);
		};
	}, [dispatch]);

	useEffect(() => {
		if (eventConfig) {
			let limited_clans_members = eventConfig.find(
				(e) => e.name === 'e-clans-limit-members',
			);
			let prize_clans = eventConfig.find((e) => e.name === 'e-clans-prizes');
			setLimited(limited_clans_members?.value ?? 5);
			setPrizes(JSON.parse(prize_clans?.option ?? '[]'));
		}
	}, [eventConfig]);

	return (
		<div className="lg:flex lg:flex-col grid gap-2 w-full">
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Bang Hội Cái Bang
			</div>
			<div className="overflow-auto max-h-[600px] w-full custom-an-border">
				<table className="table  table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm text-center">
						<tr>
							<th className="border border-current">TOP</th>
							<th className="border border-current">Bang Hội</th>
							<th className="border border-current">Gold</th>
							<th className="border border-current">Thành Viên</th>
							<th className="border border-current">Phần Thưởng/Người</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{clansRank &&
							clansRank.map((c, i) => {
								const { clanName, member, totalBet } = c;
								const prize = i > (prizes ?? []).length - 1 ? 0 : prizes[i];
								return (
									<tr
										key={c._id}
										className="hover">
										<td className="border border-current">{i + 1}</td>
										<td className="border border-current">{clanName}</td>
										<td className="border border-current">{totalBet}</td>
										<td className="border border-current">
											{member}/{limited}
										</td>
										<td className="border border-current">
											{`${prize} thỏi vàng`}
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
