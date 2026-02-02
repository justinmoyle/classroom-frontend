import React from 'react';
import { Search } from 'lucide-react';
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
import { ClassDetails, Subject, User } from '@/types';
import { useList } from '@refinedev/core';
import { Link, useSearchParams } from 'react-router';
import { ShowButton } from '@/components/refine-ui/buttons/show.tsx';
import { useEffect } from 'react';

const ClassesListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  const { query: subjectQuery } = useList<Subject>({
    resource: 'subjects',
    pagination: { pageSize: 100 },
  });

  const { query: teacherQuery } = useList<User>({
    resource: 'users',
    pagination: { pageSize: 100 },
  });

  const subjects = subjectQuery?.data?.data || [];
  const teachers = teacherQuery?.data?.data || [];

  const subjectFilters =
    selectedSubject === 'all'
      ? []
      : [
          {
            field: 'subject',
            operator: 'eq' as const,
            value: selectedSubject,
          },
        ];

  const teacherFilters =
    selectedTeacher === 'all'
      ? []
      : [
          {
            field: 'teacher',
            operator: 'eq' as const,
            value: selectedTeacher,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: 'name',
          operator: 'contains' as const,
          value: searchQuery,
        },
      ]
    : [];

  const classColumns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        id: 'bannerUrl',
        accessorKey: 'bannerUrl',
        size: 80,
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => (
          <div className="flex items-center justify-center ml-2">
            <img
              src={getValue<string>() || '/placeholder-class.png'}
              alt="Class Banner"
              className="w-10 h-10 rounded object-cover"
            />
          </div>
        ),
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 220,
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        size: 140,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        id: 'subject',
        accessorKey: 'subject',
        size: 200,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => {
          const subject = getValue<Subject>();
          return (
            <span className="text-foreground">{subject?.name || '-'}</span>
          );
        },
      },
      {
        id: 'teacher',
        accessorKey: 'teacher',
        size: 200,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => {
          const teacher = getValue<User>();
          return (
            <span className="text-foreground">{teacher?.name || '-'}</span>
          );
        },
      },
      {
        id: 'capacity',
        accessorKey: 'capacity',
        size: 120,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        id: 'details',
        accessorKey: 'details',
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View Details
          </ShowButton>
        ),
      },
    ],
    []
  );

  const classTable = useTable<ClassDetails>({
    columns: classColumns,
    refineCoreProps: {
      resource: 'classes',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        // Compose refine filters from the current UI selections.
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: 'id',
            order: 'desc',
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Manage your classes, subjects, and teachers.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
};
export default ClassesListPage;
