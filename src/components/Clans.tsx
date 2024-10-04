'use client';
import apiClient from '@/lib/apiClient';
import { clanState } from '@/lib/redux/features/rank/clanRanks';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { GiFamilyHouse, GiMedievalPavilion } from 'react-icons/gi';
import Gold from './icons/gold';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { updateUser, userState } from '@/lib/redux/features/auth/user';
import moment from 'moment';
import { FaUsers } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import Chat from './icons/chat';
import { ChatBox } from './Chat';
import Send from './icons/send';
import { useSocket } from '@/lib/socket';
import { MdOutlineEdit } from 'react-icons/md';
import { RxAvatar } from 'react-icons/rx';
import { updatelistClans } from '@/lib/redux/features/logs/listClans';

interface Info {
	name?: string;
	type?: number;
	description?: string;
}

type View =
	| 'members'
	| 'penning'
	| 'chat-clan'
	| 'change-description'
	| 'change-type';

type Pening = 'acpect' | 'decline';

function Clans() {
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const messageClan = useAppSelector((state) => state.messageClan);
	const userRanks = useAppSelector((state) => state.userRanks);
	const clans = useAppSelector((state) => state.listClans);
	const user = useAppSelector((state) => state.user);
	const [channelClan, setChannelClan] = useState<Array<any>>();
	const [type, setType] = useState<number[]>();
	const [price, setPrice] = useState<number[]>();
	const [filter, setFilter] = useState<string>();
	const [info, setInfo] = useState<Info>();
	const [limit, setLimit] = useState<number>();
	const [clanInfo, setClanInfo] = useState<clanState | null>(null);
	const [view, setView] = useState<View>('members');
	const [penning, setPenning] = useState<userState[]>();
	const [dataPen, setDataPen] = useState<any[]>();
	const [targetView, setTargetView] = useState<userState>();
	const [myClan, setMyClan] = useState<string | null>(null);
	const [chat, setChat] = useState<ChatBox | any>(null);
	const [changeType, setChangeType] = useState<number | null>(null);
	const [changeDes, setChangeDes] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const socket = useSocket();

	const [noti, setNote] = useState<string>('');

	//TODO ———————————————[Handler Open Clans List]———————————————
	const showClansInfo = () => {
		const modal = document.getElementById(
			'clan-info',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const closeClansInfo = () => {
		const modal = document.getElementById(
			'clan-info',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	};

	//TODO ———————————————[Handler Open Clan Info]———————————————
	const showUserClan = () => {
		const modal = document.getElementById(
			'clan-info-user',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const closeUserClan = () => {
		const modal = document.getElementById(
			'clan-info-user',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	};

	//TODO ———————————————[Handler Clan Error]———————————————
	const showClanError = (message: string) => {
		const modal = document.getElementById(
			'clan-error',
		) as HTMLDialogElement | null;
		setNote(message);
		if (modal) {
			modal.showModal();
		}
	};

	//TODO ———————————————[Handler Clan Owner View]———————————————
	const showClanOwnerView = () => {
		const modal = document.getElementById(
			'clan-info-user-owner-view',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const closeClanOwnerView = () => {
		const modal = document.getElementById(
			'clan-info-user-owner-view',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	};

	//TODO ———————————————[Handler Open Create Clans]———————————————
	const showCreatelansInfo = () => {
		const modal = document.getElementById(
			'clan-create',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const closeCreateClansInfo = () => {
		const modal = document.getElementById(
			'clan-create',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	};

	//TODO ———————————————[Handler Open Delete Clans]———————————————
	const showDeleteClan = () => {
		const modal = document.getElementById(
			'clan-delete-user-owner-view-form-delete',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const closeDeleteClan = () => {
		const modal = document.getElementById(
			'clan-delete-user-owner-view-form-delete',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	};

	//TODO ———————————————[Handler Open Leave Clans]———————————————
	const showLeaveClan = () => {
		const modal = document.getElementById(
			'clan-Leave-user-owner-view-form-Leave',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const closeLeaveClan = () => {
		const modal = document.getElementById(
			'clan-Leave-user-owner-view-form-Leave',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.close();
		}
	};

	//TODO ———————————————[Handler Create & Info Clans]———————————————

	const handlerCreateClans = async () => {
		try {
			if (!user.isLogin) throw new Error('Xin vui lòng đăng nhập!');
			if (!info) throw new Error('Xin vui lòng điền thông tin bang hội!');
			const { type, name } = info;
			if (!name) throw new Error('Xin vui lòng điền tên Bang Hội!');
			if (!type) throw new Error('Xin vui lòng chọn loại biểu tượng Bang Hội!');
			const res = await apiClient.post(
				'/user/clans/create',
				{
					clanName: name,
					typeClan: type.toString(),
					ownerId: user._id,
					descriptions: info.description ?? '',
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);

			const { status, data, message } = res.data;
			if (!status || status === 400) throw new Error(message);

			let clan = data[0];
			// Update new clans list;
			let new_clans_list = clans?.filter((c) => c._id !== clan._id);

			dispatch(updatelistClans([...(new_clans_list ?? []), clan]));
			dispatch(updateUser({ ...user, ...data[1] }));
			closeCreateClansInfo();
		} catch (err: any) {}
	};

	//TODO ———————————————[Handler Penning Clans]———————————————
	const handlerGetPeningClans = async (id: string) => {
		try {
			const res = await apiClient.get(`/user/clans/pening/list/${id}`, {
				headers: {
					Authorization: 'Bearer ' + user.token,
				},
			});

			const { status, message, data } = res.data;
			if (!status) throw new Error(message);
			if (data) {
				setPenning(data.users);
				setDataPen(data.penings);
			}
		} catch (err: any) {}
	};

	const handlerPenningClans = async (type: Pening, userId: any) => {
		try {
			const target_pen = dataPen?.find((p: any) => p?.userId === userId);
			if (!target_pen) throw new Error('Đơn xin gia nhập không tồn tại!');
			const { _id, clanId } = target_pen;
			const res = await apiClient.post(
				`/user/clans/pening/${type}`,
				{
					id: _id,
					clanId: clanId,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);
			const { status, data } = res.data;
			if (!status || status === 400)
				throw new Error('Đơn bạn duyệt đã xảy ra lỗi!');
			// Update current penning list
			let new_penning = penning?.filter((p) => p._id !== userId);
			let new_data_pen = dataPen?.filter((p: any) => p.userId !== userId);

			if (data) {
				// Update current clan info
				let old_clans_info = clanInfo ?? {};
				let new_members = [...(old_clans_info?.members ?? []), { ...data[1] }];
				let new_clans_info = { ...old_clans_info };
				new_clans_info.members = new_members;

				// Update new clans list;
				let new_clans_list = clans?.filter((c) => c._id !== new_clans_info._id);

				// func update state;
				setClanInfo(new_clans_info);
				dispatch(updatelistClans([...(new_clans_list ?? []), data[0]]));
			}
			setPenning(new_penning);
			setDataPen(new_data_pen);
		} catch (err: any) {}
	};

	//TODO ———————————————[Handler Clan Member Target]———————————————
	const handlerViewMember = async (userId: any) => {
		showClanOwnerView();
		const target = clanInfo?.members?.find((m) => m._id === userId);
		if (!target) return showClanError('Đã xảy ra lỗi, xin vui lòng thử lại!');
		setTargetView(target);
	};

	//TODO ———————————————[Handler Clan of Owner]———————————————
	const handlerClanDelete = async () => {
		try {
			const res = await apiClient.post(
				'/user/clans/delete',
				{
					uid: user._id,
					clanId: clanInfo?._id,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);
			const { status, message, data } = res.data;

			if (!status || status === 400) throw new Error(message);
			let new_clans = clans?.filter((c) => c._id !== clanInfo?._id);
			dispatch(updatelistClans(new_clans));
			closeDeleteClan();
			closeUserClan();
			dispatch(updateUser({ ...user, ...data }));
			setClanInfo(null);
		} catch (err: any) {
			showClanError(err.message);
			return;
		}
	};

	const handlerClanKick = async () => {
		try {
			const res = await apiClient.post(
				'/user/clans/kick',
				{
					clanId: clanInfo?._id,
					userId: targetView?._id,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);
			const { status, data, message } = res.data;
			if (!status || status === 400) throw new Error(message);
			closeClanOwnerView();
			let new_clans = clans?.filter((c) => c._id !== data._id) ?? [];
			dispatch(updatelistClans([...new_clans, data]));
		} catch (err: any) {
			showClanError(err.message);
			return;
		}
	};

	//TODO ———————————————[Handler User Clan]———————————————
	const handlerLeaveClan = async () => {
		try {
			const res = await apiClient.post(
				'/user/clans/leave',
				{
					uid: user._id,
					clanId: clanInfo?._id,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);
			const { status, data, message } = res.data;
			if (!status || status === 400) throw new Error(message);
			let new_clans = clans?.filter((c) => c._id !== clanInfo?._id) ?? [];

			setClanInfo(null);
			dispatch(updatelistClans([...new_clans, data[0]]));
			dispatch(updateUser({ ...user, ...data[1] }));

			// Close Dialog
			closeUserClan();
		} catch (err: any) {
			showClanError(err.message);
			return;
		}
	};

	const handlerJoinClan = async (clanId: any) => {
		try {
			const res = await apiClient.post(
				'/user/clans/join',
				{
					uid: user._id,
					clanId: clanId,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);
			const { status, data, message } = res.data;
			if (!status || status === 400) throw new Error(message);
			showClanError(message);
		} catch (err: any) {
			showClanError(err.message);
			return;
		}
	};

	//TODO ———————————————[Handler Get Info Target Clan]———————————————
	const handlerGetInfoClanTarget = async (id: string) => {
		try {
			const res = await apiClient.get(`/user/clans/info/${id}`);
			setClanInfo(res.data);
			closeClansInfo();
			showUserClan();
		} catch (err: any) {
			console.log(err);
		}
	};

	//TODO ———————————————[Handler Chat Clan]———————————————
	const handlerChatUser = () => {
		if (!user?.isLogin) {
			const modal = document.getElementById(
				'auth_chat',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
		if (!chat?.content || chat?.content.length < 1) {
			const modal = document.getElementById(
				'error_chat',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
		if (!JSON.parse(user.clan ?? '{}').clanId) {
			const modal = document.getElementById(
				'error_chat_clan',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
		socket.emit('message-clan', chat);
		let inputE = document.getElementById(
			'chat-input-id-clan-pops',
		) as HTMLInputElement;
		inputE.value = '';
		setChat((e: any) => ({ ...e, content: '' }));
		return;
	};

	//TODO ———————————————[Handler Update Clan]———————————————
	const handlerUpdateClan = async (type: 'des' | 'type') => {
		try {
			const res = await apiClient.post(
				'/user/clans/update',
				{
					type,
					clanId: myClan,
					data: type === 'des' ? changeDes : changeType,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);
			const { status, message }: { status?: number; message?: string } =
				res.data;
			if (status && status === 400) throw new Error(message);
			if (res.data.clan && res.data.clan._id === myClan) {
				setClanInfo((e) => ({ ...e, ...res.data.clan }));
			}
			if (res.data.user !== null && res.data.user._id === user._id) {
				dispatch(updateUser({ ...user, ...res.data.user }));
			}
			setView('members');
			setChangeDes(null);
			setChangeType(null);
		} catch (err: any) {
			showClanError(err.message);
		}
	};

	useEffect(() => {
		if (eventConfig) {
			const e_clans_type = eventConfig.find((e) => e.name === 'e-clans-type');
			const e_clans_price = eventConfig.find((e) => e.name === 'e-clans-price');
			const e_clans_members_limit = eventConfig.find(
				(e) => e.name === 'e-clans-limit-members',
			);

			const clans_type = JSON.parse(e_clans_type?.option ?? `[1,2]`) ?? [1, 2];
			const clans_price = JSON.parse(e_clans_price?.option ?? '[500,5000]') ?? [
				500, 5000,
			];
			const clans_members_limit = e_clans_members_limit?.value ?? 10;

			setType(clans_type);
			setPrice(clans_price);
			setLimit(clans_members_limit);
		}
	}, [eventConfig]);

	useEffect(() => {
		const getTargetMyClan = async (id: string) => {
			const res = await apiClient.get(`/user/clans/info/${id}`);
			setClanInfo(res.data);
		};
		if (user.isLogin) {
			let clan = JSON.parse(user.clan ?? '');
			if ('clanId' in clan) {
				setMyClan(clan['clanId']);
				getTargetMyClan(clan['clanId'] ?? '');
			} else {
				setMyClan(null);
			}
		}
	}, [user]);

	useEffect(() => {
		if (messageClan && user.isLogin && JSON.parse(user.clan ?? '{}').clanId) {
			const main_server = messageClan.filter(
				(m) => m.server === JSON.parse(user.clan ?? '{}').clanId,
			);

			let new_main_server = main_server;
			let new_channel = [];
			for (const msg of new_main_server) {
				if (new_channel.length >= 10) {
					new_channel.shift(); // Removes the oldest message if the array exceeds 10 messages
				}
				new_channel.push(msg);
			}
			setChannelClan(new_channel);
		} else {
			setChannelClan(undefined);
		}
	}, [messageClan, user, dispatch]);

	useEffect(() => {
		const getInfoClans = async () => {
			try {
				const res = await apiClient.get('/user/clans');
				const data = res.data;
				dispatch(updatelistClans(data));
			} catch (err: any) {
				console.log(err.message);
			}
		};
		getInfoClans();
	}, [dispatch]);

	useEffect(() => {
		// Update Clan All
		socket.on('clan-update', (data: clanState) => {
			dispatch(
				updatelistClans([
					...(clans?.filter((c) => c._id !== data._id) ?? []),
					data,
				]),
			);
			if (myClan === data._id) {
				setClanInfo(data);
			}
		});

		// Update Clan if acpect penning
		socket.on(
			'clan-notice',
			(data: { uid: string; clanId: string; user: any }) => {
				if (user.isLogin) {
					if (data.uid === user._id) {
						dispatch(updateUser({ ...user, ...data.user }));
					}
				}
			},
		);

		// Update Clan Kick User
		socket.on(
			'clan-kick',
			(data: { uid: string; clanId: string; user: any }) => {
				if (user.isLogin) {
					if (data.uid === user._id) {
						dispatch(updateUser({ ...user, ...data.user }));
					}
				}
			},
		);

		// Delete Clan
		socket.on('clan-delete', (data: string) => {
			dispatch(
				updatelistClans([...(clans?.filter((c) => c._id !== data) ?? [])]),
			);
			if (myClan === data) {
				setClanInfo(null);
				setMyClan(null);
				dispatch(updateUser({ ...user, clan: '{}' }));
			}
		});

		return () => {
			socket.off('clan-update');
			socket.off('clan-notice');
			socket.off('clan-kick');
			socket.off('clan-delete');
		};
	}, [socket, user, myClan, clans, dispatch]);

	return (
		<div className="fixed bottom-5 left-5 flex flex-col items-center justify-center bg-transparent gap-4 z-[1000]">
			<button
				onClick={() => {
					if (myClan) {
						handlerGetInfoClanTarget(myClan);
						setView('members');
					} else {
						showClansInfo();
					}
				}}
				className="bg-base-200 rounded-full p-4 hover:scale-110 hover:duration-300 drop-shadow-xl flex flex-row items-center justify-center gap-2">
				{myClan && (
					<>
						<Image
							alt={`myclan-b${clanInfo?.typeClan}-logo`}
							src={`image/banghoi/b${clanInfo?.typeClan}.gif`}
							width={24}
							height={24}
						/>
						{clanInfo?.clanName}
					</>
				)}
				{!myClan && (
					<>
						<GiMedievalPavilion size={34} />
						Bang Hội
					</>
				)}
			</button>
			{/* List Clans */}
			{!myClan && (
				<dialog
					id="clan-info"
					className="modal">
					<div className="modal-box">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
								✕
							</button>
						</form>
						<h3 className="font-bold text-lg">Bang Hội Cái Bang</h3>
						<div className="py-4 flex flex-col w-full justify-center items-center gap-4">
							<div className="flex lg:flex-row flex-col gap-2 items-center justify-center">
								{myClan && (
									<button
										onClick={() => {
											handlerGetInfoClanTarget(myClan);
										}}
										className="btn btn-success btn-outline">
										<GiFamilyHouse />
										Bang Hội
									</button>
								)}
								{!myClan && (
									<button
										onClick={() => {
											if (!user.isLogin) {
												showClanError('Xin vui lòng đăng nhập!');
												return;
											}
											showCreatelansInfo();
										}}
										className="btn btn-success btn-outline">
										<GiFamilyHouse />
										Tạo Hội
									</button>
								)}
								<label className="input input-bordered input-info flex items-center gap-2">
									<input
										type="text"
										className="grow"
										placeholder="Tìm Hội"
										defaultValue={filter ?? ''}
										onChange={(e: any) => {
											setFilter(e.target.value);
										}}
									/>
									<CiSearch />
								</label>
							</div>
							<div className="flex flex-col w-full items-center max-h-[600px] overflow-auto">
								{clans.length > 0 &&
									clans
										?.filter((c) => c.clanName?.includes(filter ?? ''))
										.map((c, i) => {
											return (
												<div
													key={c._id}
													className="flex flex-row w-full gap-2 border border-current p-2 rounded-md">
													<div
														className="avatar border-r-2 border-current cursor-pointer"
														onClick={() => {
															handlerGetInfoClanTarget(c._id ?? '');
														}}>
														<div className="w-24 rounded-xl">
															<Image
																alt={`${i}-b${c.typeClan}-logo`}
																src={`image/banghoi/b${c.typeClan}.gif`}
																width={52}
																height={24}
															/>
														</div>
													</div>
													<div className="w-full flex flex-col items-center justify-start p-2">
														<div className="flex flex-row w-full justify-between items-center">
															<p className="font-semibold">{c.clanName}</p>
															<p>
																({c.member}/{limit ?? 10})
															</p>
														</div>
														<p className="text-info text-sm text-start w-full">
															{c?.descriptions ?? 'Hí Anh Em ơi!'}
														</p>
														{!myClan && (
															<div className="flex flex-row">
																<button
																	onClick={() => {
																		if (!user.isLogin) {
																			showClanError('Xin vui lòng đăng nhập!');
																			return;
																		}
																		handlerJoinClan(c._id);
																	}}
																	className="btn btn-success btn-sm">
																	Xin gia nhập
																</button>
															</div>
														)}
													</div>
												</div>
											);
										})}
							</div>
						</div>
					</div>
				</dialog>
			)}
			{/* Create Clans */}
			<dialog
				id="clan-create"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Tạo Bang Hội</h3>
					<div className="py-4 flex flex-col w-full justify-center items-center gap-4">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handlerCreateClans();
							}}
							className="flex flex-col gap-4 items-center justify-start">
							<label className="input input-bordered flex items-center gap-2">
								<GiFamilyHouse />
								<input
									type="text"
									className="grow"
									placeholder="Tên Hội"
									onChange={(e: any) => {
										setInfo((i) => ({ ...i, name: e.target.value }));
									}}
								/>
							</label>
							<label className="form-control w-full max-w-xs">
								<div className="label">
									<p className="label-text">Chọn Biểu Tượng Hội</p>
									{info?.type && (
										<div className="label-text-alt">
											<div className="avatar">
												<div className="w-8 rounded-xl">
													<Image
														alt={`b${info.type}-select`}
														src={`image/banghoi/b${info.type}.gif`}
														width={52}
														height={24}
													/>
												</div>
											</div>
										</div>
									)}
								</div>
								<select
									onChange={(e: any) => {
										setInfo((i) => ({
											...i,
											type: parseInt(e.target.value, 10),
										}));
									}}
									className="select select-bordered">
									<option
										disabled
										selected>
										Pick one
									</option>
									{type &&
										type.map((t, i) => {
											return (
												<option
													value={t}
													key={i}>
													Loại {t}
												</option>
											);
										})}
								</select>
							</label>
							<label className="form-control w-full max-w-xs">
								<div className="label">
									<span className="label-text">Chi Phí tạo hội</span>
								</div>
								<div className="input input-bordered flex items-center gap-2">
									<Gold />
									<input
										type="text"
										className="grow"
										disabled
										value={info?.type && price && price[info.type - 1]}
									/>
								</div>
							</label>
							<label className="form-control w-full max-w-xs">
								<div className="label">
									<span className="label-text">Giới thiệu Hội</span>
								</div>

								<textarea
									className="textarea textarea-bordered"
									placeholder="Nhập giới thiệu hội"
									onChange={(e: any) => {
										setInfo((i) => ({ ...i, description: e.target.value }));
									}}></textarea>
							</label>
							<div className="flex flex-row gap-2 w-full justify-between items-center">
								<button
									type="submit"
									className="btn btn-success">
									Tạo Bang Hội
								</button>
								<button
									onClick={closeCreateClansInfo}
									type="button"
									className="btn btn-error">
									Thoát
								</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>
			{/* Clan Info */}
			<dialog
				id="clan-info-user"
				className="modal">
				<div className="modal-box sm:w-11/12 sm:max-w-3xl">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<div className="w-full flex flex-row justify-between items-center px-4">
						<h3 className="font-bold text-lg flex flex-col">
							Bang Hội - {clanInfo?.clanName}
							<span className="text-sm text-secondary-content">
								{clanInfo?.descriptions}
							</span>
						</h3>
						<h3 className="font-bold text-sm flex flex-col">
							Rank{' '}
							{clans.length > 0 &&
								clans
									?.slice() // Cloning the array
									.sort(
										(a: any, b: any) => (b?.totalBet ?? 1) - (a?.totalBet ?? 0),
									)
									.findIndex((c) => c?._id === myClan) + 1}
							<span className="text-xs text-secondary-content">
								Thành tích: {clanInfo?.totalBet}
							</span>
						</h3>
					</div>
					<div className="py-4 flex flex-col w-full justify-center items-center gap-4">
						{clanInfo?.ownerId === user._id && (
							<div className="flex flex-row gap-2 item-start w-full">
								<div className="flex flex-wrap gap-2 items-center justify-start">
									<button
										onClick={() => {
											setView('members');
										}}
										className="btn btn-success btn-outline btn-sm">
										<FaUsers />
										Thành viên
									</button>
									<button
										onClick={() => {
											setView('change-description');
										}}
										className="btn btn-success btn-outline btn-sm">
										<MdOutlineEdit />
										Đổi Giới Thiệu
									</button>
									<button
										onClick={() => {
											setView('change-type');
										}}
										className="btn btn-success btn-outline btn-sm">
										<RxAvatar />
										Đổi Biểu Tượng
									</button>
									<button
										onClick={() => {
											setView('chat-clan');
										}}
										className="btn btn-success btn-outline btn-sm">
										<Chat />
										Trò Chuyện
									</button>
									<button
										onClick={() => {
											setView('penning');
											handlerGetPeningClans(clanInfo?._id ?? '');
										}}
										className="btn btn-success btn-outline btn-sm">
										<GiFamilyHouse />
										Đơn Gia Nhập
									</button>
									<button
										onClick={() => {
											showDeleteClan();
										}}
										className="btn btn-error btn-outline btn-sm">
										<HiOutlineLogout />
										Xoá Bang Hội
									</button>
								</div>
							</div>
						)}
						{clanInfo?.ownerId !== user._id &&
							clanInfo?.members?.find((m) => m._id === user._id) && (
								<div className="flex lg:flex-row flex-wrap gap-2 items-center justify-start w-full">
									<button
										onClick={() => {
											setView('members');
										}}
										className="btn btn-success btn-outline btn-sm">
										<FaUsers />
										Thành viên
									</button>
									<button
										onClick={() => {
											setView('chat-clan');
										}}
										className="btn btn-success btn-outline btn-sm">
										Trò Chuyện
									</button>
									<button
										onClick={() => {
											showLeaveClan();
										}}
										className="btn btn-error btn-outline btn-sm">
										<HiOutlineLogout />
										Rời Bang Hội
									</button>
								</div>
							)}
						{!JSON.parse(user?.clan ?? '{}').clanId && (
							<div className="flex flex-row">
								<button
									onClick={() => {
										if (!user.isLogin) {
											showClanError('Xin vui lòng đăng nhập!');
											return;
										}
										handlerJoinClan(clanInfo?._id);
									}}
									className="btn btn-success btn-sm">
									Xin gia nhập
								</button>
							</div>
						)}
						{view === 'members' && (
							<div className="flex flex-col w-full">
								<p className="w-full text-end">
									Thành viên {clanInfo?.members?.length ?? 0}/{limit ?? 10}
								</p>
								<hr className="w-full h-[0.2rem] bg-base-300 rounded-lg" />
							</div>
						)}

						<div className="flex flex-col w-full items-center justify-start max-h-[600px] overflow-auto gap-2">
							{view === 'members' &&
								clanInfo &&
								clanInfo.members?.map((m) => {
									return (
										<MemberClan
											key={m._id}
											user={m}
											isOwner={m._id === clanInfo.ownerId}
											isOwverView={clanInfo.ownerId === user._id}
											func={handlerViewMember}
										/>
									);
								})}
							{view === 'penning' &&
								penning &&
								penning.map((p) => {
									return (
										<MemberClan
											key={p._id}
											user={p}
											isPening={true}
											func={handlerPenningClans}
										/>
									);
								})}
							{view === 'chat-clan' && (
								<>
									<div className="overflow-auto h-[350px] bg-base-100 rounded-lg custom-an-border w-full">
										{channelClan &&
											channelClan?.map((msg, i) => {
												const { uid, content, username } = msg;
												const avatarUrl = msg?.meta
													? JSON.parse(msg.meta)?.avatar
													: null;
												const vip = msg?.meta ? JSON.parse(msg?.meta)?.vip : 0;
												return (
													<div
														className={`chat ${
															uid === user?._id ? 'chat-end' : 'chat-start'
														}`}
														key={`${i}-msg-log`}>
														{uid === '' ? (
															<div className="chat-image avatar">
																<div className="avatar online  placeholder">
																	<div
																		className="bg-neutral text-neutral-content w-12 rounded-full bg-cover"
																		style={{
																			backgroundImage: `url("/image/avatar/Arcade_Miss_Fortune_profileicon.webp")`,
																		}}></div>
																</div>
															</div>
														) : (
															<div className="chat-image avatar">
																<div className="avatar online placeholder">
																	<div
																		className="bg-neutral text-neutral-content w-12 rounded-full bg-cover"
																		style={{
																			backgroundImage: avatarUrl
																				? `url("/image/avatar/${avatarUrl}.webp")`
																				: 'none',
																		}}></div>
																</div>
															</div>
														)}
														<div className="chat-header">
															<div
																className={`flex ${
																	uid === user?._id
																		? 'flex-row-reverse'
																		: 'flex-row'
																} gap-2 items-center`}>
																{uid === user?._id
																	? 'Bạn'
																	: username ?? 'Hệ Thống'}
																{vip > 0 && (
																	<p className="fire font-extrabold text-red-500">
																		VIP {vip}
																	</p>
																)}
																{userRanks &&
																	userRanks.map((u, index) => {
																		if (uid === u._id) {
																			return (
																				<div
																					key={`${u._id}-chat-header-rank`}
																					className="tooltip"
																					data-tip={`Khứa này top ${
																						index + 1
																					}`}>
																					<Image
																						src={`/image/rank/${index + 1}.png`}
																						width={32}
																						height={32}
																						alt={`${index + 1}_user_rank_image`}
																						priority={true}
																					/>
																				</div>
																			);
																		}
																	})}
															</div>
														</div>
														<div className="chat-bubble text-sm chat-bubble-primary">
															{content}
														</div>
													</div>
												);
											})}
									</div>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											handlerChatUser();
										}}
										className="flex flex-row w-full py-2 gap-2 items-center">
										<input
											id="chat-input-id-clan-pops"
											type="text"
											className="grow w-full input input-bordered text-wrap"
											placeholder="Nhập nội dung trò chuyện"
											defaultValue={chat?.content}
											onChange={(e) =>
												setChat((c: ChatBox | any) => ({
													...c,
													content: e.target.value,
													server: JSON.parse(user?.clan ?? '{}').clanId ?? null,
													token: user.token,
												}))
											}
										/>
										<button
											type="submit"
											className="btn btn-outline">
											<Send />
										</button>
									</form>
								</>
							)}
							{view === 'change-description' && (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										handlerUpdateClan('des');
									}}
									className="flex flex-col w-full gap-2">
									<label className="form-control">
										<div className="label">
											<span className="label-text">Giới Thiệu</span>
										</div>
										<textarea
											className="textarea textarea-bordered h-24"
											placeholder="Giới thiệu"
											onChange={(e) => setChangeDes(e.target.value)}
											defaultValue={clanInfo?.descriptions ?? ''}></textarea>
									</label>
									<button
										type="submit"
										className="btn btn-success btn-sm">
										Lưu
									</button>
								</form>
							)}
							{view === 'change-type' && (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										handlerUpdateClan('type');
									}}
									className="flex flex-col w-full gap-4">
									<label className="form-control w-full">
										<div className="label">
											<span className="label-text">Loại Biểu Tượng</span>
											<div className="label-text-alt">
												<div className="avatar">
													<div className="w-8 rounded-xl">
														<Image
															alt={`b${
																changeType ?? clanInfo?.typeClan
															}-select`}
															src={`image/banghoi/b${
																changeType ?? clanInfo?.typeClan
															}.gif`}
															width={52}
															height={24}
														/>
													</div>
												</div>
											</div>
										</div>
										<select
											onChange={(e: any) => {
												setChangeType(parseInt(e.target.value, 10));
											}}
											className="select select-bordered">
											<option disabled>Pick one</option>
											{type &&
												type.map((t, i) => {
													return (
														<option
															value={`${t}`}
															selected={`${t}` === `${clanInfo?.typeClan}`}
															disabled={`${t}` === `${clanInfo?.typeClan}`}
															key={i}>
															Loại {t}
														</option>
													);
												})}
										</select>
									</label>
									<label className="form-control w-full">
										<div className="label">
											<span className="label-text">Chi Phí tạo hội</span>
										</div>
										<div className="input input-bordered flex items-center gap-2">
											<Gold />
											<input
												type="text"
												className="grow"
												disabled
												value={
													price &&
													price[
														(changeType ??
															parseInt(clanInfo?.typeClan ?? '0')) - 1
													]
												}
											/>
										</div>
									</label>
									<button
										type="submit"
										disabled={!changeType}
										className="btn btn-success btn-sm">
										Lưu
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</dialog>
			{/* Clans Noti */}
			<dialog
				id="clan-error"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Bang Hội - Thông Báo</h3>
					<div className="py-4 flex flex-col w-full justify-center items-center gap-4">
						{noti}
					</div>
				</div>
			</dialog>
			{/* Owner View  */}
			<dialog
				id="clan-info-user-owner-view"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Bang Hội - Thành viên</h3>
					{targetView && (
						<div className="py-4 flex flex-col w-full justify-start items-start gap-4">
							{/* Avatar */}
							<div className="flex flex-row items-center gap-2">
								<div className="avatar">
									<div className="w-14 rounded-xl bg-current">
										{targetView.avatar && targetView.avatar?.length > 2 && (
											<Image
												src={`image/avatar/${
													targetView.avatar ?? 'Arcade_Star_profileicon'
												}.webp`}
												alt={`clan-targetView-logo-${targetView._id}`}
												width={52}
												height={24}
											/>
										)}
									</div>
								</div>
								<p>{targetView.name}</p>
							</div>
							<p>
								Số Dư:{' '}
								{new Intl.NumberFormat('vi').format(targetView.gold ?? 0)}
							</p>
							<p>
								Điểm cống hiến:{' '}
								{new Intl.NumberFormat('vi').format(targetView.totalBet ?? 0)}
							</p>
							<p>
								Ngày tham gia:{' '}
								{targetView.clan === '{}'
									? ''
									: moment(
											`${JSON.parse(targetView.clan ?? '').timejoin}`,
									  ).format('DD/MM/YYYY - HH:mm:ss')}
							</p>
							{targetView._id !== clanInfo?.ownerId &&
								user._id === clanInfo?.ownerId && (
									<button
										onClick={() => {
											handlerClanKick();
										}}
										className="btn btn-error btn-outline btn-md">
										Đuổi
									</button>
								)}
						</div>
					)}
				</div>
			</dialog>
			{/* Owner Form Delete Clan  */}
			<dialog
				id="clan-delete-user-owner-view-form-delete"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Bang Hội - Thông Báo</h3>
					<div className="py-4 flex flex-col w-full justify-start items-start gap-4">
						<h2>
							Bạn Có muốn xóa Bang Hội{' '}
							<span className="font-semibold">{clanInfo?.clanName}</span>?
						</h2>
						<div className="flex flex-row gap-2">
							<button
								onClick={() => {
									handlerClanDelete();
									closeDeleteClan();
								}}
								className="btn btn-error btn-outline">
								Xóa Bang Hội
							</button>
							<button
								onClick={() => {
									closeDeleteClan();
								}}
								className="btn btn-neutral btn-outline">
								Hủy
							</button>
						</div>
					</div>
				</div>
			</dialog>
			{/* User Form Leave Clan  */}
			<dialog
				id="clan-Leave-user-owner-view-form-Leave"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Bang Hội - Thông Báo</h3>
					<div className="py-4 flex flex-col w-full justify-start items-start gap-4">
						<h2>
							Bạn Có muốn rời Bang Hội{' '}
							<span className="font-semibold">{clanInfo?.clanName}</span>?
						</h2>
						<div className="flex flex-row gap-2">
							<button
								onClick={() => {
									closeLeaveClan();
									handlerLeaveClan();
								}}
								className="btn btn-error btn-outline">
								Rời Bang Hội
							</button>
							<button
								onClick={() => {
									closeLeaveClan();
								}}
								className="btn btn-neutral btn-outline">
								Hủy
							</button>
						</div>
					</div>
				</div>
			</dialog>
		</div>
	);
}

function MemberClan({
	user,
	isOwner,
	isPening,
	isOwverView,
	func,
}: {
	user: userState;
	isOwner?: boolean;
	isPening?: boolean;
	isOwverView?: boolean;
	func?: (...arg: any[]) => void;
}) {
	const timejoin = JSON.parse(user.clan ?? '').timejoin;
	const joinedAt = timejoin
		? moment(`${timejoin}`).format('DD/MM/YYYY - HH:mm:ss')
		: moment().format('DD/MM/YYYY - HH:mm:ss');
	const socore = new Intl.NumberFormat('vi').format(user.totalClan ?? 0);
	const balance_number = new Intl.NumberFormat('vi').format(user.gold ?? 0);
	const balance = `${balance_number}`
		.split('')
		.map((s: string, i: number) => (i < 3 ? '*' : s))
		.join('');

	const handlerfunc = (arg: Pening) => {
		if (func) {
			func(arg, user._id);
		}
	};
	return (
		<div className="flex flex-row w-full gap-2 items-center p-2 rounded-xl">
			{/* Avatar */}
			<div
				className="avatar cursor-pointer"
				onClick={() => {
					if (isOwverView) {
						if (func) {
							func(user._id);
						}
					}
				}}>
				<div className="w-14 rounded-xl bg-current">
					{user.avatar && user.avatar?.length > 2 && (
						<Image
							src={`image/avatar/${
								user.avatar ?? 'Arcade_Star_profileicon'
							}.webp`}
							alt={`clan-user-logo-${user._id}`}
							width={52}
							height={24}
						/>
					)}
				</div>
			</div>
			{/* Info */}
			<div className="flex flex-col w-full">
				{/* Name */}
				<div className="flex lg:flex-row flex-wrap justify-between items-center text-lg">
					<div className="flex flex-row items-center gap-2">
						<p className="text-primary">{user.name}</p>
						{!isPening && (
							<div
								className={`badge badge-outline badge-sm ${
									isOwner ? 'badge-neutral' : ''
								}`}>
								{isOwner ? 'Chủ hội' : 'Thành viên'}
							</div>
						)}
					</div>
					<p>
						Số dư:{' '}
						{balance.length <= 3
							? '***'
							: balance.length > 6
							? '***' + balance.slice(-3)
							: balance}
					</p>
				</div>
				{/* Info clans */}
				{!isPening && (
					<div className="flex lg:flex-row flex-wrap justify-between items-center text-sm">
						<p>Cống Hiến: {socore}</p>
						<p>Tham Gia: {joinedAt}</p>
					</div>
				)}
				{isPening && (
					<div className="flex flex-row gap-2 items-center text-sm">
						<button
							className="btn btn-success btn-sm"
							onClick={() => handlerfunc('acpect')}>
							Duyệt
						</button>
						<button
							onClick={() => handlerfunc('decline')}
							className="btn btn-error btn-sm">
							Từ chối
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Clans;
