import { API_BASE_URL } from '@/config/api';

const MALE_DOCTOR_AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300",
];

const FEMALE_DOCTOR_AVATARS = [
  "https://images.unsplash.com/photo-1594824813689-5374beaa8a04?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=300&h=300",
];

/**
 * Returns a fully qualified URL for any local or remote image path.
 */
export function getFullImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();
  if (!cleanUrl) return '';

  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  const backendHost = (API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  const cleanPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  return `${backendHost}${cleanPath}`;
}

/**
 * Resolves doctor profile photo with high-quality fallback based on doctor gender & id.
 */
export function getDoctorImageUrl(doc) {
  if (!doc) return MALE_DOCTOR_AVATARS[0];

  const rawUrl =
    doc.profile_image ||
    doc.user?.profile_image ||
    doc.photo_url ||
    doc.doctorProfile?.profile_image ||
    doc.profile_photo ||
    '';

  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() && !rawUrl.includes('placehold.co')) {
    return getFullImageUrl(rawUrl);
  }

  // Fallback: Pick a distinct realistic doctor avatar based on gender and doctor ID / name
  const gender = String(doc.gender || doc.doctorProfile?.gender || doc.user?.gender || '').toLowerCase();
  const rawId = doc.id || doc.user?.id || doc.doctorProfile?.id || 1;
  const numId = typeof rawId === 'number' ? rawId : String(rawId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (gender === 'female' || gender === 'f') {
    return FEMALE_DOCTOR_AVATARS[numId % FEMALE_DOCTOR_AVATARS.length];
  } else if (gender === 'male' || gender === 'm') {
    return MALE_DOCTOR_AVATARS[numId % MALE_DOCTOR_AVATARS.length];
  }

  const combined = [...MALE_DOCTOR_AVATARS, ...FEMALE_DOCTOR_AVATARS];
  return combined[numId % combined.length];
}

/**
 * Error fallback for doctor images that fail to load
 */
export function handleDoctorImageError(e, gender = 'male') {
  if (e?.currentTarget) {
    const fallbackList = gender === 'female' ? FEMALE_DOCTOR_AVATARS : MALE_DOCTOR_AVATARS;
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackList[0];
  }
}
