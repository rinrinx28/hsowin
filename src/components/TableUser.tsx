'use client';
import apiClient from '@/lib/apiClient';
import { updateUserRanks } from '@/lib/redux/features/rank/userRanks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Gold from './icons/gold';
import { GiRank3 } from 'react-icons/gi';

export default function TableUser() {
	const userRanks = useAppSelector((state) => state.userRanks);
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const [prizes, setPrize] = useState([]);
	const dispatch = useAppDispatch();

	useEffect(() => {
		let loop = setInterval(async () => {
			try {
				const res = await apiClient.get('/user/rank');
				const data = res.data;
				dispatch(updateUserRanks(data?.data));
			} catch (err) {}
		}, 1e3 * 30);

		return () => {
			clearInterval(loop);
		};
	}, [dispatch]);

	useEffect(() => {
		if (eventConfig) {
			let e_auto_rank_user = eventConfig.find(
				(e) => e.name === 'e-auto-rank-days',
			);
			if (e_auto_rank_user && e_auto_rank_user.status) {
				setPrize(JSON.parse(e_auto_rank_user.option));
			}
		}
	}, [eventConfig]);

	return (
		<div className="lg:flex lg:flex-col grid gap-1">
			<div className="bg-primary font-semibold border-current border rounded-box grid h-20 place-items-center">
				<div className="flex flex-row items-center justify-center gap-2">
					<GiRank3 size={34} />
					Bảng Xếp Hạng Ngày
					<GiRank3 size={34} />
				</div>
			</div>
			<div className="overflow-auto border border-current max-h-[600px]">
				<table className="table table-lg table-pin-rows table-pin-cols border-collapse border border-current">
					{/* head */}
					<thead className="text-sm  text-center">
						<tr>
							<th className="border border-current">TOP</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										className="h-4 w-4 opacity-70">
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
									</svg> */}
									Nhân Vật
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Gold className="" /> */}
									Gold
								</div>
							</th>
							<th className="border border-current">Phần Thưởng</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{userRanks?.map((user, i) => {
							const { name, totalBet = 0 } = user;
							return (
								<tr
									className="hover"
									key={user._id}>
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
									<td className="border border-current">{name}</td>
									<td className="border border-current">
										{new Intl.NumberFormat('vi').format(totalBet)}
									</td>
									<td className="border border-current">
										{prizes[i] ? `${prizes[i]} thỏi vàng` : 'Cái Nịt'}
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
