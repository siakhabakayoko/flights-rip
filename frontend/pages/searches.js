import { useEffect, useState } from 'react';
import { Layout, Table, Button, Space, message, Empty, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { ProtectedRoute } from 'shared/components/ProtectedRoute';
import { HeaderNav } from 'shared/components/HeaderNav';
import { ReusableHead } from 'shared/components/ReusableHead';
import { ReusableFooter } from 'shared/components/ReusableFooter';
import Api from 'shared/utils/Api';
import moment from 'moment';

const { Header, Content } = Layout;

const StyledSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
`;

export default function SearchesPage() {
  const router = useRouter();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    try {
      setLoading(true);
      const data = await Api.getUserSearches();
      setSearches(data || []);
    } catch (error) {
      message.error('Failed to load searches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (searchId) => {
    try {
      await Api.deleteSearch(searchId);
      setSearches(searches.filter(s => s.id !== searchId));
      message.success('Search deleted');
    } catch (error) {
      message.error('Failed to delete search');
    }
  };

  const handleSearch = (search) => {
    const params = new URLSearchParams({
      origin: search.origin,
      destination: search.destination,
      departureDate: search.departure_date,
      ...(search.return_date && { returnDate: search.return_date }),
    });
    router.push(`/search?${params.toString()}`);
  };

  const columns = [
    {
      title: 'From',
      dataIndex: 'origin',
      key: 'origin',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'To',
      dataIndex: 'destination',
      key: 'destination',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Departure',
      dataIndex: 'departure_date',
      key: 'departure_date',
      render: (date) => moment(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Return',
      dataIndex: 'return_date',
      key: 'return_date',
      render: (date) => date ? moment(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Tag color="green">${price}</Tag>,
    },
    {
      title: 'Saved',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => moment(date).fromNow(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleSearch(record)}
          >
            Search
          </Button>
          <Popconfirm
            title="Delete Search?"
            description="Are you sure you want to delete this search?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <ReusableHead title="My Searches | Flights.rip" />
      <Layout>
        <Header>
          <HeaderNav />
        </Header>

        <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 200px)' }}>
          <StyledSection>
            <PageTitle>My Saved Searches</PageTitle>

            {searches.length === 0 ? (
              <Empty
                description="No saved searches yet"
                style={{ marginTop: 60 }}
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push('/')}
                >
                  Start Searching
                </Button>
              </Empty>
            ) : (
              <Table
                columns={columns}
                dataSource={searches.map(s => ({ ...s, key: s.id }))}
                loading={loading}
                pagination={{ pageSize: 10 }}
                responsive
              />
            )}
          </StyledSection>
        </Content>

        <ReusableFooter />
      </Layout>
    </ProtectedRoute>
  );
}
