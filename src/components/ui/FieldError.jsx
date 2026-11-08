/**
 * Pesan error field form.
 * Sebelumnya diduplikasi inline (identik) di banyak screen dashboard.
 */
export function FieldError({ message }) {
  return message ? (
    <p className="mt-2 text-sm text-red-400">{message}</p>
  ) : null
}
