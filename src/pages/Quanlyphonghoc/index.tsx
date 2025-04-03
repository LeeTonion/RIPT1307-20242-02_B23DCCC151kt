import React, { useState, useCallback, useMemo } from 'react';
import {
  Table, Button, Input, Select, Form, Modal, message,
  Card, Row, Col, Typography, Divider, Space, Badge, Tag
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  TeamOutlined, BookOutlined, AuditOutlined, SortAscendingOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import './index.css'; // Import file CSS riêng

// Định nghĩa kiểu dữ liệu và enum
enum RoomType {
  Theory = 'Lý thuyết',
  Practice = 'Thực hành',
  Hall = 'Hội trường',
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  responsiblePerson: string;
}

const RESPONSIBLE_PERSONS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
const STORAGE_KEY = 'classrooms';

// Map room type to colors for tags
const roomTypeColors = {
  [RoomType.Theory]: 'blue',
  [RoomType.Practice]: 'green',
  [RoomType.Hall]: 'purple',
};

// Service functions
const getClassrooms = (): Classroom[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveClassrooms = (classrooms: Classroom[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms));
};

// Define Statistic component
interface StatisticProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
}

const Statistic: React.FC<StatisticProps> = ({ title, value, prefix }) => {
  return (
    <div className="statistic">
      <Typography.Text type="secondary">{title}</Typography.Text>
      <div className="statistic-value">
        {prefix && <span className="statistic-prefix">{prefix}</span>}
        <Typography.Title level={4} className="statistic-number">
          {value}
        </Typography.Title>
      </div>
    </div>
  );
};

// Component chính
const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(getClassrooms());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterPerson, setFilterPerson] = useState<string | undefined>(undefined);
  const { Title, Text } = Typography;

  // Thêm phòng học
  const addClassroom = (values: Classroom) => {
    const newClassroom = { ...values, capacity: Number(values.capacity) };
    const newData = [...classrooms, newClassroom];
    saveClassrooms(newData);
    setClassrooms(newData);
    message.success({
      content: 'Thêm phòng học thành công',
      icon: <PlusOutlined className="message-icon success" />
    });
    form.resetFields();
    setIsModalVisible(false);
  };

  // Sửa phòng học
  const updateClassroom = (id: string, values: Omit<Classroom, 'id'>) => {
    const newData = classrooms.map((room) => 
      room.id === id ? { ...values, id, capacity: Number(values.capacity) } : room
    );
    saveClassrooms(newData);
    setClassrooms(newData);
    message.success({
      content: 'Cập nhật phòng học thành công',
      icon: <EditOutlined className="message-icon primary" />
    });
    form.resetFields();
    setIsModalVisible(false);
    setEditingClassroom(null);
  };

  // Xóa phòng học
  const deleteClassroom = (id: string) => {
    const classroom = classrooms.find((room) => room.id === id);
    if (classroom && classroom.capacity >= 30) {
      message.error({
        content: 'Chỉ có thể xóa phòng dưới 30 chỗ ngồi',
        icon: <DeleteOutlined className="message-icon error" />
      });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa phòng học này?',
      icon: <DeleteOutlined className="modal-icon error" />,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const newData = classrooms.filter((room) => room.id !== id);
        saveClassrooms(newData);
        setClassrooms(newData);
        message.success('Xóa phòng học thành công');
      },
    });
  };

  // Xử lý submit form
  const handleSubmit = (values: Classroom) => {
    const isDuplicateId = classrooms.some(
      (room) => room.id === values.id && room.id !== (editingClassroom?.id || ''),
    );
    const isDuplicateName = classrooms.some(
      (room) => room.name === values.name && room.id !== (editingClassroom?.id || ''),
    );
    if (isDuplicateId) {
      message.error('Mã phòng đã tồn tại');
      return;
    }
    if (isDuplicateName) {
      message.error('Tên phòng đã tồn tại');
      return;
    }
    if (editingClassroom) {
      updateClassroom(editingClassroom.id, values);
    } else {
      addClassroom(values);
    }
  };

  // Lọc và tìm kiếm dữ liệu
  const filteredData = useMemo(() => {
    let result = [...classrooms];
    if (searchText) {
      result = result.filter(
        (room) =>
          room.id.toLowerCase().includes(searchText.toLowerCase()) ||
          room.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    if (filterType) {
      result = result.filter((room) => room.type === filterType);
    }
    if (filterPerson) {
      result = result.filter((room) => room.responsiblePerson === filterPerson);
    }
    return result.sort((a, b) => a.capacity - b.capacity);
  }, [classrooms, searchText, filterType, filterPerson]);

  // Cột của bảng
  const columns: ColumnsType<Classroom> = [
    { 
      title: 'Mã phòng', 
      dataIndex: 'id', 
      key: 'id',
      align: 'center',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Tên phòng', 
      dataIndex: 'name', 
      key: 'name',
      align: 'center',
      render: (text) => <Text>{text}</Text>
    },
    { 
      title: 'Số chỗ ngồi', 
      dataIndex: 'capacity', 
      key: 'capacity',
      align: 'center',
      render: (value) => (
        <Badge 
          count={value} 
          showZero 
          className={`capacity-badge ${value < 50 ? 'low' : value < 100 ? 'medium' : 'high'}`}
        />
      ),
      sorter: (a, b) => a.capacity - b.capacity,
    },
    { 
      title: 'Loại phòng', 
      dataIndex: 'type', 
      key: 'type',
      align: 'center',
      render: (type) => (
        <Tag color={roomTypeColors[type as RoomType]}>{type}</Tag>
      )
    },
    { 
      title: 'Người phụ trách', 
      dataIndex: 'responsiblePerson', 
      key: 'responsiblePerson',
      align: 'center',
      render: (person) => (
        <span>
          <TeamOutlined className="responsible-icon" />
          {person}
        </span>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingClassroom(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => deleteClassroom(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Hiển thị số liệu thống kê
  const statistics = useMemo(() => {
    const totalRooms = classrooms.length;
    const totalCapacity = classrooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
    const roomsByType = Object.values(RoomType).reduce(
      (acc, type) => {
        acc[type] = classrooms.filter(room => room.type === type).length;
        return acc;
      },
      {} as Record<string, number>
    );
    return { totalRooms, totalCapacity: isNaN(totalCapacity) ? 0 : totalCapacity, roomsByType };
  }, [classrooms]);

  return (
    <div className="container">
      <Card className="card">
        <Title level={2} className="title">
          <BookOutlined className="title-icon" />
          Quản lý phòng học
        </Title>
        
        <Row gutter={16} className="stats-row">
          <Col xs={24} md={8}>
            <Card size="small" className="stat-card">
              <Statistic 
                title="Tổng số phòng" 
                value={statistics.totalRooms} 
                prefix={<AuditOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" className="stat-card">
              <Statistic 
                title="Tổng số chỗ ngồi" 
                value={statistics.totalCapacity} 
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" className="stat-card">
              <div>
                <Text type="secondary">Phân loại phòng:</Text>
                <div className="room-type-tags">
                  {Object.entries(statistics.roomsByType).map(([type, count]) => (
                    <Tag 
                      color={roomTypeColors[type as RoomType]} 
                      key={type}
                      className="room-type-tag"
                    >
                      {type}: {count}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider className="divider" />
        
        <div className="filter-section">
          <Row gutter={16}>
            <Col xs={24} md={6} className="filter-col">
              <Input
                placeholder="Tìm kiếm theo mã hoặc tên phòng"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} md={5} className="filter-col">
              <Select
                placeholder="Lọc theo loại phòng"
                allowClear
                onChange={(value) => setFilterType(value)}
                className="filter-select"
              >
                {Object.values(RoomType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={5} className="filter-col">
              <Select
                placeholder="Lọc theo người phụ trách"
                allowClear
                onChange={(value) => setFilterPerson(value)}
                className="filter-select"
              >
                {RESPONSIBLE_PERSONS.map((person) => (
                  <Select.Option key={person} value={person}>
                    {person}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8} className="filter-col action-buttons">
              <Space>
                <Button 
                  icon={<SortAscendingOutlined />}
                  onClick={() => {
                    setClassrooms([...classrooms].sort((a, b) => a.capacity - b.capacity));
                  }}
                >
                  Sắp xếp theo chỗ ngồi
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingClassroom(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                >
                  Thêm phòng học
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          bordered
          size="middle"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} phòng học` 
          }}
          rowClassName={(record) => {
            if (record.capacity < 30) return 'ant-table-row-small-capacity';
            if (record.capacity > 100) return 'ant-table-row-large-capacity';
            return '';
          }}
        />
      </Card>

      {/* Modal thêm/sửa */}
      <Modal
        title={
          <span className="modal-title">
            {editingClassroom ? <EditOutlined /> : <PlusOutlined />}
            {editingClassroom ? 'Sửa phòng học' : 'Thêm phòng học'}
          </span>
        }
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingClassroom(null);
          form.resetFields();
        }}
        okText={editingClassroom ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        onOk={() => form.submit()}
        maskClosable={false}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={editingClassroom || { capacity: 30, type: RoomType.Theory }}
        >
          <Form.Item
            name="id"
            label="Mã phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập mã phòng' },
              { max: 10, message: 'Tối đa 10 ký tự' },
            ]}
          >
            <Input 
              disabled={!!editingClassroom} 
              prefix={<AuditOutlined className="input-icon" />}
              placeholder="VD: A101, B202"
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng' },
              { max: 50, message: 'Tối đa 50 ký tự' },
            ]}
          >
            <Input 
              placeholder="VD: Phòng học A101"
              prefix={<BookOutlined className="input-icon" />}
            />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Số chỗ ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
              {
                validator: (_, value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue < 10 || numValue > 200) {
                    return Promise.reject(new Error('Số chỗ ngồi phải từ 10 đến 200'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input 
              type="number" 
              min={10} 
              max={200} 
              step={1}
              prefix={<TeamOutlined className="input-icon" />}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
          >
            <Select>
              {Object.values(RoomType).map((type) => (
                <Select.Option key={type} value={type}>
                  <Tag color={roomTypeColors[type]}>{type}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="responsiblePerson"
            label="Người phụ trách"
            rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
          >
            <Select>
              {RESPONSIBLE_PERSONS.map((person) => (
                <Select.Option key={person} value={person}>
                  <Space>
                    <TeamOutlined />
                    {person}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassroomManagement;