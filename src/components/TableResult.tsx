'use client';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import apiClient from '@/lib/apiClient';
import { updateAll } from '@/lib/redux/features/logs/userBetLog';
import { TranslateKey } from '@/lib/unit/translateKey';
import { useSocket } from '@/lib/socket';
import { updateUser } from '@/lib/redux/features/auth/user';

export default function TableResult() {
	const socket = useSocket();
	const userGame = useAppSelector((state) => state.userGame);
	const userBetLog = useAppSelector((state) => state.userBetLog);
	const user = useAppSelector((state) => state.user);
	const [showType, setShow] = useState<string>(userGame ?? 'all');
	const dispatch = useAppDispatch();
	const [msg, setMsg] = useState('');

	const changeRowTable = async (value: any) => {
		try {
			const res = await apiClient.get(
				`/user/log-bet/all?limit=${value}&server=${userGame}`,
			);
			const data = res.data;
			dispatch(updateAll(data?.data));
		} catch (err) {}
	};

	const showDialogCancelUserBet = (uid: any) => {
		if (uid !== user._id) return;

		const modal = document.getElementById(
			'error_bet_2',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
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

	useEffect(() => {
		socket.on('bet-user-del-boss-re', (data) => {
			if (data?.status) {
				if (data?.data?.user?._id === user?._id) {
					showMessageTable(data?.message);
					dispatch(updateUser({ ...user, ...data?.data?.user }));
				}
				if (data?.server === userGame) {
					dispatch(
						updateAll([
							...userBetLog.filter((bet) => bet._id !== data?.data?.userBetId),
						]),
					);
				}
			} else {
				if (data?.data?.uid === user?._id) {
					showMessageTable(data?.message);
				}
			}
		});

		socket.on('bet-user-del-sv-re', (data) => {
			if (data?.status) {
				if (data?.data?.user?._id === user?._id) {
					showMessageTable(data?.message);
					dispatch(updateUser({ ...user, ...data?.data?.user }));
				}
				if (data?.server === userGame) {
					dispatch(
						updateAll([
							...userBetLog.filter((bet) => bet._id !== data?.data?.userBetId),
						]),
					);
				}
			} else {
				if (data?.data?.uid === user?._id) {
					showMessageTable(data?.message);
				}
			}
		});

		return () => {
			socket.off('bet-user-del-boss-re');
			socket.off('bet-user-del-sv-re');
		};
	}, [dispatch, socket, user, userBetLog, userGame]);

	useEffect(() => {
		const changeTable = async (server: any) => {
			try {
				const res = await apiClient.get(
					`/user/log-bet/all?limit=10&server=${server}`,
				);
				const data = res.data;
				dispatch(updateAll(data?.data));
			} catch (err) {}
		};
		if (userGame) {
			changeTable(userGame);
			setShow(userGame);
		}
	}, [userGame, dispatch]);

	function showMessageTable(message: any) {
		const modal = document.getElementById(
			'error_bet_table',
		) as HTMLDialogElement | null;
		if (modal) {
			setMsg(message);
			modal.showModal();
		}
	}

	return (
		<div className="lg:flex lg:flex-col grid">
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
						{userBetLog
							?.filter((userBet) =>
								showType === 'all'
									? userBet
									: showType === 'only'
									? userBet.uid === user?._id
									: userBet,
							)
							?.map((userBet) => {
								const {
									amount,
									isEnd,
									receive,
									server,
									uid,
									createdAt = new Date(),
									betId,
									_id,
									name,
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
												: name ?? shortUID}
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
										<td>{moment(createdAt).format('DD/MM/YYYY')}</td>
										<td>
											{uid !== user?._id ? (
												''
											) : !isEnd ? (
												<>
													<button
														className="btn btn-error btn-sm"
														onClick={() => showDialogCancelUserBet(uid)}>
														Hủy
													</button>
													<dialog
														id="error_bet_2"
														className="modal">
														<div className="modal-box">
															<h3 className="font-bold text-lg">
																Thông Báo Người Chơi
															</h3>
															<p className="py-4">
																Bạn có muốn hủy ván cược này hay không?
															</p>
															<div className="modal-action">
																<form
																	method="dialog"
																	className="flex flex-row gap-2">
																	<button
																		className="btn"
																		onClick={() =>
																			handleCancelUserBet(
																				uid,
																				betId,
																				_id,
																				server,
																			)
																		}>
																		Có
																	</button>
																	<button className="btn">Không</button>
																</form>
															</div>
														</div>
													</dialog>
												</>
											) : (
												''
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
						value={showType}
						onChange={(e) => setShow(e.target.value)}
						className="select select-bordered w-full">
						{[
							{ name: 'Tất cả', value: 'all' },
							{ name: 'Chỉ mình tôi', value: 'only' },
						].map((type, i) => {
							return (
								<option
									value={type.value}
									key={`${i}-showtype`}>
									{type.name}
								</option>
							);
						})}
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
			<dialog
				id="error_bet_table"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">{msg}</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
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
