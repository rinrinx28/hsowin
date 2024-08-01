'use client';
import React, { useEffect, useRef, useState } from 'react';
import Send from './icons/send';
import Chat from './icons/chat';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useSocket } from '@/lib/socket';
import { updateMsgOne } from '@/lib/redux/features/logs/messageLog';

interface ChatBox {
	server: string;
	token: string;
	content: string;
}

export default function ChatBox() {
	const user = useAppSelector((state) => state.user);
	const messageLog = useAppSelector((state) => state.messageLog);
	const userGame = useAppSelector((state) => state.userGame);
	const [chat, setChat] = useState<ChatBox | any>(null);
	const socket = useSocket();
	const chatEndRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useAppDispatch();

	const handlerChatUser = () => {
		if (!user.isLogin) {
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
		socket.emit('message-user', chat);
		setChat((e: any) => ({ ...e, content: '' }));
		let inputE = document.getElementById('chat-input-id') as HTMLInputElement;
		inputE.value = '';
	};

	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
		}
	}, [messageLog]);

	useEffect(() => {
		if (user) {
			setChat({ server: userGame, content: '', token: user?.token ?? '' });
		}
	}, [userGame, user]);

	useEffect(() => {
		//TODO ———————————————[Handle event noti]———————————————
		socket.on('noti-bet', (data) => {
			dispatch(updateMsgOne(data));
		});

		socket.on('message-user-re', (data) => {
			if (data?.status) {
				dispatch(updateMsgOne(data?.msg));
			}
		});

		return () => {
			socket.off('noti-bet');
			socket.off('message-user-re');
		};
	}, [dispatch, socket]);

	return (
		<div className="lg:col-start-2 lg:row-start-1 row-span-5 bg-base-100 flex flex-col justify-between gap-2 border border-current shadow-xl p-4 rounded-2xl">
			<div className="flex flex-col gap-2 w-full border-b border-current">
				<div className="flex flex-row items-center justify-center gap-2">
					<Chat />
					<h2 className="text-center font-semibold text-2xl">Trò Chuyện</h2>
				</div>
			</div>
			<div
				className="overflow-auto h-[950px] bg-base-200 rounded-lg p-4"
				ref={chatEndRef}>
				{messageLog
					?.filter((i) => i.server === userGame)
					?.map((msg, i) => {
						const { uid, content, username } = msg;
						return (
							<div
								className={`chat ${
									uid === user?._id ? 'chat-end' : 'chat-start'
								}`}
								key={`${i}-msg-log`}>
								{uid === '' ? (
									<div className="chat-image avatar">
										<div className="avatar online  placeholder">
											<div className="bg-neutral text-neutral-content w-12 rounded-full">
												<span className="text-sm">BOT</span>
											</div>
										</div>
									</div>
								) : (
									<div className="chat-image avatar">
										<div className="avatar online  placeholder">
											<div className="bg-neutral text-neutral-content w-12 rounded-full"></div>
										</div>
									</div>
								)}
								<div className="chat-header">
									{uid === user?._id ? 'Bạn' : username ?? 'Hệ Thống'}
								</div>
								<div className="chat-bubble text-sm chat-bubble-primary">
									{content}
								</div>
							</div>
						);
					})}
			</div>
			<div className="flex flex-row w-full py-2 gap-2">
				<input
					id="chat-input-id"
					type="text"
					className="grow w-full input input-bordered"
					placeholder="Nhập nội dung trò chuyện"
					defaultValue={chat?.content}
					onChange={(e) =>
						setChat((c: ChatBox | any) => ({ ...c, content: e.target.value }))
					}
				/>
				<button
					onClick={handlerChatUser}
					className="btn  btn-outline">
					<Send />
				</button>
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
					<p className="py-4">Xin vui lòng nhập tin nhắn</p>
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
