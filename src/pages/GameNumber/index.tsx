import React, { useState } from 'react';
import { Input, Button, Card, Typography, Space, Alert, List } from 'antd';
import { ReloadOutlined, TrophyOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface GuessHistoryItem {
	value: number;
	isCorrect: boolean;
}

const GuessNumberGame: React.FC = () => {
	// State quản lý số bí mật, số người chơi nhập, thông báo, số lần đoán còn lại, trạng thái game và lịch sử đoán
	const [secretNumber, setSecretNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
	const [guess, setGuess] = useState<string>('');
	const [message, setMessage] = useState<string>('Hãy đoán một số từ 1 đến 100!');
	const [attempts, setAttempts] = useState<number>(10);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [history, setHistory] = useState<GuessHistoryItem[]>([]);

	// Xử lý khi người chơi nhập số và nhấn nút đoán
	const handleGuess = (): void => {
		if (gameOver) return;

		const numGuess = parseInt(guess, 10);
		if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
			setMessage('⚠️ Vui lòng nhập một số hợp lệ từ 1 đến 100!');
			return;
		}
		const newHistory: GuessHistoryItem[] = [...history, { value: numGuess, isCorrect: numGuess === secretNumber }];
		setHistory(newHistory);

		if (numGuess === secretNumber) {
			setMessage('🎉 Chúc mừng! Bạn đã đoán đúng!');
			setGameOver(true);
			return;
		}

		setAttempts(attempts - 1);
		if (attempts - 1 === 0) {
			setMessage(`❌ Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
			setGameOver(true);
			return;
		}

		setMessage(numGuess < secretNumber ? '📉 Số của bạn quá thấp!' : '📈 Số của bạn quá cao!');
		setGuess('');
	};

	// Xử lý khi người chơi muốn chơi lại từ đầu
	const handleReset = (): void => {
		setSecretNumber(Math.floor(Math.random() * 100) + 1);
		setGuess('');
		setMessage('Hãy đoán một số từ 1 đến 100!');
		setAttempts(10);
		setGameOver(false);
		setHistory([]);
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: 20,
			}}
		>
			{/* Thẻ Card chứa toàn bộ giao diện trò chơi */}
			<Card
				title={
					<Title level={2} style={{ color: '#722ed1' }}>
						Trò Chơi Đoán Số 🎲
					</Title>
				}
				style={{
					width: 600, // Điều chỉnh độ rộng của khung đoán số
					textAlign: 'center',
					boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
					borderRadius: 12,
					background: 'rgba(255, 255, 255, 0.9)',
				}}
			>
				{/* Hiển thị thông báo kết quả đoán */}
				<Alert
					message={message}
					type={message.includes('Chúc mừng') ? 'success' : message.includes('hết lượt') ? 'error' : 'info'}
					showIcon
					style={{ fontSize: 16, fontWeight: 500 }}
				/>

				<Space direction='vertical' style={{ width: '100%', marginTop: 20 }}>
					{/* Hiển thị số lượt đoán còn lại */}
					<Text strong style={{ fontSize: 18 }}>
						Lượt còn lại: <span style={{ color: '#1890ff', fontSize: 20 }}>{attempts}</span>
					</Text>

					{/* Ô nhập số đoán */}
					<Input
						type='text'
						value={guess}
						onChange={(e) => setGuess(e.target.value)}
						placeholder='Nhập số...'
						disabled={gameOver}
						style={{ height: 50, fontSize: 18, borderRadius: 8, width: '100%' }}
					/>

					{/* Nút đoán số */}
					<Button
						type='primary'
						onClick={handleGuess}
						disabled={gameOver}
						block
						style={{ height: 50, fontSize: 20, borderRadius: 8 }}
					>
						Đoán 🎲
					</Button>

					{/* Nút chơi lại */}
					<Button
						type='dashed'
						onClick={handleReset}
						block
						icon={<ReloadOutlined />}
						style={{ height: 50, fontSize: 20, borderRadius: 8 }}
					>
						Chơi lại
					</Button>
				</Space>

				{/* Hiển thị lịch sử đoán số */}
				{history.length > 0 && (
					<List
						header={
							<Title level={4} style={{ marginTop: 20 }}>
								📜 Lịch sử đoán
							</Title>
						}
						bordered
						dataSource={history}
						renderItem={(item) => (
							<List.Item
								style={{
									background: item.isCorrect ? '#d4edda' : item.value < secretNumber ? '#fff3cd' : '#f8d7da',
									fontSize: 16,
									fontWeight: 500,
									borderRadius: 6,
									margin: '4px 0',
								}}
							>
								{item.value}{' '}
								{item.isCorrect ? (
									<TrophyOutlined style={{ color: 'gold', fontSize: 18 }} />
								) : item.value < secretNumber ? (
									<ArrowUpOutlined style={{ color: 'blue', fontSize: 18 }} />
								) : (
									<ArrowDownOutlined style={{ color: 'red', fontSize: 18 }} />
								)}
							</List.Item>
						)}
					/>
				)}
			</Card>
		</div>
	);
};

export default GuessNumberGame;
