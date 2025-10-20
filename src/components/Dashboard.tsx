import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, message, Space } from "antd";
import api from "../api"; // ✅ Make sure baseURL is http://localhost:8080/api/tasks
import "antd/dist/reset.css";

interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  taskExecutions?: any[];
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [outputModalVisible, setOutputModalVisible] = useState(false);
  const [taskOutput, setTaskOutput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch tasks from backend (GET /api/tasks)
  const fetchTasks = async () => {
    try {
      const res = await api.get(""); // ✅ /api/tasks
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Create or update task (PUT /api/tasks)
  const createTask = async (vals: any) => {
    try {
      await api.put("", vals);
      message.success("Task Created");
      setVisible(false);
      fetchTasks();
    } catch (e) {
      message.error("Failed to create");
    }
  };

  // ✅ Delete task (DELETE /api/tasks?id=123)
  const deleteTask = async (id: string) => {
    try {
      await api.delete(`?id=${id}`);
      message.success("Deleted");
      fetchTasks();
    } catch (e) {
      message.error("Failed to delete");
    }
  };

  // ✅ Execute command (PUT /api/tasks/{id}/executions with raw string)
  const runTask = async (id: string, command: string) => {
  try {
    const res = await api.put(
      `/${id}/executions`,
      JSON.stringify(command), // ✅ Use command from task directly
      { headers: { "Content-Type": "application/json" } }
    );
    setTaskOutput(res.data.logs || "No output");
    setOutputModalVisible(true);
    fetchTasks();
  } catch (e) {
    message.error("Execution failed");
  }
};


  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by task name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
        <Button type="dashed" onClick={() => setVisible(true)}>
          + New Task
        </Button>
      </Space>

      <Table dataSource={tasks} rowKey="id">
        <Table.Column title="ID" dataIndex="id" />
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Owner" dataIndex="owner" />
        <Table.Column title="Command" dataIndex="command" />
        <Table.Column
          title="Actions"
          render={(_, record: Task) => (
            <Space>
              <Button onClick={() => runTask(record.id)}>Run</Button>
              <Button danger onClick={() => deleteTask(record.id)}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        title="Create Task"
      >
        <Form form={form} onFinish={createTask}>
          <Form.Item name="id" rules={[{ required: true }]}>
            <Input placeholder="id" />
          </Form.Item>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item name="owner" rules={[{ required: true }]}>
            <Input placeholder="owner" />
          </Form.Item>
          <Form.Item name="command" rules={[{ required: true }]}>
            <Input placeholder="command" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={outputModalVisible}
        onCancel={() => setOutputModalVisible(false)}
        footer={null}
        title="Task Output"
        width={700}
      >
        <pre>{taskOutput}</pre>
      </Modal>
    </div>
  );
}
