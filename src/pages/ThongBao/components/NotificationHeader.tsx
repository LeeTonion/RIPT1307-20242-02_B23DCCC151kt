import { Col, Form, Input, Row } from 'antd';
import { NotificationType } from '@/services/ThongBao/constant';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';

interface NotificationHeaderProps {
  notiType: NotificationType;
}

const NotificationHeader = ({ notiType }: NotificationHeaderProps) => {
  return (
    <Row gutter={[12, 0]}>
      {notiType === NotificationType.ONESIGNAL && (
        <Col span={24} md={6}>
          <Form.Item name='imageUrl' label='Ảnh đại diện'>
            <UploadFile isAvatarSmall />
          </Form.Item>
        </Col>
      )}
      <Col span={24} md={notiType === NotificationType.ONESIGNAL ? 18 : 24}>
        <Row gutter={[12, 0]}>
          <Col span={notiType === NotificationType.ONESIGNAL ? 24 : 12}>
            <Form.Item
              name='title'
              label='Tiêu đề'
              rules={[...rules.required, ...rules.text, ...rules.length(250)]}
            >
              <Input placeholder='Nhập tiêu đề' />
            </Form.Item>
          </Col>
          {notiType === NotificationType.EMAIL && (
            <Col span={12}>
              <Form.Item name='idTagEmail' label='Nhãn dán' rules={[...rules.required]}>
                {/* <SelectTag />  Tùy chỉnh trong từng phân hệ */}
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item name='description' label='Mô tả' rules={[...rules.text, ...rules.length(500)]}>
              <Input.TextArea rows={3} placeholder='Nhập mô tả' />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default NotificationHeader;