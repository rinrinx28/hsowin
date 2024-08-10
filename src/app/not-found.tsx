import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
	return (
		<div className="min-h-screen body">
			<div className="noise"></div>
			<div className="overlay"></div>
			<div className="terminal">
				<h1>
					Error <span className="errorcode">404</span>
				</h1>
				<p className="output">
					Trang bạn đang tìm kiếm có thể đã bị xóa, đã đổi tên hoặc tạm thời
					không khả dụng.
				</p>
				<p className="output">
					Hãy thử{' '}
					<Link
						href="/"
						className="text-white">
						[trở về trang chủ]
					</Link>
				</p>
				<p className="output">Chúc may mắn.</p>
			</div>
		</div>
	);
}
