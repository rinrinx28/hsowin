'use client';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import React, { useEffect } from 'react';
import moment from 'moment';
import apiClient from '@/lib/apiClient';
import { updateAll } from '@/lib/redux/features/logs/userBetLog';
import { TranslateKey } from '@/lib/unit/translateKey';
import { useSocket } from '@/lib/socket';

export default function TableResult() {
	const socket = useSocket();
	const userBetLog = useAppSelector((state) => state.userBetLog);
	const user = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	const changeRowTable = async (value: any) => {
		try {
			const res = await apiClient.get(`/user/log-bet/all?limit=${value}`);
			const data = res.data;
			dispatch(updateAll(data?.data));
		} catch (err) {}
	};

	const handleCancelUserBet = (
		uid: any,
		betId: any,
		userBetId: any,
		server: string,
	) => {
		if (uid !== user._id) return;
		if (!uid || !betId || !userBetId) return;
		if (['1', '2', '3'].includes(server)) {
			socket.emit('bet-user-del-boss', { uid, betId, userBetId });
		} else {
			socket.emit('bet-user-del-sv', { uid, betId, userBetId });
		}
	};

	return (
		<div className="lg:flex lg:flex-col grid gap-1">
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Lịch Sử Kết Quả
			</div>
			<div className="overflow-auto border border-current max-h-[600px]">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm  text-center">
						<tr>
							<th>Server</th>
							<th>Nhân Vật</th>
							<th>Gold Cược</th>
							<th>Dự Đoán</th>
							<th>Kết Quả</th>
							<th>Gold Nhận</th>
							<th>Tình Trạng</th>
							<th>Thời gian</th>
							<th>Thao Tác</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{/* row 1 */}
						{userBetLog?.map((userBet) => {
							const {
								amount,
								isEnd,
								receive,
								server,
								uid,
								createdAt = new Date(),
								betId,
								_id,
							} = userBet;
							const result = userBet.result;
							let resultBet = userBet.resultBet?.split('-');
							const shortUID = shortenString(uid, 4, 3);
							let new_result =
								result in TranslateKey ? TranslateKey[`${result}`] : result;
							let new_resultBet =
								resultBet[0] in TranslateKey
									? TranslateKey[`${resultBet[0]}`]
									: resultBet[0];
							let new_resultBet_concat = [new_resultBet, resultBet[1]].join(
								'-',
							);
							return (
								<tr
									className="hover"
									key={userBet._id}>
									<td>{server.replace('-mini', ' Sao')}</td>
									<td>
										{uid === user?._id
											? user?.name ?? user?.username
											: shortUID}
									</td>
									<td>{new Intl.NumberFormat('vi').format(amount)}</td>
									<td>{new_result}</td>
									<td>{new_resultBet_concat}</td>
									<td>{new Intl.NumberFormat('vi').format(receive)}</td>
									<td>
										{isEnd && receive > 0 ? (
											'Đã Thanh Toán'
										) : !isEnd ? (
											<span className="loading loading-dots loading-sm"></span>
										) : (
											'Đã Thua'
										)}
									</td>
									<td>{moment(createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
									<td>
										{isEnd ? (
											''
										) : (
											<button
												className="btn btn-error btn-sm"
												onClick={() =>
													handleCancelUserBet(uid, betId, _id, server)
												}>
												Hủy
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="flex flex-row justify-between w-full">
				<div className="flex flex-row items-center gap-2">
					<p className="text-nowrap">Hiển Thị:</p>
					<select
						defaultValue={'all'}
						className="select select-bordered w-full">
						<option value={'all'}>Tất cả</option>
						<option value={'only'}>Chỉ mình tôi</option>
					</select>
				</div>
				<div className="flex flex-row items-center gap-2">
					<p className="text-nowrap">Dòng:</p>
					<select
						defaultValue={'10'}
						className="select select-bordered w-full"
						onChange={(e) => changeRowTable(e.target.value)}>
						<option value={'10'}>10</option>
						<option value={'25'}>25</option>
						<option value={'50'}>50</option>
					</select>
				</div>
			</div>
		</div>
	);
}

function shortenString(str: string, startLength: number, endLength: number) {
	if (str.length <= startLength + endLength) {
		return str; // Trả về chuỗi gốc nếu nó ngắn hơn hoặc bằng tổng chiều dài của phần đầu và phần cuối
	}

	const start = str.substring(0, startLength);
	const end = str.substring(str.length - endLength, str.length);
	return `${start}...${end}`;
}
