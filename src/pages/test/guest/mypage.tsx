import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "../../../components/Icons";
import { Input } from "@/components/ui/input";
import { uploadImage } from '../../../utils/uploadImage';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { utils } from '../../../utils/utils';
import GuestProfile from '../../../components/GuestProfile';
import styles from '../../../styles/profile.module.scss';
import StatusButton from '../../../components/StatusButton';

// <-- ---------- interface ---------- -->

interface PageProps {
  isLoggedIn: boolean;
  userData?: any;
}

interface GuestData {
    id: number;
    profile_image?: string;
    firstName: string;
    lastName: string;
    review_rate: number;
    review_sum: number;
    created_at: Date;
}

function GuestMypage({ isLoggedIn, userData }: PageProps): JSX.Element | null {

    const [guestData, setGuestData] = useState<GuestData | null>(null);

// <-- ---------- 定数の定義 ---------- -->

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

  // State
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const securedAxios = createSecuredAxiosInstance();
        const response = await securedAxios.get(`/api/guest`);
        setGuestData(response.data);
        setEmail(response.data.email);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setIconUrl(response.data.iconUrl);
      } catch (error) {
        console.error('Failed to fetch guest data', error);
      }
  };
  fetchUserInfo();
  }, []);

  const onIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
        setIconFile(uploadedFile);
    }
  };

  useEffect(() => {
      if (iconFile) {
          (async () => {
              const response = await uploadImage(iconFile);
              if (response?.path) {
                  setIconUrl(response.path);
              }
          })();
      }
  }, [iconFile]);


  // Handle form submission
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Validate password confirmation
      if (newPassword !== passwordConfirmation) {
        alert("Password confirmation does not match!");
        setIsLoading(false);
        return;
      }

      // Update user info
      const securedAxios = createSecuredAxiosInstance();
      const response = await securedAxios.put(`${apiUrl}/api/guest/update`, {
        email,
        currentPassword,
        newPassword,
        firstName,
        lastName,
        profile_image: iconUrl,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        alert('User info updated successfully');
      } else {
        console.error("Update failed", response.data.message);
        alert('Update failed');
      }
    } catch (error) {
      console.error("Update error", error);
      alert('Update error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <Tabs defaultValue="view" className="w-100">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <h3>{email ? email : 'Loading...'} </h3>
          <GuestProfile isLoggedIn={isLoggedIn} userData={userData} GuestData={guestData} />
        </TabsContent>
        <TabsContent value="edit">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Update Guest Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Current Password */}
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  placeholder="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* New Password */}
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Password Confirmation */}
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirmation">Confirm New Password</Label>
                <Input
                  id="passwordConfirmation"
                  placeholder="Confirm New Password"
                  type="password"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* First Name */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Last Name */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Icon */}
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  type="file"
                  onChange={onIconChange}
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Info
              </Button>
            </form>
          </CardContent>
        </Card>
        </TabsContent>
        <StatusButton userData={userData} />
      </Tabs>
    </main>
  );
}

export default GuestMypage;
