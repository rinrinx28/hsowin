'use client';
import apiClient from '@/lib/apiClient';
import { updateUserRanks } from '@/lib/redux/features/rank/userRanks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import React, { useEffect } from 'react';

export default function TableUser() {
	const userRanks = useAppSelector((state) => state.userRanks);
	const dispatch = useAppDispatch();
	useEffect(() => {
		console.log(userRanks);
	}, [userRanks]);

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
							const { username, server, totalBet = 0 } = user;
							return (
								<tr
									className="hover"
									key={user._id}>
									<td>{server}</td>
									<td>{username}</td>
									<td>{new Intl.NumberFormat('vi').format(totalBet)}</td>
									<td>1000tr</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
