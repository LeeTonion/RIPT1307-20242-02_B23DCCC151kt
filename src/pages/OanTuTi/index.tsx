import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Row, Col, List, Space, Modal, Statistic, Tooltip } from 'antd';
import { TrophyOutlined, FireOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { Countdown } = Statistic;

// Định nghĩa kiểu dữ liệu
type Choice = 'Kéo' | 'Búa' | 'Bao';
type GameResult = 'Hòa' | 'Người chơi thắng' | 'Máy tính thắng';

interface HistoryItem {
	playerChoice: Choice;
	computerChoice: Choice;
	result: GameResult;
}

const OanTuTi: React.FC = () => {
	const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
	const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
	const [result, setResult] = useState<GameResult | null>(null);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [score, setScore] = useState({ player: 0, computer: 0 });
	const [gameStreak, setGameStreak] = useState(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [countdown, setCountdown] = useState(5);

	const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

	// Chọn ngẫu nhiên của máy tính
	const computerSelect = (): Choice => {
		return choices[Math.floor(Math.random() * 3)];
	};

	// Xác định người chiến thắng
	const determineWinner = (player: Choice, computer: Choice): GameResult => {
		if (player === computer) return 'Hòa';
		if (
			(player === 'Kéo' && computer === 'Bao') ||
			(player === 'Búa' && computer === 'Kéo') ||
			(player === 'Bao' && computer === 'Búa')
		) {
			return 'Người chơi thắng';
		}
		return 'Máy tính thắng';
	};

	// Chọn và so sánh
	const playGame = (choice: Choice) => {
		const computer = computerSelect();
		const gameResult = determineWinner(choice, computer);

		setPlayerChoice(choice);
		setComputerChoice(computer);
		setResult(gameResult);

		// Cập nhật điểm số
		if (gameResult === 'Người chơi thắng') {
			setScore((prev) => ({ ...prev, player: prev.player + 1 }));
			setGameStreak((prev) => prev + 1);
		} else if (gameResult === 'Máy tính thắng') {
			setScore((prev) => ({ ...prev, computer: prev.computer + 1 }));
			setGameStreak(0);
		}

		// Lưu lịch sử
		setHistory((prevHistory) => [
			{
				playerChoice: choice,
				computerChoice: computer,
				result: gameResult,
			},
			...prevHistory.slice(0, 9), // Giới hạn lịch sử 10 lượt
		]);

		// Kiểm tra kết thúc game
		if (score.player >= 5 || score.computer >= 5) {
			setModalVisible(true);
			setCountdown(5);
		}
	};

	// Bắt đầu lại trò chơi
	const resetGame = () => {
		setScore({ player: 0, computer: 0 });
		setHistory([]);
		setModalVisible(false);
		setGameStreak(0);
	};

	// Đếm ngược và tự động đóng modal
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (modalVisible && countdown > 0) {
			timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
		} else if (countdown === 0) {
			resetGame();
		}
		return () => clearTimeout(timer);
	}, [modalVisible, countdown]);

	// Icon tương ứng với lựa chọn
	const getIcon = (choice: Choice) => {
		switch (choice) {
			case 'Kéo':
				return <span>✌</span>;
			case 'Búa':
				return <span>👊</span>;
			case 'Bao':
				return <span>✋</span>;
		}
	};

	// Màu sắc kết quả
	const getResultColor = (gameResult: GameResult) => {
		switch (gameResult) {
			case 'Người chơi thắng':
				return 'green';
			case 'Máy tính thắng':
				return 'red';
			default:
				return 'gray';
		}
	};

	return (
		<>
			<Card
				title='Trò chơi Oẳn Tù Tì'
				extra={
					<Space>
						<Tooltip title='Điểm số'>
							<TrophyOutlined /> {score.player} - {score.computer}
						</Tooltip>
						{gameStreak > 2 && (
							<Tooltip title='Chuỗi chiến thắng'>
								<FireOutlined style={{ color: 'orange' }} /> {gameStreak}
							</Tooltip>
						)}
					</Space>
				}
				style={{ maxWidth: 600, margin: '0 auto' }}
			>
				<Space direction='vertical' size='large' style={{ width: '100%' }}>
					{/* Các nút chọn */}
					<Row gutter={16} justify='center'>
						{choices.map((choice) => (
							<Col key={choice} span={8}>
								<Tooltip title={choice}>
									<Button type='primary' icon={getIcon(choice)} size='large' block onClick={() => playGame(choice)}>
										{choice}
									</Button>
								</Tooltip>
							</Col>
						))}
					</Row>

					{/* Kết quả trò chơi */}
					{playerChoice && computerChoice && result && (
						<Card
							title='Kết quả'
							extra={
								<Text strong style={{ color: getResultColor(result) }}>
									{result}
								</Text>
							}
						>
							<Row gutter={16}>
								<Col span={12} style={{ textAlign: 'center' }}>
									<Text>Lựa chọn của bạn</Text>
									<div style={{ fontSize: 48, marginBottom: 8 }}>{getIcon(playerChoice)}</div>
									<Text strong>{playerChoice}</Text>
								</Col>
								<Col span={12} style={{ textAlign: 'center' }}>
									<Text>Lựa chọn của máy</Text>
									<div style={{ fontSize: 48, marginBottom: 8 }}>{getIcon(computerChoice)}</div>
									<Text strong>{computerChoice}</Text>
								</Col>
							</Row>
						</Card>
					)}

					{/* Lịch sử trò chơi */}
					<Card title='Lịch sử'>
						<List
							dataSource={history}
							renderItem={(item, index) => (
								<List.Item key={index}>
									<List.Item.Meta
										title={`Lượt ${index + 1}: Bạn ${item.playerChoice} - Máy ${item.computerChoice}`}
										description={<Text style={{ color: getResultColor(item.result) }}>Kết quả: {item.result}</Text>}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Space>
			</Card>

			{/* Modal kết thúc trò chơi */}
			<Modal title='Kết quả trò chơi' open={modalVisible} footer={null} closable={false}>
				<div style={{ textAlign: 'center' }}>
					<Title level={2}>{score.player >= 5 ? 'Bạn chiến thắng!' : 'Máy tính chiến thắng!'}</Title>
					<div style={{ fontSize: 48, marginBottom: 16 }}>{score.player >= 5 ? '🏆' : '🤖'}</div>
					<Text>
						Điểm số cuối: Bạn {score.player} - {score.computer} Máy
					</Text>
					<div style={{ marginTop: 16 }}>
						<Text>Trò chơi mới sẽ bắt đầu sau </Text>
						<Countdown
							value={Date.now() + countdown * 1000}
							format='ss'
							valueStyle={{ color: 'red', fontWeight: 'bold' }}
						/>
						<Text> giây</Text>
					</div>
					<Button type='primary' onClick={resetGame} style={{ marginTop: 16 }}>
						Chơi lại ngay
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default OanTuTi;
