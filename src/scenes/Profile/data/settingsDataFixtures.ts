export type SettingsItem = {
  title: string;
  goTo: string;
};

export const settingsItems: Array<SettingsItem> = [
  {
    title: 'Edit Profile',
    goTo: 'editProfile',
  },
  {
    title: 'Change Password',
    goTo: 'changePassword',
  },
];
