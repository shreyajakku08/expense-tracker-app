import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import PageTransition from '../components/layout/PageTransition';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateProfile } from '../utils/validators';
import { STORAGE_KEYS, ROUTES } from '../utils/constants';
import { getUserData, setUserData } from '../services/storageService';
import { HiUser, HiPhone, HiBriefcase, HiCalendar } from 'react-icons/hi';

const ProfilePage = () => {
  const { currentUser, deleteAccount, updateSessionName } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    contact: '',
    profession: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const savedProfile = getUserData(currentUser.id, STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        setProfile(savedProfile);
      }
    }
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    const validation = validateProfile(profile);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUserData(currentUser.id, STORAGE_KEYS.PROFILE, profile);
    updateSessionName(profile.name);
    toast.success('Profile Updated ✨');
    setSaving(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    toast.success('Account deleted. Goodbye! 👋');
    navigate(ROUTES.LANDING);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg transition-theme">
        <Header variant="dashboard" />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <SkeletonLoader variant="heading" width="150px" />
          <SkeletonLoader variant="card" height="400px" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg transition-theme">
      <Header variant="dashboard" />

      <PageTransition>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Profile</h1>
            <p className="text-sm text-theme-text-muted">Manage your account settings</p>
          </div>

          {/* Avatar + name */}
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white font-bold"
                style={{ background: 'var(--gradient-primary)' }}>
                {profile.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-lg font-semibold text-theme-text">{profile.name || 'User'}</p>
                <p className="text-sm text-theme-text-muted">@{currentUser?.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter your name"
                value={profile.name}
                onChange={handleChange}
                error={errors.name}
                required
                icon={<HiUser />}
                id="profile-name"
              />

              <Input
                label="Contact Number"
                name="contact"
                placeholder="Enter 10-digit number"
                value={profile.contact}
                onChange={handleChange}
                error={errors.contact}
                icon={<HiPhone />}
                id="profile-contact"
              />

              <Input
                label="Profession"
                name="profession"
                placeholder="e.g., Student, Developer"
                value={profile.profession}
                onChange={handleChange}
                icon={<HiBriefcase />}
                id="profile-profession"
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
                icon={<HiCalendar />}
                id="profile-dob"
              />

              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  loading={saving}
                  fullWidth
                  size="lg"
                  id="save-profile-btn"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="border-red-500/20">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-theme-text-muted mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              id="delete-account-btn"
            >
              Delete Account
            </Button>
          </Card>
        </main>
      </PageTransition>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="sm"
        id="delete-account-modal"
      >
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-sm text-theme-text mb-2 font-semibold">
            Are you absolutely sure?
          </p>
          <p className="text-sm text-theme-text-muted mb-6">
            All your transactions, profile data, and preferences will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDeleteAccount}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
