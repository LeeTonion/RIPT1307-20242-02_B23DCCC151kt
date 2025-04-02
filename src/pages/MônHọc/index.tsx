import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Modal, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Course {
	id: number;
	code: string;
	name: string;
	credits: number;
	knowledgeBlocks: string[];
}

const CourseManager: React.FC = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [newCourse, setNewCourse] = useState<Course>({ id: 0, code: '', name: '', credits: 0, knowledgeBlocks: [] });
	const [addModalVisible, setAddModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course | null>(null);
	const [newKnowledgeBlock, setNewKnowledgeBlock] = useState('');

	useEffect(() => {
		const storedCourses = localStorage.getItem('courses');
		if (storedCourses) {
			const parsedCourses = JSON.parse(storedCourses);
			setCourses(parsedCourses);
			setFilteredCourses(parsedCourses);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('courses', JSON.stringify(courses));
		setFilteredCourses(
			courses.filter(
				(c) =>
					c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					c.code.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	}, [courses, searchTerm]);

	const handleAddKnowledgeBlock = () => {
		if (newKnowledgeBlock.trim()) {
			setNewCourse((prev) => ({ ...prev, knowledgeBlocks: [...prev.knowledgeBlocks, newKnowledgeBlock.trim()] }));
			setNewKnowledgeBlock('');
		}
	};

	const handleAddKnowledgeBlockEdit = () => {
		if (newKnowledgeBlock.trim() && editingCourse) {
			setEditingCourse((prev) => ({
				...prev!,
				knowledgeBlocks: [...prev!.knowledgeBlocks, newKnowledgeBlock.trim()],
			}));
			setNewKnowledgeBlock('');
		}
	};

	const handleDeleteKnowledgeBlock = (index: number) => {
		if (editingCourse) {
			const updatedBlocks = editingCourse.knowledgeBlocks.filter((_, i) => i !== index);
			setEditingCourse({ ...editingCourse, knowledgeBlocks: updatedBlocks });
		}
	};

	const handleAddCourse = () => {
		if (!newCourse.code || !newCourse.name || newCourse.credits <= 0) {
			message.error('Vui lòng nhập đầy đủ thông tin hợp lệ!');
			return;
		}

		const updatedCourses = [...courses, { ...newCourse, id: Date.now() }];
		setCourses(updatedCourses);
		setNewCourse({ id: 0, code: '', name: '', credits: 0, knowledgeBlocks: [] });
		setAddModalVisible(false);
		message.success('Đã thêm môn học!');
	};

	const handleEditCourse = (course: Course) => {
		setEditingCourse(course);
		setEditModalVisible(true);
	};

	const handleUpdateCourse = () => {
		if (!editingCourse) return;

		setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? editingCourse : c)));
		setEditModalVisible(false);
		setEditingCourse(null);
		setNewKnowledgeBlock(''); // Reset newKnowledgeBlock khi đóng modal
		message.success('Đã cập nhật môn học!');
	};

	const handleDeleteCourse = (id: number) => {
		const updatedCourses = courses.filter((c) => c.id !== id);
		setCourses(updatedCourses);
		message.success('Đã xóa môn học!');
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>Quản lý Môn Học</h2>
			<Input
				placeholder='Tìm kiếm theo mã hoặc tên'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ marginBottom: 16 }}
			/>
			<Button type='primary' onClick={() => setAddModalVisible(true)} style={{ marginBottom: 16 }}>
				<PlusOutlined /> Thêm Môn Học
			</Button>
			<Table
				dataSource={filteredCourses}
				columns={[
					{ title: 'Mã Môn', dataIndex: 'code', key: 'code' },
					{ title: 'Tên Môn', dataIndex: 'name', key: 'name' },
					{ title: 'Số Tín Chỉ', dataIndex: 'credits', key: 'credits' },
					{
						title: 'Khối Kiến Thức',
						dataIndex: 'knowledgeBlocks',
						key: 'knowledgeBlocks',
						render: (blocks: string[]) => blocks.map((block, index) => <Tag key={index}>{block}</Tag>),
					},
					{
						title: 'Hành động',
						key: 'actions',
						render: (_, record) => (
							<>
								<Button icon={<EditOutlined />} onClick={() => handleEditCourse(record)} style={{ marginRight: 8 }} />
								<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => handleDeleteCourse(record.id)}>
									<Button icon={<DeleteOutlined />} danger />
								</Popconfirm>
							</>
						),
					},
				]}
				rowKey='id'
			/>
			{/* Modal Thêm Môn Học */}
			<Modal
				title='Thêm Môn Học'
				open={addModalVisible}
				onOk={handleAddCourse}
				onCancel={() => setAddModalVisible(false)}
			>
				<Input
					placeholder='Mã Môn'
					value={newCourse.code}
					onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
					style={{ marginBottom: 8 }}
				/>
				<Input
					placeholder='Tên Môn'
					value={newCourse.name}
					onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
					style={{ marginBottom: 8 }}
				/>
				<Input
					type='number'
					placeholder='Số Tín Chỉ'
					value={newCourse.credits}
					onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
					style={{ marginBottom: 8 }}
				/>
				<div style={{ display: 'flex', gap: '8px', marginBottom: 8 }}>
					<Input
						placeholder='Thêm Khối Kiến Thức'
						value={newKnowledgeBlock}
						onChange={(e) => setNewKnowledgeBlock(e.target.value)}
					/>
					<Button onClick={handleAddKnowledgeBlock}>Thêm</Button>
				</div>
				<div>
					{newCourse.knowledgeBlocks.map((block, index) => (
						<Tag
							key={index}
							closable
							onClose={() =>
								setNewCourse({
									...newCourse,
									knowledgeBlocks: newCourse.knowledgeBlocks.filter((_, i) => i !== index),
								})
							}
						>
							{block}
						</Tag>
					))}
				</div>
			</Modal>
			{/* Modal Chỉnh Sửa Môn Học */}
			<Modal
				title='Chỉnh Sửa Môn Học'
				open={editModalVisible}
				onOk={handleUpdateCourse}
				onCancel={() => setEditModalVisible(false)}
			>
				{editingCourse && (
					<>
						<Input
							placeholder='Mã Môn'
							value={editingCourse.code}
							onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
							style={{ marginBottom: 8 }}
						/>
						<Input
							placeholder='Tên Môn'
							value={editingCourse.name}
							onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
							style={{ marginBottom: 8 }}
						/>
						<Input
							type='number'
							placeholder='Số Tín Chỉ'
							value={editingCourse.credits}
							onChange={(e) => setEditingCourse({ ...editingCourse, credits: Number(e.target.value) })}
							style={{ marginBottom: 8 }}
						/>

						<div style={{ display: 'flex', gap: '8px', marginBottom: 10 }}>
							<Input
								placeholder='Thêm Khối Kiến Thức'
								value={newKnowledgeBlock}
								onChange={(e) => setNewKnowledgeBlock(e.target.value)}
							/>
							<Button onClick={handleAddKnowledgeBlockEdit}>Thêm</Button>
						</div>
						<div style={{}}>
							{editingCourse.knowledgeBlocks.map((block, index) => (
								<Tag key={index} closable onClose={() => handleDeleteKnowledgeBlock(index)}>
									{block}
								</Tag>
							))}
						</div>
					</>
				)}
			</Modal>
		</div>
	);
};

export default CourseManager;
