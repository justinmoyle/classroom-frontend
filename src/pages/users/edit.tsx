import { useEffect } from 'react';
import { useForm } from '@refinedev/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditView } from '@/components/refine-ui/views/edit-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { useBack, useList, useNotification } from '@refinedev/core';
import { facultySchema } from '@/lib/schema';
import { Department } from '@/types';
import z from 'zod';

const UsersEdit = () => {
  const back = useBack();
  const { open } = useNotification();

  const form = useForm<z.infer<typeof facultySchema>>({
    resolver: zodResolver(facultySchema),
    refineCoreProps: {
      resource: 'users',
      action: 'edit',
      redirect: 'list',
    },
  });

  const {
    refineCore: { onFinish, queryResult },
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const userData = queryResult?.data?.data;

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const { query: departmentsQuery } = useList<Department>({
    resource: 'departments',
    pagination: { pageSize: 100 },
  });

  const departments = departmentsQuery?.data?.data || [];

  const onSubmit = async (values: z.infer<typeof facultySchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      open?.({
        type: 'error',
        message: 'Error',
        description: 'Failed to update user',
      });
    }
  };

  return (
    <EditView className="p-6">
      <Breadcrumb />

      <h1 className="text-3xl font-bold tracking-tight mt-4">Edit User</h1>
      <div className="flex items-center justify-between mt-2 mb-6">
        <p className="text-muted-foreground">Update the information for {userData?.name || 'the user'}.</p>
        <Button variant="outline" onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-6 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">User Details</CardTitle>
          </CardHeader>
          <CardContent>
            {queryResult?.isLoading ? (
              <div className="flex justify-center p-8">Loading user data...</div>
            ) : (
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department (Optional)</FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                            value={field.value ? String(field.value) : 'none'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={String(dept.id)}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => back()}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Updating...' : 'Update User'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default UsersEdit;
