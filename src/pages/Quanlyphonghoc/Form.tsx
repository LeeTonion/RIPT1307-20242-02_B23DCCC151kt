import React from 'react';
import { Form, Input, Select, Space, Tag } from 'antd';
import { AuditOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { Classroom, RoomType, RESPONSIBLE_PERSONS, roomTypeColors } from '@/services/room/typing';

interface ClassroomFormProps {
  form: any; // Form instance from parent
  initialValues: Partial<Classroom> | null;
  onFinish: (values: Classroom) => void;
  isEditing: boolean;
}

const ClassroomForm: React.FC<ClassroomFormProps> = ({ 
  form, 
  initialValues, 
  onFinish, 
  isEditing 
}) => {
  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      initialValues={initialValues || { capacity: 30, type: 'Theory' }}
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
          disabled={isEditing} 
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
  );
};

export default ClassroomForm;