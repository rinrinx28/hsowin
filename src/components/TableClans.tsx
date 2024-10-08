'use client';

import apiClient from '@/lib/apiClient';
import { updateclansRanks } from '@/lib/redux/features/rank/clanRanks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useEffect, useState } from 'react';
import Gold from './icons/gold';
import { GiMedievalPavilion } from 'react-icons/gi';
import Image from 'next/image';

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
			<div className="border-current border rounded-box grid h-20 place-items-center bg-primary font-semibold">
				<div className="flex flex-row items-center justify-center gap-2">
					<GiMedievalPavilion size={34} />
					Bang Hội Cái Bang
					<GiMedievalPavilion size={34} />
				</div>
			</div>
			<div className="overflow-auto max-h-[600px] w-full custom-an-border">
				<table className="table  table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm text-center">
						<tr>
							<th className="border border-current">TOP</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									Bang Hội
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Gold className="" /> */}
									Gold
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										className="h-4 w-4 opacity-70">
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
									</svg> */}
									Thành Viên
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									Phần Thưởng/Người
								</div>
							</th>
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
										<td className="border border-current">
											<div className="flex flex-row items-center justify-center gap-2">
												<Image
													alt={`${i + 1}_user`}
													src={`/image/rank/${i + 1}.png`}
													width={40}
													height={40}
													className="flicker-4"
													priority={true}
												/>
											</div>
										</td>
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
