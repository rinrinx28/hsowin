'use client';
import apiClient from '@/lib/apiClient';
import { clanState } from '@/lib/redux/features/rank/clanRanks';
import Image from 'next/image';
import { ChangeEventHandler, use, useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { GiFamilyHouse, GiMedievalPavilion } from 'react-icons/gi';
import Gold from './icons/gold';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { userClan } from '@/lib/redux/features/rank/userRanks';
import { updateUser, userState } from '@/lib/redux/features/auth/user';
import moment from 'moment';
import { FaUser, FaUsers } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';

interface Info {
	name?: string;
	type?: number;
	description?: string;
}

type View = 'members' | 'penning';

type Pening = 'acpect' | 'decline';

function Clans() {
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const user = useAppSelector((state) => state.user);
	const [type, setType] = useState<number[]>();
	const [price, setPrice] = useState<number[]>();
	const [clans, setClans] = useState<clanState[]>();
	const [filter, setFilter] = useState<string>();
	const [info, setInfo] = useState<Info>();
	const [limit, setLimit] = useState<number>();
	const [clanInfo, setClanInfo] = useState<clanState>();
	const [view, setView] = useState<View>('members');
	const [penning, setPenning] = useState<userState[]>();
	const [dataPen, setDataPen] = useState<any[]>();
	const [targetView, setTargetView] = useState<userState>();
	const dispatch = useAppDispatch();

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

			setClans([...(new_clans_list ?? []), clan]);
			dispatch(updateUser({ ...user, ...data[1] }));
			closeCreateClansInfo();
		} catch (err: any) {}
	};

	const getInfoClans = async () => {
		try {
			const res = await apiClient.get('/user/clans');
			const data = res.data;
			setClans(data);
		} catch (err: any) {
			console.log(err.message);
		}
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
				setClans([...(new_clans_list ?? []), data[0]]);
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
			setClans(new_clans);
			closeDeleteClan();
			closeUserClan();
			dispatch(updateUser({ ...user, ...data }));
			setClanInfo(undefined);
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
			setClans([...new_clans, data]);
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

			setClanInfo(undefined);
			setClans([...new_clans, data[0]]);
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
		const getClanInfo = async (id: string) => {
			try {
				const res = await apiClient.get(`/user/clans/info/${id}`);
				return res.data;
			} catch (err: any) {}
		};
		if (user.isLogin && user) {
			if (user) {
				const uClan: userClan = JSON.parse(user.clan ?? '{}');
				if ('clanId' in uClan) {
					const target_clan = clans?.find((c) => c._id === uClan.clanId);
					if (target_clan) {
						getClanInfo(target_clan?._id ?? '')
							.then((res) => {
								setClanInfo({ ...target_clan, members: res });
							})
							.catch((err: any) => {});
					}
				} else {
					setClanInfo(undefined);
				}
			}
		}
	}, [user, clans]);

	return (
		<div className="fixed bottom-5 left-5 flex flex-col items-center justify-center bg-transparent gap-4 z-[1000]">
			<button
				onClick={() => {
					getInfoClans();
					showClansInfo();
				}}
				className="bg-base-200 rounded-full p-4 hover:scale-110 hover:duration-300 drop-shadow-xl flex flex-row items-center justify-center gap-2">
				<GiMedievalPavilion size={34} />
				Bang Hội
			</button>
			{/* List Clans */}
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
							{clanInfo && (
								<button
									onClick={() => {
										closeClansInfo();
										showUserClan();
									}}
									className="btn btn-success btn-outline">
									<GiFamilyHouse />
									Bang Hội
								</button>
							)}
							{!clanInfo && (
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
						<div className="flex flex-col w-full items-center justify-end max-h-[600px] overflow-auto">
							{clans &&
								clans
									?.filter((c) => c.clanName?.includes(filter ?? ''))
									.map((c, i) => {
										return (
											<div
												key={c._id}
												className="flex flex-row w-full gap-2 border border-current p-2 cursor-pointer hover:bg-base-200 hover:duration-300 rounded-md">
												<div className="avatar border-r-2 border-current">
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
													{!clanInfo && (
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
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Bang Hội - {clanInfo?.clanName}</h3>
					<div className="py-4 flex flex-col w-full justify-center items-center gap-4">
						{clanInfo?.ownerId === user._id && (
							<div className="flex flex-row gap-2 item-start w-full">
								<div className="flex lg:flex-row flex-wrap gap-2 items-center justify-center">
									<button
										onClick={() => {
											setView('members');
										}}
										className="btn btn-success btn-outline">
										<FaUsers />
										Thành viên
									</button>
									<button
										onClick={() => {
											setView('penning');
											handlerGetPeningClans(clanInfo?._id ?? '');
										}}
										className="btn btn-success btn-outline">
										<GiFamilyHouse />
										Đơn Gia Nhập
									</button>
									<button
										onClick={() => {
											showDeleteClan();
										}}
										className="btn btn-error btn-outline">
										<HiOutlineLogout />
										Xoá Bang Hội
									</button>
								</div>
							</div>
						)}
						{clanInfo?.ownerId !== user._id && (
							<div className="flex item-start w-full">
								<button
									onClick={() => {
										showLeaveClan();
									}}
									className="btn btn-error btn-outline">
									<HiOutlineLogout />
									Rời Bang Hội
								</button>
							</div>
						)}
						{view === 'members' && (
							<div className="flex flex-col w-full">
								<p className="w-full text-end">
									Thành viên {clanInfo?.member}/{limit ?? 10}
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
							<button className="btn btn-neutral btn-outline">Hủy</button>
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
							<button className="btn btn-neutral btn-outline">Hủy</button>
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
	const socore = new Intl.NumberFormat('vi').format(user.totalBet ?? 0);
	const balance_number = new Intl.NumberFormat('vi').format(user.gold ?? 0);
	const balance = `${balance_number}`
		.split('')
		.map((s: string, i: number) => (i < 2 ? '*' : s))
		.join('');

	const handlerfunc = (arg: Pening) => {
		if (func) {
			func(arg, user._id);
		}
	};
	return (
		<div
			className="flex flex-row w-full gap-2 items-center p-2 rounded-xl"
			onClick={() => {
				if (isOwverView) {
					if (func) {
						func(user._id);
					}
				}
			}}>
			{/* Avatar */}
			<div className="avatar">
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
					<p>Số dư: {balance}</p>
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
