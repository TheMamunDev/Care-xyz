'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Camera,
  User as UserIcon,
  MapPin,
  Phone,
  Save,
  IdCard,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  contact: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(300).optional(),
  nid: z.coerce.number().optional(),
});

export default function ProfilePageClient() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      contact: '',
      address: '',
      bio: '',
      nid: 0,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user');
        setUserData(res.data);
        form.reset({
          fullName: res.data.fullName || '',
          contact: res.data.contact || '',
          address: res.data.address || '',
          bio: res.data.bio || '',
          nid: res.data.nid || 0,
        });
      } catch (error) {
        console.log(error);
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, [form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formData,
      );

      const imageUrl = imgRes.data.data.url;
      await axios.patch('/api/user/profile', { image: imageUrl });

      setUserData((prev: any) => ({ ...prev, image: imageUrl }));
      await update({ image: imageUrl });

      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    console.log(values);
    try {
      const res = await axios.patch('/api/user', values);
      setUserData(res.data);
      await update({ name: values.fullName });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={userData.image} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {userData.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {userData.fullName}
              </h2>
              <p className="text-sm text-gray-500">{userData.email}</p>

              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium border border-blue-100 capitalize">
                  {userData.role} Account
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase">
                Member Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {new Date(userData.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-9"
                                placeholder="+880..."
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NID Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-9"
                                placeholder="9867"
                                {...field}
                                value={field.value as number}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-9"
                                placeholder="City, Country"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little about yourself..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-right">
                          {field.value?.length || 0}/300
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
