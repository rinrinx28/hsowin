'use client';
import apiClient from '@/lib/apiClient';
import { updateUserRanks } from '@/lib/redux/features/rank/userRanks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

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
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Bảng Xếp Hạng Ngày
			</div>
			<div className="overflow-auto border border-current max-h-[600px]">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm  text-center">
						<tr>
							<th>TOP</th>
							<th>Nhân Vật</th>
							<th>Gold</th>
							<th>Phần Thưởng</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{userRanks?.map((user, i) => {
							const { name, totalBet = 0 } = user;
							return (
								<tr
									className="hover"
									key={user._id}>
									<td className="flex items-center justify-center">
										<Image
											alt={`${i + 1}_user`}
											src={`/image/rank/${i + 1}_user.webp`}
											width={100}
											height={100}
										/>
									</td>
									<td>{name}</td>
									<td>{new Intl.NumberFormat('vi').format(totalBet)}</td>
									<td>{prizes[i] ? `${prizes[i]} thỏi vàng` : 'Cái Nịt'}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
