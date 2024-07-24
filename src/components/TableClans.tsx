import React from 'react';

export default function TableClans() {
	return (
		<div className="overflow-x-auto">
			<table className="table table-lg table-zebra">
				{/* head */}
				<thead className="bg-accent text-sm text-white text-center">
					<tr>
						<th>TOP</th>
						<th>Bang Hội</th>
						<th>Thành Viên</th>
						<th>Gold</th>
						<th>Phần Thưởng/Người</th>
					</tr>
				</thead>
				<tbody className="text-sm text-center">
					{/* row 1 */}
					<tr className="hover">
						<th>1</th>
						<td>Bugs Ở Đâu</td>
						<td>249,000,000</td>
						<td>25/25</td>
						<td>1000tr</td>
					</tr>
					{/* row 2 */}
					<tr className="hover">
						<th>2</th>
						<td>Job Dm</td>
						<td>149,000,000</td>
						<td>15/25</td>
						<td>500tr</td>
					</tr>
					{/* row 3 */}
					<tr className="hover">
						<th>3</th>
						<td>Đau Lưng, Mỏi Gối</td>
						<td>109,000,000</td>
						<td>1/25</td>
						<td>100tr</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
