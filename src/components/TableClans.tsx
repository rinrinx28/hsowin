'use client';

import apiClient from '@/lib/apiClient';
import { updateclansRanks } from '@/lib/redux/features/rank/clanRanks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useEffect } from 'react';

export default function TableClans() {
	const clansRank = useAppSelector((state) => state.clanRanks);
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
	return (
		<div className="lg:flex lg:flex-col grid gap-1">
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Bang Hội Cái Bang
			</div>
			<div className="overflow-auto border border-current max-h-[600px]">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm text-center">
						<tr>
							<th>TOP</th>
							<th>Bang Hội</th>
							<th>Gold</th>
							<th>Thành Viên</th>
							<th>Phần Thưởng/Người</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{clansRank &&
							clansRank.map((c, i) => {
								const { clanName, member, totalBet } = c;
								return (
									<tr
										key={c._id}
										className="hover">
										<td>{i + 1}</td>
										<td>{clanName}</td>
										<td>{totalBet}</td>
										<td>{member}/25</td>
										<td>Có cái nịt</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
