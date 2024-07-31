'use client';
import React, { useEffect, useRef } from 'react';
import Send from './icons/send';
import Chat from './icons/chat';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useSocket } from '@/lib/socket';
import { updateMsgOne } from '@/lib/redux/features/logs/messageLog';

export default function ChatBox() {
	const user = useAppSelector((state) => state.user);
	const messageLog = useAppSelector((state) => state.messageLog);
	const userGame = useAppSelector((state) => state.userGame);
	const socket = useSocket();
	const chatEndRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useAppDispatch();

	const handlerBetUser = () => {
		if (!user.isLogin) {
			const modal = document.getElementById(
				'my_modal_1',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
	};

	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
		}
	}, [messageLog]);

	useEffect(() => {
		//TODO ———————————————[Handle event noti]———————————————
		socket.on('noti-bet', (data) => {
			dispatch(updateMsgOne(data));
		});

		return () => {
			socket.off('noti-bet');
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
				className="overflow-auto max-h-[950px] bg-base-200 h-full rounded-lg p-4"
				ref={chatEndRef}>
				{messageLog
					?.filter((i) => i.server === userGame)
					?.map((msg, i) => {
						const { uid, content, username } = msg;
						return (
							<div
								className="chat chat-start"
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
								<div className="chat-header">{username ?? 'Hệ thống'}</div>
								<div className="chat-bubble text-sm chat-bubble-primary">
									{content}
								</div>
							</div>
						);
					})}
			</div>
			<div className="flex flex-row w-full py-2 gap-2">
				<input
					type="text"
					className="grow w-full input input-bordered"
					placeholder="Nhập nội dung trò chuyện"
				/>
				<button
					onClick={handlerBetUser}
					className="btn  btn-outline">
					<Send />
				</button>
			</div>
			<dialog
				id="my_modal_1"
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
		</div>
	);
}
