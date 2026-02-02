import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ListView } from '@/components/refine-ui/views/list-view';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { User, UserRole, Department } from '@/types';
import { useList } from '@refinedev/core';
import { EditButton } from '@/components/refine-ui/buttons/edit';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';

const UsersListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'image',
        accessorKey: 'image',
        size: 60,
        header: () => <p className="column-title ml-2">Photo</p>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center ml-2">
            <img
              src={row.original.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.email}`}
              alt={row.original.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
          </div>
        ),
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">{getValue<string>()}</span>
        ),
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: () => <p className="column-title">Email</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => {
          const role = getValue<UserRole>();
          return (
            <Badge
              variant={
                role === UserRole.ADMIN
                  ? 'destructive'
                  : role === UserRole.TEACHER
                  ? 'default'
                  : 'secondary'
              }
            >
              {role.toUpperCase()}
            </Badge>
          );
        },
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>() || '-'}</span>
        ),
      },
      {
        id: 'actions',
        header: () => <p className="column-title text-center">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <EditButton hideText size="sm" recordItemId={row.original.id} />
            <DeleteButton hideText size="sm" recordItemId={row.original.id} />
          </div>
        ),
      },
    ],
    []
  );

  const roleFilters =
    selectedRole === 'all'
      ? []
      : [
          {
            field: 'role',
            operator: 'eq' as const,
            value: selectedRole,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: 'search',
          operator: 'contains' as const,
          value: searchQuery,
        },
      ]
    : [];

  const {
    table,
    tableProps,
    refineCore: { tableQueryResult },
  } = useTable<User>({
    refineCoreProps: {
      resource: 'users',
      filters: {
        permanent: [...roleFilters, ...searchFilters],
      },
    },
    columns,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Users' }]} />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <CreateButton icon={<UserPlus className="h-4 w-4 mr-2" />}>Add User</CreateButton>
        </div>
      </div>

      <ListView
        tableQueryResult={tableQueryResult}
        filters={
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <DataTable table={table} tableProps={tableProps} />
      </ListView>
    </div>
  );
};

export default UsersListPage;
