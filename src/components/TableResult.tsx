'use client';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import apiClient from '@/lib/apiClient';
import { updateAll } from '@/lib/redux/features/logs/userBetLog';
import { TranslateKey } from '@/lib/unit/translateKey';
import { useSocket } from '@/lib/socket';
import { updateUser } from '@/lib/redux/features/auth/user';
import { RiAwardFill } from 'react-icons/ri';

interface FiellCanCel {
	uid?: string;
	betId?: string;
	userBetId?: string;
	server?: string;
}

export default function TableResult() {
	const socket = useSocket();
	const userGame = useAppSelector((state) => state.userGame);
	const userBetLog = useAppSelector((state) => state.userBetLog);
	const user = useAppSelector((state) => state.user);
	const [showType, setShow] = useState<string>('all');
	const [fieldCancel, setFieldCancel] = useState<FiellCanCel>({});
	const dispatch = useAppDispatch();
	const [msg, setMsg] = useState('');
	const [row, setRow] = useState(10);

	const changeRowTable = async (value: number) => {
		try {
			setRow(value);
		} catch (err) {}
	};

	const showDialogCancelUserBet = (uid: any) => {
		if (uid !== user?._id) return;

		const modal = document.getElementById(
			'error_bet_2',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const handleCancelUserBet = (payload: FiellCanCel) => {
		const { betId, uid, userBetId, server } = payload;
		if (uid !== user?._id) return;
		if (!uid || !betId || !userBetId) return;
		if (['1', '2', '3'].includes(server ?? '')) {
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
		const changeTable = async (server: any, row: number, showtype: any) => {
			try {
				const res = await apiClient.get(
					`/user/log-bet/all?limit=${row}&server=${server}${
						showtype === 'only' ? '&userId=' + user._id : ''
					}`,
				);
				const data = res.data;
				dispatch(updateAll(data?.data));
			} catch (err) {}
		};
		if (userGame) {
			changeTable(userGame, row, showType);
		}
	}, [userGame, dispatch, row, showType, user]);

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
		<div className="lg:flex lg:flex-col grid gap-2 w-full">
			<div className="border-current border rounded-box grid h-20 place-items-center bg-primary font-semibold ">
				<div className="flex flex-row items-center justify-center gap-2">
					<RiAwardFill size={34} /> Lịch Sử Kết Quả <RiAwardFill size={34} />
				</div>
			</div>
			<div className="overflow-auto border border-current max-h-[600px] w-full">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm  text-center">
						<tr>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <IoGameController /> Server */}
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
									Nhân Vật
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Gold className="" /> */}
									Gold Cược
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Ligh /> */}
									Dự Đoán
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Clock /> */}
									Kết Quả
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Gold className="" /> */}
									Gold Nhận
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Clock /> */}
									Tình Trạng
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <Clock /> */}
									Thời gian
								</div>
							</th>
							<th className="border border-current">
								<div className="flex flex-row items-center justify-center gap-2">
									{/* <HiOutlineCursorArrowRays /> */}
									Thao Tác
								</div>
							</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{/* row 1 */}
						{userBetLog
							?.filter((userBet) =>
								showType === 'all' ? userBet : userBet.uid === user?._id,
							)
							?.map((userBet) => {
								let {
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
								let result = userBet?.result;
								let resultBet = userBet?.resultBet?.split('-');
								let shortUID = shortenString(uid ?? '', 4, 3);
								let new_result =
									result in TranslateKey ? TranslateKey[`${result}`] : result;
								let new_resultBet = !resultBet
									? userBet?.resultBet
									: resultBet[0] in TranslateKey
									? TranslateKey[`${resultBet[0]}`]
									: resultBet[0];
								return (
									<tr
										className="hover"
										key={userBet?._id}>
										<td className="border border-current">
											{server?.replace('-mini', ' Sao')}
										</td>
										<td className="border border-current">
											{uid === user?._id
												? user?.name ?? user?.username
												: name ?? shortUID}
										</td>
										<td className="border border-current">
											{new Intl.NumberFormat('vi').format(amount ?? 0)}
										</td>
										<td className="border border-current">
											{new_result ?? result ?? ''}
										</td>
										<td className="border border-current">
											{new_resultBet &&
											!['1', '2', '3'].includes(userBet?.server)
												? `${new_resultBet}-${resultBet[1]}`
												: userBet?.resultBet === '0'
												? 'Khỉ Đỏ'
												: userBet?.resultBet === '1'
												? 'Khỉ Đen'
												: ''}
										</td>
										<td className="border border-current">
											{new Intl.NumberFormat('vi').format(receive ?? 0)}
										</td>
										<td className="border border-current">
											{isEnd && receive > 0 ? (
												'Đã Thanh Toán'
											) : !isEnd ? (
												<span className="loading loading-dots loading-sm"></span>
											) : (
												'Đã Thua'
											)}
										</td>
										<td className="border border-current">
											{moment(createdAt).format('DD/MM/YYYY')}
										</td>
										<td className="border border-current">
											{uid !== user?._id ? (
												''
											) : !isEnd ? (
												<>
													<button
														className="btn btn-error btn-sm"
														onClick={() => {
															showDialogCancelUserBet(uid);
															setFieldCancel({
																betId: betId,
																uid: uid,
																server,
																userBetId: _id,
															});
														}}>
														Hủy
													</button>
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
						defaultValue={showType}
						onChange={(e) => setShow(e.target.value)}
						className="select select-bordered w-full">
						{[
							{ name: 'Tất cả', value: 'all' },
							{ name: 'Chỉ mình tôi', value: 'only' },
						].map((type, i) => {
							return (
								<option
									value={type.value}
									selected={type.value === showType}
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
						defaultValue={row}
						className="select select-bordered w-full"
						onChange={(e) => changeRowTable(parseInt(e.target.value, 10))}>
						<option
							value={'10'}
							selected>
							10
						</option>
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
			<dialog
				id="error_bet_2"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">Bạn có muốn hủy ván cược này hay không?</p>
					<div className="modal-action">
						<form
							method="dialog"
							className="flex flex-row gap-2">
							<button
								className="btn"
								onClick={() => handleCancelUserBet(fieldCancel)}>
								Có
							</button>
							<button
								onClick={() => setFieldCancel({})}
								className="btn">
								Không
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
}

function shortenString(str: string, startLength: number, endLength: number) {
	// console.log(str);
	if (str.length <= startLength + endLength) {
		return str; // Trả về chuỗi gốc nếu nó ngắn hơn hoặc bằng tổng chiều dài của phần đầu và phần cuối
	}

	const start = str.substring(0, startLength);
	const end = str.substring(str.length - endLength, str.length);
	return `${start}...${end}`;
}
