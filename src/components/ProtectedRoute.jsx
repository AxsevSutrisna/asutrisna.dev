import { Navigate } from "react-router-dom"
import { useAdminGuard } from "@/entities/session/model/useSession"

export default function ProtectedRoute({ children }) {
  const allowed = useAdminGuard()

  if (allowed === null) return null
  if (!allowed) return <Navigate to="/login" />

  return children
}
