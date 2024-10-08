'use client';
import React, { useEffect, useRef, useState } from 'react';
import Send from './icons/send';
import Chat from './icons/chat';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useSocket } from '@/lib/socket';
import Image from 'next/image';
import apiClient from '@/lib/apiClient';

export interface ChatBox {
	server: string;
	token: string;
	content: string;
}

export default function ChatBox() {
	const user = useAppSelector((state) => state.user);
	const messageLog = useAppSelector((state) => state.messageLog);
	const userGame = useAppSelector((state) => state.userGame);
	const userRanks = useAppSelector((state) => state.userRanks);
	const messageClan = useAppSelector((state) => state.messageClan);
	const clans = useAppSelector((state) => state.listClans);
	const [channel, setChannel] = useState<Array<any>>();
	const [channelClan, setChannelClan] = useState<Array<any>>();
	const [chat, setChat] = useState<ChatBox | any>(null);
	const [chatClan, setChatClan] = useState<ChatBox | any>(null);
	const socket = useSocket();
	const chatEndRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useAppDispatch();

	const handlerChatUser = (type: string) => {
		if (!user?.isLogin) {
			const modal = document.getElementById(
				'auth_chat',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
		if (type === 'user') {
			if (!chat?.content || chat?.content.length < 1) {
				const modal = document.getElementById(
					'error_chat',
				) as HTMLDialogElement | null;
				if (modal) {
					modal.showModal();
				}
				return;
			}
		} else {
			if (!chatClan?.content || chatClan?.content.length < 1) {
				const modal = document.getElementById(
					'error_chat',
				) as HTMLDialogElement | null;
				if (modal) {
					modal.showModal();
				}
				return;
			}
		}
		if (!JSON.parse(user.clan ?? '{}').clanId && type === 'clan') {
			const modal = document.getElementById(
				'error_chat_clan',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
		if (type === 'user') {
			socket.emit('message-user', chat);
			let inputE = document.getElementById(
				'chat-input-id-user',
			) as HTMLInputElement;
			inputE.value = '';
		} else {
			socket.emit('message-clan', chatClan);
			let inputE = document.getElementById(
				'chat-input-id-clan',
			) as HTMLInputElement;
			inputE.value = '';
		}
		setChat((e: any) => ({ ...e, content: '' }));
		setChatClan((e: any) => ({ ...e, content: '' }));
	};

	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
		}
	}, [messageLog]);

	useEffect(() => {
		if (userGame && user.isLogin) {
			setChat({ server: userGame, content: '', token: user?.token ?? '' });
		}
	}, [userGame, user]);

	useEffect(() => {
		if (messageLog) {
			const main_server = messageLog.filter(
				(m) => m.server === userGame || m.server === 'all',
			);

			let new_main_server = main_server;
			let new_channel = [];
			for (const msg of new_main_server) {
				if (new_channel.length >= 10) {
					new_channel.shift(); // Removes the oldest message if the array exceeds 10 messages
				}
				new_channel.push(msg);
			}
			setChannel(new_channel);
		}
	}, [messageLog, userGame, dispatch]);

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

	return (
		<div className="lg:col-start-2 lg:row-start-1 row-span-5 bg-base-100 flex flex-col justify-between gap-2 border border-current shadow-xl p-4 rounded-2xl">
			<div className="flex flex-col gap-2 w-full border-b border-current">
				<div className="flex flex-row items-center justify-center gap-2">
					<Chat />
					<h2 className="text-center font-semibold text-2xl">Trò Chuyện</h2>
				</div>
			</div>
			<div
				role="tablist"
				className="tabs tabs-bordered w-full text-nowrap tabs-lg">
				<input
					type="radio"
					name="my_tabs_1"
					role="tab"
					className="tab w-full"
					aria-label={`🎮 Server ${userGame} 🎮`}
					defaultChecked
				/>
				<div
					role="tabpanel"
					className="tab-content w-full p-4 text-wrap">
					<div
						className="overflow-auto h-[950px] bg-base-100 custom-an-border rounded-lg px-2"
						ref={chatEndRef}>
						{channel &&
							channel?.map((msg, i) => {
								const { uid, content, username } = msg;
								const avatarUrl = msg?.meta
									? JSON.parse(msg.meta)?.avatar
									: null;
								const vip = msg?.meta ? JSON.parse(msg?.meta)?.vip : 0;
								const myClan = msg?.meta ? JSON.parse(msg?.meta).clanId : null;
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
													uid === user?._id ? 'flex-row-reverse' : 'flex-row'
												} gap-2 items-center`}>
												{uid === user?._id ? 'Bạn' : username ?? 'Hệ Thống'}
												{vip > 0 && (
													<p
														className={`fire font-extrabold text-red-500 ${
															parseInt(vip, 10) > 4 && 'flicker-4'
														}`}>
														VIP {vip}
													</p>
												)}
												{myClan &&
													clans &&
													clans.map((c) => {
														if (myClan === c._id) {
															return (
																<div
																	className="tooltip"
																	key={`${c._id}-chat-header-clans-${uid}-${i}`}
																	data-tip={`${c.clanName}`}>
																	<Image
																		src={`/image/banghoi/b${c.typeClan}.gif`}
																		width={32}
																		height={32}
																		alt={`${c._id}-chat-header-clans-${uid}-${i}`}
																		priority={true}
																	/>
																</div>
															);
														}
													})}
												{userRanks &&
													userRanks.map((u, index) => {
														if (uid === u._id) {
															return (
																<div
																	key={`${u._id}-chat-header-rank`}
																	className="tooltip"
																	data-tip={`Khứa này top ${index + 1}`}>
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
							handlerChatUser('user');
						}}
						className="flex flex-row w-full py-2 gap-2 items-center">
						<input
							id="chat-input-id-user"
							type="text"
							className="grow w-full input input-bordered"
							placeholder="Nhập nội dung trò chuyện"
							defaultValue={chat?.content}
							onChange={(e) =>
								setChat((c: ChatBox | any) => ({
									...c,
									content: e.target.value,
									server: userGame,
									token: user.token,
								}))
							}
						/>
						<button
							type="submit"
							className="btn  btn-outline">
							<Send />
						</button>
					</form>
				</div>
				<input
					type="radio"
					name="my_tabs_1"
					role="tab"
					className="tab w-full"
					aria-label="⚔️ Bang Hội ⚔️"
				/>
				<div
					role="tabpanel"
					className="tab-content w-full p-4 text-wrap">
					<div
						className="overflow-auto h-[950px] bg-base-100 custom-an-border rounded-lg px-2"
						ref={chatEndRef}>
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
													uid === user?._id ? 'flex-row-reverse' : 'flex-row'
												} gap-2 items-center`}>
												{uid === user?._id ? 'Bạn' : username ?? 'Hệ Thống'}
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
																	data-tip={`Khứa này top ${index + 1}`}>
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
							handlerChatUser('clan');
						}}
						className="flex flex-row w-full py-2 gap-2 items-center">
						<input
							id="chat-input-id-clan"
							type="text"
							className="grow w-full input input-bordered text-wrap"
							placeholder="Nhập nội dung trò chuyện"
							defaultValue={chat?.content}
							onChange={(e) =>
								setChatClan((c: ChatBox | any) => ({
									...c,
									content: e.target.value,
									server: JSON.parse(user?.clan ?? '{}').clanId ?? null,
									token: user.token,
								}))
							}
						/>
						<button
							type="submit"
							className="btn  btn-outline">
							<Send />
						</button>
					</form>
				</div>
			</div>

			<dialog
				id="auth_chat"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">
						Có vẻ bạn chưa đăng nhập, xin vui lòng{' '}
						<Link
							href={'/login'}
							className="link link-hover link-primary">
							đăng nhập
						</Link>{' '}
						để tiếp tục!
					</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog
				id="error_chat"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p
						className="py-4"
						id="msg">
						Xin vui lòng nhập tin nhắn
					</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog
				id="error_chat_clan"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p
						className="py-4"
						id="msg">
						Bạn chưa tham gia Bang Hội!
					</p>
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
