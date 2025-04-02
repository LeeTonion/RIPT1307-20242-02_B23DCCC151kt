import React, { useState, useEffect, useMemo } from "react";
import { Table, Input, Space } from "antd";

interface Diploma {
  id: string;
  diplomaName: string;
  diplomaNumber: number; // Số văn bằng
  year: number;
  createdAt: string;
}

const App: React.FC = () => {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Tải dữ liệu từ localStorage khi khởi động
  useEffect(() => {
    const storedDiplomas = localStorage.getItem("diplomas");
    if (storedDiplomas) {
      setDiplomas(JSON.parse(storedDiplomas));
    } else {
      // Không có dữ liệu mẫu
      setDiplomas([]);
    }
  }, []);

  // Lọc dữ liệu theo tên văn bằng
  const filteredDiplomas = useMemo(() => {
    return diplomas.filter((diploma) =>
      diploma.diplomaName.toLowerCase().includes(searchName.toLowerCase())
    );
  }, [diplomas, searchName]);

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Sổ văn bằng",
      dataIndex: "diplomaName",
      key: "diplomaName",
      sorter: (a: Diploma, b: Diploma) => a.diplomaName.localeCompare(b.diplomaName),
    },
    {
      title: "Số văn bằng",
      dataIndex: "diplomaNumber",
      key: "diplomaNumber",
      sorter: (a: Diploma, b: Diploma) => a.diplomaNumber - b.diplomaNumber,
    },
    {
      title: "Năm cấp",
      dataIndex: "year",
      key: "year",
      sorter: (a: Diploma, b: Diploma) => a.year - b.year,
    },
    {
      title: "Ngày cấp",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Diploma, b: Diploma) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý văn bằng</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên văn bằng"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 200 }}
        />
      </Space>

      <Table
        dataSource={filteredDiplomas}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredDiplomas.length,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default App;