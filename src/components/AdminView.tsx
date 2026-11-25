import React, { useEffect, useState } from 'react';
import {
  Check,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  AiAutomationItem,
  AiMockupItem,
  AutomationStatus,
  ContactMessage,
  ExperienceItem,
  MarketingToolItem,
  PortfolioData,
  PortfolioPageId,
  RealEstateCampaignItem,
  SocialMediaItem,
  SocialPlatformCategory,
  WebsiteProjectItem,
} from '../types/portfolio';

interface AdminViewProps {
  data: PortfolioData;
  onDataSaved: (next: PortfolioData) => void;
  onNavigate: (page: PortfolioPageId) => void;
}

type AdminTab =
  | 'profile'
  | 'about'
  | 'experience'
  | 'social'
  | 'marketing'
  | 'websites'
  | 'ai'
  | 'cases'
  | 'inbox';

export const AdminView: React.FC<AdminViewProps> = ({
  data,
  onDataSaved,
  onNavigate,
}) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [envControlled, setEnvControlled] = useState(false);
  const [token, setToken] = useState<string>('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [draft, setDraft] = useState<PortfolioData>(() => structuredClone(data));
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    setDraft(structuredClone(data));
  }, [data]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/status');
        const info = await res.json();
        setConfigured(Boolean(info.configured));
        setEnvControlled(Boolean(info.envControlled));
      } catch {
        setAuthError('Unable to check admin status.');
      } finally {
        setAuthLoading(false);
      }
    };
    checkStatus();
  }, []);

  const loadMessages = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch {
      // Ignore message fetch error
    }
  };

  const handleClaimPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passcodeInput.trim().length < 8) {
      setAuthError('Please choose a passcode of at least 8 characters.');
      return;
    }
    if (passcodeInput !== confirmPasscodeInput) {
      setAuthError('Passcodes do not match.');
      return;
    }
    try {
      const res = await fetch('/api/admin/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const result = await res.json();
      if (!res.ok) {
        setAuthError(result.error || 'Could not claim passcode.');
        return;
      }
      setToken(result.token);
      setConfigured(true);
      setPasscodeInput('');
      setConfirmPasscodeInput('');
      await loadMessages(result.token);
    } catch {
      setAuthError('Network error while setting up admin passcode.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const result = await res.json();
      if (!res.ok) {
        setAuthError(result.error || 'Authentication failed.');
        return;
      }
      setToken(result.token);
      setPasscodeInput('');
      await loadMessages(result.token);
    } catch {
      setAuthError('Network error during sign in.');
    }
  };

  const handleSave = async (nextDraft: PortfolioData = draft) => {
    if (!token) return;
    setSaving(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nextDraft),
      });
      const saved = await res.json();
      if (!res.ok) {
        setStatusMessage(saved.error || 'Failed to save changes.');
      } else {
        onDataSaved(saved);
        setStatusMessage('All changes saved persistently.');
      }
    } catch {
      setStatusMessage('Network error while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!token) return;
    setSaving(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const fresh = await res.json();
      if (res.ok) {
        setDraft(structuredClone(fresh));
        onDataSaved(fresh);
        setStatusMessage('Portfolio content restored to initial baseline.');
      }
    } catch {
      setStatusMessage('Failed to restore defaults.');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = (
    file: File,
    purpose: 'image' | 'resume',
    onSuccess: (url: string, fileName: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = typeof reader.result === 'string' ? reader.result : '';
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            purpose,
            mimeType: file.type,
            base64Data,
            originalName: file.name,
          }),
        });
        const result = await res.json();
        if (!res.ok) {
          setStatusMessage(result.error || 'Upload failed.');
          return;
        }
        onSuccess(result.url, result.fileName || file.name);
        setStatusMessage(`Uploaded ${file.name}. Click Save Changes to publish.`);
      } catch {
        setStatusMessage('Upload failed due to a network error.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-sm text-[#52525B]">
        Loading Portfolio Admin...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="rounded-2xl border border-[#E6E4DF] bg-white p-7 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2F0EB] flex items-center justify-center text-[#1E3A5F]">
              <Lock size={18} aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-[#18181B]">
                {configured ? 'Portfolio Admin Sign In' : 'Set Up Private Admin Passcode'}
              </h1>
              <p className="text-xs text-[#71717A]">
                {configured
                  ? envControlled
                    ? 'Protected by server ADMIN_PASSCODE secret'
                    : 'Private content management area'
                  : 'First-time setup: claim a private passcode (min. 8 characters)'}
              </p>
            </div>
          </div>

          {!configured ? (
            <form onSubmit={handleClaimPasscode} className="space-y-4">
              <div>
                <label
                  htmlFor="claim-passcode"
                  className="block text-xs font-medium text-[#3F3F46] mb-1.5"
                >
                  Choose Admin Passcode
                </label>
                <input
                  id="claim-passcode"
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="claim-passcode-confirm"
                  className="block text-xs font-medium text-[#3F3F46] mb-1.5"
                >
                  Confirm Passcode
                </label>
                <input
                  id="claim-passcode-confirm"
                  type="password"
                  value={confirmPasscodeInput}
                  onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                  placeholder="Re-enter passcode"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm"
                />
              </div>
              {authError && <p className="text-xs text-red-700">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] cursor-pointer"
              >
                Claim Passcode &amp; Enter Admin
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-passcode"
                  className="block text-xs font-medium text-[#3F3F46] mb-1.5"
                >
                  Admin Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter private passcode"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm"
                />
              </div>
              {authError && <p className="text-xs text-red-700">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] cursor-pointer"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-[#F0EDE6] flex justify-between items-center text-xs text-[#71717A]">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#18181B] cursor-pointer"
            >
              &larr; Back to Public Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'profile', label: 'Profile & Resume' },
    { id: 'about', label: 'About & Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'social', label: 'Social Media' },
    { id: 'marketing', label: 'Marketing & Real Estate' },
    { id: 'websites', label: 'Websites' },
    { id: 'ai', label: 'AI & Automation' },
    { id: 'cases', label: 'Case Studies' },
    { id: 'inbox', label: `Inbox (${messages.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6E4DF]">
        <div>
          <p className="text-xs font-medium text-[#1E3A5F]">Private Content Manager</p>
          <h1 className="font-display text-2xl font-bold text-[#18181B]">
            Portfolio CMS &amp; Uploads
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] disabled:opacity-60 cursor-pointer"
          >
            <Save size={15} aria-hidden="true" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium text-[#52525B] hover:text-[#18181B] cursor-pointer"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={() => setToken('')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium text-[#52525B] hover:text-[#18181B] cursor-pointer"
          >
            <LogOut size={14} aria-hidden="true" />
            Lock Admin
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="rounded-xl border border-[#B7D6C3] bg-[#F2F7F4] px-4 py-3 text-sm text-[#1D4B32] flex items-center gap-2"
        >
          <Check size={16} aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#EFECE6] rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-8 space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="font-display text-lg font-semibold text-[#18181B]">
              Personal Branding, Contact &amp; Resume PDF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={draft.profile.name}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={draft.profile.linkedInUrl}
                  placeholder="https://www.linkedin.com/in/your-handle"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, linkedInUrl: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={draft.profile.email}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={draft.profile.phone}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      profile: { ...draft.profile, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                Professional Positioning Line
              </label>
              <input
                type="text"
                value={draft.profile.positioning}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    profile: { ...draft.profile, positioning: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="admin-hero-heading"
                className="block text-xs font-medium text-[#3F3F46] mb-1"
              >
                Hero Heading
              </label>
              <input
                id="admin-hero-heading"
                type="text"
                value={draft.profile.heroHeading}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    profile: { ...draft.profile, heroHeading: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                Hero Supporting Text
              </label>
              <textarea
                rows={3}
                value={draft.profile.heroSupportingText}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    profile: { ...draft.profile, heroSupportingText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0EDE6]">
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#3F3F46]">
                  Profile Portrait Photograph
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-xs font-medium cursor-pointer hover:bg-[#EFECE6]">
                  <Upload size={14} aria-hidden="true" />
                  Upload Portrait Image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadFile(file, 'image', (url) => {
                          setDraft((prev) => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              portraitUrl: url,
                              portraitCaption: '',
                            },
                          }));
                        });
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-[#71717A] truncate">
                  Current: {draft.profile.portraitUrl}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-[#3F3F46]">Resume PDF</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-xs font-medium cursor-pointer hover:bg-[#EFECE6]">
                  <Upload size={14} aria-hidden="true" />
                  Upload Resume PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadFile(file, 'resume', (url, fileName) => {
                          setDraft((prev) => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              resumePdfUrl: url,
                              resumeFileName: fileName,
                            },
                          }));
                        });
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-[#71717A]">
                  {draft.profile.resumePdfUrl
                    ? `Active file: ${draft.profile.resumeFileName || draft.profile.resumePdfUrl}`
                    : 'No resume PDF uploaded yet.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="font-display text-lg font-semibold text-[#18181B]">
              About Paragraphs, Education &amp; Skills
            </h2>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#3F3F46]">
                About Paragraphs (one paragraph per blank line)
              </label>
              <textarea
                rows={8}
                value={draft.about.paragraphs.join('\n\n')}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    about: {
                      ...draft.about,
                      paragraphs: e.target.value
                        .split(/\n\s*\n/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#F0EDE6]">
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={draft.about.education.degree}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      about: {
                        ...draft.about,
                        education: { ...draft.about.education, degree: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  University
                </label>
                <input
                  type="text"
                  value={draft.about.education.university}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      about: {
                        ...draft.about,
                        education: { ...draft.about.education, university: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3F3F46] mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={draft.about.education.duration}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      about: {
                        ...draft.about,
                        education: { ...draft.about.education, duration: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F0EDE6]">
              <h3 className="text-sm font-semibold text-[#18181B]">
                Skill Categories (comma-separated items)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.skills.map((cat, idx) => (
                  <div key={cat.id} className="p-4 rounded-xl border border-[#E6E4DF] space-y-2">
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => {
                        const next = [...draft.skills];
                        next[idx] = { ...cat, title: e.target.value };
                        setDraft({ ...draft, skills: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D4D1C9] text-sm font-medium"
                    />
                    <textarea
                      rows={3}
                      value={cat.items.join(', ')}
                      onChange={(e) => {
                        const next = [...draft.skills];
                        next[idx] = {
                          ...cat,
                          items: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setDraft({ ...draft, skills: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D4D1C9] text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#18181B]">
                Experience Timeline
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newItem: ExperienceItem = {
                    id: `exp-${Date.now()}`,
                    role: 'New Role',
                    company: 'Company Name',
                    location: 'City',
                    period: 'Month Year – Month Year',
                    workAreas: ['Key responsibility'],
                  };
                  setDraft({ ...draft, experiences: [newItem, ...draft.experiences] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
              >
                <Plus size={14} aria-hidden="true" />
                Add Role
              </button>
            </div>

            <div className="space-y-4">
              {draft.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-[#E6E4DF] space-y-3 bg-[#FAF9F6]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={exp.role}
                      placeholder="Role"
                      onChange={(e) => {
                        const next = [...draft.experiences];
                        next[idx] = { ...exp, role: e.target.value };
                        setDraft({ ...draft, experiences: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      placeholder="Company"
                      onChange={(e) => {
                        const next = [...draft.experiences];
                        next[idx] = { ...exp, company: e.target.value };
                        setDraft({ ...draft, experiences: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={exp.location}
                      placeholder="Location"
                      onChange={(e) => {
                        const next = [...draft.experiences];
                        next[idx] = { ...exp, location: e.target.value };
                        setDraft({ ...draft, experiences: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      placeholder="Period"
                      onChange={(e) => {
                        const next = [...draft.experiences];
                        next[idx] = { ...exp, period: e.target.value };
                        setDraft({ ...draft, experiences: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#71717A] mb-1">
                      Work Areas (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={exp.workAreas.join('\n')}
                      onChange={(e) => {
                        const next = [...draft.experiences];
                        next[idx] = {
                          ...exp,
                          workAreas: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setDraft({ ...draft, experiences: next });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.filter((i) => i.id !== exp.id),
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline cursor-pointer"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                      Remove Role
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#18181B]">
                Social Media Management Gallery
              </h2>
              <button
                type="button"
                onClick={() => {
                  const nextItem: SocialMediaItem = {
                    id: `sm-${Date.now()}`,
                    brandOrProject: 'New Social Media Project',
                    industry: 'Industry',
                    role: 'Social Media Management',
                    workPerformed: 'Describe content planning, creatives, or campaign work.',
                    platform: 'Instagram',
                    imageUrl: '',
                    liveUrl: '',
                    notes: '',
                  };
                  setDraft({ ...draft, socialMedia: [nextItem, ...draft.socialMedia] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
              >
                <Plus size={14} aria-hidden="true" />
                Add Social Project
              </button>
            </div>

            <div className="space-y-4">
              {draft.socialMedia.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={item.brandOrProject}
                      placeholder="Project or Brand Name"
                      onChange={(e) => {
                        const next = [...draft.socialMedia];
                        next[idx] = { ...item, brandOrProject: e.target.value };
                        setDraft({ ...draft, socialMedia: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={item.industry}
                      placeholder="Industry"
                      onChange={(e) => {
                        const next = [...draft.socialMedia];
                        next[idx] = { ...item, industry: e.target.value };
                        setDraft({ ...draft, socialMedia: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <select
                      value={item.platform}
                      onChange={(e) => {
                        const next = [...draft.socialMedia];
                        next[idx] = {
                          ...item,
                          platform: e.target.value as Exclude<SocialPlatformCategory, 'All'>,
                        };
                        setDraft({ ...draft, socialMedia: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    >
                      {(['Instagram', 'Facebook', 'Reels', 'Real Estate', 'Campaign Creatives'] as const).map(
                        (p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.role}
                      placeholder="My Role"
                      onChange={(e) => {
                        const next = [...draft.socialMedia];
                        next[idx] = { ...item, role: e.target.value };
                        setDraft({ ...draft, socialMedia: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="url"
                      value={item.liveUrl}
                      placeholder="Optional live social link (https://...)"
                      onChange={(e) => {
                        const next = [...draft.socialMedia];
                        next[idx] = { ...item, liveUrl: e.target.value };
                        setDraft({ ...draft, socialMedia: next });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={item.workPerformed}
                    placeholder="Work performed"
                    onChange={(e) => {
                      const next = [...draft.socialMedia];
                      next[idx] = { ...item, workPerformed: e.target.value };
                      setDraft({ ...draft, socialMedia: next });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium cursor-pointer">
                      <Upload size={13} aria-hidden="true" />
                      Upload Screenshot / Creative
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadFile(file, 'image', (url) => {
                              const next = [...draft.socialMedia];
                              next[idx] = { ...item, imageUrl: url };
                              setDraft({ ...draft, socialMedia: next });
                            });
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          socialMedia: draft.socialMedia.filter((s) => s.id !== item.id),
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline cursor-pointer"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#18181B]">
                  Marketing Tools
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const tool: MarketingToolItem = {
                      id: `tool-${Date.now()}`,
                      name: 'New Tool',
                      category: 'Category',
                      description: 'How this tool is used.',
                    };
                    setDraft({
                      ...draft,
                      digitalMarketing: {
                        ...draft.digitalMarketing,
                        tools: [...draft.digitalMarketing.tools, tool],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add Tool
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draft.digitalMarketing.tools.map((tool, idx) => (
                  <div
                    key={tool.id}
                    className="p-3.5 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={tool.name}
                        onChange={(e) => {
                          const next = [...draft.digitalMarketing.tools];
                          next[idx] = { ...tool, name: e.target.value };
                          setDraft({
                            ...draft,
                            digitalMarketing: { ...draft.digitalMarketing, tools: next },
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                      />
                      <input
                        type="text"
                        value={tool.category}
                        onChange={(e) => {
                          const next = [...draft.digitalMarketing.tools];
                          next[idx] = { ...tool, category: e.target.value };
                          setDraft({
                            ...draft,
                            digitalMarketing: { ...draft.digitalMarketing, tools: next },
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={tool.description}
                      onChange={(e) => {
                        const next = [...draft.digitalMarketing.tools];
                        next[idx] = { ...tool, description: e.target.value };
                        setDraft({
                          ...draft,
                          digitalMarketing: { ...draft.digitalMarketing, tools: next },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          digitalMarketing: {
                            ...draft.digitalMarketing,
                            tools: draft.digitalMarketing.tools.filter(
                              (t) => t.id !== tool.id
                            ),
                          },
                        })
                      }
                      className="text-xs text-red-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#E6E4DF]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#18181B]">
                  Real Estate Campaigns
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const item: RealEstateCampaignItem = {
                      id: `re-${Date.now()}`,
                      projectName: 'Real Estate Campaign – City',
                      location: 'City, State',
                      propertyCategory: 'Residential Apartments',
                      marketingObjective: 'Lead Generation',
                      campaignType: 'Meta Lead Ads',
                      contribution: 'Campaign setup & creative coordination',
                      creativeUrl: '',
                      optionalResults: '',
                      optionalLink: '',
                    };
                    setDraft({
                      ...draft,
                      digitalMarketing: {
                        ...draft.digitalMarketing,
                        realEstateCampaigns: [
                          item,
                          ...draft.digitalMarketing.realEstateCampaigns,
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add Campaign
                </button>
              </div>
              {draft.digitalMarketing.realEstateCampaigns.map((c, idx) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={c.projectName}
                      onChange={(e) => {
                        const next = [...draft.digitalMarketing.realEstateCampaigns];
                        next[idx] = { ...c, projectName: e.target.value };
                        setDraft({
                          ...draft,
                          digitalMarketing: {
                            ...draft.digitalMarketing,
                            realEstateCampaigns: next,
                          },
                        });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={c.location}
                      onChange={(e) => {
                        const next = [...draft.digitalMarketing.realEstateCampaigns];
                        next[idx] = { ...c, location: e.target.value };
                        setDraft({
                          ...draft,
                          digitalMarketing: {
                            ...draft.digitalMarketing,
                            realEstateCampaigns: next,
                          },
                        });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={c.propertyCategory}
                      onChange={(e) => {
                        const next = [...draft.digitalMarketing.realEstateCampaigns];
                        next[idx] = { ...c, propertyCategory: e.target.value };
                        setDraft({
                          ...draft,
                          digitalMarketing: {
                            ...draft.digitalMarketing,
                            realEstateCampaigns: next,
                          },
                        });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium cursor-pointer">
                      <Upload size={13} aria-hidden="true" />
                      Upload Creative
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadFile(file, 'image', (url) => {
                              const next = [...draft.digitalMarketing.realEstateCampaigns];
                              next[idx] = { ...c, creativeUrl: url };
                              setDraft({
                                ...draft,
                                digitalMarketing: {
                                  ...draft.digitalMarketing,
                                  realEstateCampaigns: next,
                                },
                              });
                            });
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          digitalMarketing: {
                            ...draft.digitalMarketing,
                            realEstateCampaigns:
                              draft.digitalMarketing.realEstateCampaigns.filter(
                                (item) => item.id !== c.id
                              ),
                          },
                        })
                      }
                      className="text-xs text-red-700 hover:underline cursor-pointer"
                    >
                      Remove Campaign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'websites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#18181B]">
                Website Development Projects
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newSite: WebsiteProjectItem = {
                    id: `web-${Date.now()}`,
                    name: 'New Website Project',
                    url: 'https://',
                    industry: 'Industry',
                    contribution: 'Website implementation',
                    technologies: [],
                    description: 'Project description',
                    screenshotUrl: '',
                  };
                  setDraft({ ...draft, websites: [...draft.websites, newSite] });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
              >
                <Plus size={14} aria-hidden="true" />
                Add Website
              </button>
            </div>

            {draft.websites.map((site, idx) => (
              <div
                key={site.id}
                className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={site.name}
                    placeholder="Website Name"
                    onChange={(e) => {
                      const next = [...draft.websites];
                      next[idx] = { ...site, name: e.target.value };
                      setDraft({ ...draft, websites: next });
                    }}
                    className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                  />
                  <input
                    type="url"
                    value={site.url}
                    placeholder="https://..."
                    onChange={(e) => {
                      const next = [...draft.websites];
                      next[idx] = { ...site, url: e.target.value };
                      setDraft({ ...draft, websites: next });
                    }}
                    className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                  />
                  <input
                    type="text"
                    value={site.industry}
                    placeholder="Industry"
                    onChange={(e) => {
                      const next = [...draft.websites];
                      next[idx] = { ...site, industry: e.target.value };
                      setDraft({ ...draft, websites: next });
                    }}
                    className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={site.contribution}
                    placeholder="My Contribution"
                    onChange={(e) => {
                      const next = [...draft.websites];
                      next[idx] = { ...site, contribution: e.target.value };
                      setDraft({ ...draft, websites: next });
                    }}
                    className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                  />
                  <input
                    type="text"
                    value={site.technologies.join(', ')}
                    placeholder="Technologies (comma-separated, e.g., WordPress, HTML)"
                    onChange={(e) => {
                      const next = [...draft.websites];
                      next[idx] = {
                        ...site,
                        technologies: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      };
                      setDraft({ ...draft, websites: next });
                    }}
                    className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                  />
                </div>
                <textarea
                  rows={2}
                  value={site.description}
                  onChange={(e) => {
                    const next = [...draft.websites];
                    next[idx] = { ...site, description: e.target.value };
                    setDraft({ ...draft, websites: next });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium cursor-pointer">
                    <Upload size={13} aria-hidden="true" />
                    Upload Website Screenshot
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadFile(file, 'image', (url) => {
                            const next = [...draft.websites];
                            next[idx] = { ...site, screenshotUrl: url };
                            setDraft({ ...draft, websites: next });
                          });
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        websites: draft.websites.filter((w) => w.id !== site.id),
                      })
                    }
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Remove Website
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-[#18181B]">
                Featured Project: AI-Powered Personal Portfolio Website
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={draft.aiAutomation.featuredProject.liveUrl}
                  placeholder="Published live portfolio URL (leave blank until published)"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      aiAutomation: {
                        ...draft.aiAutomation,
                        featuredProject: {
                          ...draft.aiAutomation.featuredProject,
                          liveUrl: e.target.value,
                        },
                      },
                    })
                  }
                  className="px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
                <input
                  type="text"
                  value={draft.aiAutomation.featuredProject.tools.join(', ')}
                  placeholder="Tools used (comma-separated)"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      aiAutomation: {
                        ...draft.aiAutomation,
                        featuredProject: {
                          ...draft.aiAutomation.featuredProject,
                          tools: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      },
                    })
                  }
                  className="px-3 py-2 rounded-lg border border-[#D4D1C9] text-sm"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#E6E4DF]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#18181B]">
                  AI Automation &amp; Workflow Experiments
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const item: AiAutomationItem = {
                      id: `auto-${Date.now()}`,
                      title: 'New Automation Experiment',
                      problemAddressed: 'Problem being addressed',
                      workflowExplanation: 'Workflow steps',
                      toolsUsed: ['AI Studio'],
                      status: 'Experiment',
                      screenshotUrl: '',
                      verifiedOutcome: '',
                    };
                    setDraft({
                      ...draft,
                      aiAutomation: {
                        ...draft.aiAutomation,
                        automations: [item, ...draft.aiAutomation.automations],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add Experiment
                </button>
              </div>
              {draft.aiAutomation.automations.map((auto, idx) => (
                <div
                  key={auto.id}
                  className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={auto.title}
                      onChange={(e) => {
                        const next = [...draft.aiAutomation.automations];
                        next[idx] = { ...auto, title: e.target.value };
                        setDraft({
                          ...draft,
                          aiAutomation: { ...draft.aiAutomation, automations: next },
                        });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    />
                    <select
                      value={auto.status}
                      onChange={(e) => {
                        const next = [...draft.aiAutomation.automations];
                        next[idx] = {
                          ...auto,
                          status: e.target.value as AutomationStatus,
                        };
                        setDraft({
                          ...draft,
                          aiAutomation: { ...draft.aiAutomation, automations: next },
                        });
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm"
                    >
                      {(['Completed', 'Prototype', 'Experiment', 'Learning Project'] as const).map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    value={auto.workflowExplanation}
                    onChange={(e) => {
                      const next = [...draft.aiAutomation.automations];
                      next[idx] = { ...auto, workflowExplanation: e.target.value };
                      setDraft({
                        ...draft,
                        aiAutomation: { ...draft.aiAutomation, automations: next },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        aiAutomation: {
                          ...draft.aiAutomation,
                          automations: draft.aiAutomation.automations.filter(
                            (a) => a.id !== auto.id
                          ),
                        },
                      })
                    }
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-[#E6E4DF]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#18181B]">
                  AI Product Mockups &amp; Visuals
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const mock: AiMockupItem = {
                      id: `mock-${Date.now()}`,
                      title: 'New AI Mockup',
                      category: 'AI Product Mockup',
                      description: 'Description of visual concept',
                      imageUrl: '',
                    };
                    setDraft({
                      ...draft,
                      aiAutomation: {
                        ...draft.aiAutomation,
                        mockups: [mock, ...draft.aiAutomation.mockups],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium cursor-pointer"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add Mockup
                </button>
              </div>
              {draft.aiAutomation.mockups.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3"
                >
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const next = [...draft.aiAutomation.mockups];
                      next[idx] = { ...m, title: e.target.value };
                      setDraft({
                        ...draft,
                        aiAutomation: { ...draft.aiAutomation, mockups: next },
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-sm flex-1 min-w-[200px]"
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium cursor-pointer">
                    <Upload size={13} aria-hidden="true" />
                    Upload Visual
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadFile(file, 'image', (url) => {
                            const next = [...draft.aiAutomation.mockups];
                            next[idx] = { ...m, imageUrl: url };
                            setDraft({
                              ...draft,
                              aiAutomation: { ...draft.aiAutomation, mockups: next },
                            });
                          });
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        aiAutomation: {
                          ...draft.aiAutomation,
                          mockups: draft.aiAutomation.mockups.filter((i) => i.id !== m.id),
                        },
                      })
                    }
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <h2 className="font-display text-lg font-semibold text-[#18181B]">
              Case Studies &amp; Original Report Screenshots
            </h2>
            {draft.caseStudies.map((cs, csIdx) => (
              <div
                key={cs.id}
                className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-3"
              >
                <p className="text-xs font-mono text-[#1E3A5F]">{cs.number}</p>
                <input
                  type="text"
                  value={cs.title}
                  onChange={(e) => {
                    const next = [...draft.caseStudies];
                    next[csIdx] = { ...cs, title: e.target.value };
                    setDraft({ ...draft, caseStudies: next });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-sm font-medium"
                />
                <textarea
                  rows={2}
                  value={cs.overview}
                  onChange={(e) => {
                    const next = [...draft.caseStudies];
                    next[csIdx] = { ...cs, overview: e.target.value };
                    setDraft({ ...draft, caseStudies: next });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4D1C9] bg-white text-xs"
                />
                <div className="flex flex-wrap gap-3">
                  {cs.screenshots.map((shot, shotIdx) => (
                    <label
                      key={shot.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4D1C9] bg-white text-xs font-medium cursor-pointer"
                    >
                      <Upload size={13} aria-hidden="true" />
                      {shot.imageUrl ? 'Replace Screenshot' : `Upload: ${shot.label}`}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadFile(file, 'image', (url) => {
                              const nextCases = [...draft.caseStudies];
                              const nextShots = [...cs.screenshots];
                              nextShots[shotIdx] = { ...shot, imageUrl: url };
                              nextCases[csIdx] = { ...cs, screenshots: nextShots };
                              setDraft({ ...draft, caseStudies: nextCases });
                            });
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#18181B]">
              Contact Form Submissions
            </h2>
            {messages.length === 0 ? (
              <p className="text-sm text-[#71717A] py-6">
                No inquiries received yet. Messages sent via the Contact page appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#18181B]">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-[#52525B]">
                          From {msg.name} ({msg.email}) &middot;{' '}
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline cursor-pointer"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-[#3F3F46] whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
