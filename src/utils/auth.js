// Where each role should go after login
export const ROLE_REDIRECT = {
  super_admin: '/super-admin-panel/dashboard',
  clinic: '/clinic-panel',
  clinic_admin: '/clinic-panel',
  doctor: '/doctor-panel',
};

/**
 * Get JWT token saved after login.
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return '';

  return localStorage.getItem('auth_token') || '';
}

/**
 * Pick the main role when user has multiple roles.
 */
export function getPrimaryRole(roles = []) {
  const priority = ['super_admin', 'clinic_admin', 'clinic', 'doctor'];

  for (const role of priority) {
    if (roles.includes(role)) return role;
  }

  return roles[0] || null;
}

/**
 * Get redirect URL based on user roles from API.
 */
export function getRedirectPath(roles = []) {
  const role = getPrimaryRole(roles);
  return ROLE_REDIRECT[role] || null;
}

/**
 * Save user + token after successful login.
 */
export function saveUserSession(user, token) {
  const role = getPrimaryRole(user.roles);
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;

  localStorage.setItem('auth_token', token);
  localStorage.setItem(
    'user_auth',
    JSON.stringify({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role,
      roles: user.roles,
      name,
      profile_image: user.profile_image,
    })
  );
}

/**
 * Read saved user session.
 */
export function getUserAuth() {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('user_auth');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear session on logout.
 */
export function clearUserSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_auth');
}

// Keep old names used in other files
export const saveAuthToken = (token) => localStorage.setItem('auth_token', token);
export const removeAuthToken = clearUserSession;
