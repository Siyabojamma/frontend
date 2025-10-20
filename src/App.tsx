
import React from 'react';
import { Layout, Typography } from 'antd';
import Dashboard from './components/Dashboard';

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header><Typography.Title style={{ color: 'white', margin: 0 }} level={3}>Kaiburr Tasks</Typography.Title></Header>
      <Content style={{ padding: 24 }}><Dashboard/></Content>
    </Layout>
  );
}
