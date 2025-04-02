import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import { BookOutlined, FileTextOutlined, QuestionCircleOutlined, FileAddOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AppLayout: React.FC = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item key="1" icon={<BookOutlined />}>
            <Link to="/subjects">Môn học</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<QuestionCircleOutlined />}>
            <Link to="/questions">Câu hỏi</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileAddOutlined />}>
            <Link to="/exam-create">Tạo đề thi</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<FileTextOutlined />}>
            <Link to="/exams">Đề thi</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#1890ff', padding: 0 }}>
          <h1 style={{ color: '#fff', textAlign: 'center', margin: 0 }}>Hệ thống Quản lý Ngân hàng Câu hỏi</h1>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 10 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;