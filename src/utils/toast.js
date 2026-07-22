import toast from 'react-hot-toast';

/**
 * Show success toast with API message.
 */
export function showSuccess(message) {
  toast.success(message || 'Success');
}

/**
 * Show error toast from API or fallback message.
 */
export function showError(err, fallback = 'Something went wrong') {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  toast.error(message);
}
