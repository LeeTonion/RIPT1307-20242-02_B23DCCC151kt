import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import UserForm from './form';

const RandomUser = () => {
  const { data, getDataUser } = useModel('randomuser');
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<RandomUser.Record>();

  useEffect(() => {
    getDataUser();
  }, []);

  const handleDelete = (record: RandomUser.Record) => {
    const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
    const newData = dataLocal.filter((item: any) => item.address !== record.address);
    localStorage.setItem('data', JSON.stringify(newData));
    getDataUser();
  };

  const handleFormFinish = (values: any) => {
    const index = data.findIndex((item: any) => item.address === row?.address);
    const dataTemp: RandomUser.Record[] = [...data];
    dataTemp.splice(index, 1, values);
    const dataLocal = isEdit ? dataTemp : [values, ...data];
    localStorage.setItem('data', JSON.stringify(dataLocal));
    setVisible(false);
    getDataUser();
  };

  const columns: IColumn<RandomUser.Record>[] = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'name',
      width: 200,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'age',
      width: 100,
    },
    {
      title: 'Action',
      width: 200,
      align: 'center',
      render: (record) => {
        return (
          <div>
            <Button
              onClick={() => {
                setVisible(true);
                setRow(record);
                setIsEdit(true);
              }}
            >
              Edit
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => handleDelete(record)}
              type='primary'
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setVisible(true);
          setIsEdit(false);
        }}
      >
        Add User
      </Button>
      <Table dataSource={data} columns={columns} />
      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Edit User' : 'Add User'}
        visible={visible}
        onOk={() => {}}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <UserForm
          isEdit={isEdit}
          row={row}
          onFinish={handleFormFinish}
          onCancel={() => setVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default RandomUser;