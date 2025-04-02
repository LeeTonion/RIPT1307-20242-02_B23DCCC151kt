import component from '@/locales/en-US/component';
import { UnorderedListOutlined } from '@ant-design/icons';

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	{
		path: '/gamenumber',
		name: 'GameNumber',
		component: './GameNumber',
		icon: '🎲',
	},

	{
		path: '/oan-tu-ti',
		name: 'OanTuTi',
		component: './OanTuTi',
		icon: '🎲',
	},
	{
		path: '/MonHoc',
		name: 'MonHoc',
		component: './MônHọc',
		icon: '🎲',
	},
	{
		path: '/Danhgiadichvu',
		name: 'Danhgiadichvu',
		component: './Danhgiadichvu',
		icon: '🎲',
	},
	{
		path: '/QuanlykhoahocOnline',
		name: 'QuanlykhoahocOnline',
		component: './QuanlykhoahocOnline',	
		icon: '🎲',
	},
	{
		path: '/QuanlySoVanBang',
		name: 'QuanlySoVanBang',
		component: './QuanlySoVanBang',
		icon: '🎲',
	},
	{
		path: '/Cauhinhbieumauvanbang',
		name: 'Cauhinhbieumauvanbang',
		component: './Cauhinhbieumauvanbang',
		icon: '🎲',
	},

	
	

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/todo-list',
		name: 'todoList',
		icon: 'UnorderedListOutlined',
		component: './TodoList',
	},
	{
		component: './exception/404',
	},
];
