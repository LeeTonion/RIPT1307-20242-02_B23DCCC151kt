import { Button, Form, Input } from 'antd';

interface UserFormProps {
  isEdit: boolean;
  row?: RandomUser.Record;
  onFinish: (values: any) => void;
  onCancel: () => void;
}

const UserForm = ({ isEdit, row, onFinish, onCancel }: UserFormProps) => {
  return (
    <Form onFinish={onFinish}>
      <Form.Item
        initialValue={row?.address}
        label='address'
        name='address'
        rules={[{ required: true, message: 'Please input your address!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={row?.balance}
        label='balance'
        name='balance'
        rules={[{ required: true, message: 'Please input your balance!' }]}
      >
        <Input />
      </Form.Item>
      <div className='form-footer'>
        <Button htmlType='submit' type='primary'>
          {isEdit ? 'Save' : 'Insert'}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </Form>
  );
};

export default UserForm;