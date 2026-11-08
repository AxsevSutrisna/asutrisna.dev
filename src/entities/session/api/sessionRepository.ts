import { supabase } from "@/shared/api/supabaseClient"
import { wrapError, AppError } from "@/shared/api/errors"
import type { User } from "@supabase/supabase-js"

const ADMIN_ROLE = "admin"

/**
 * Pintu akses autentikasi & otorisasi. Menggantikan logika yang dulu
 * tergandakan di Login.jsx, ProtectedRoute.jsx, dan Dashboard logout.
 */
async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser()
  // getUser() mengembalikan error saat tak ada sesi — perlakukan sebagai null.
  if (error) return null
  return data.user ?? null
}

async function getRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (error) return null
  return (data?.role as string | undefined) ?? null
}

/** True bila ada sesi aktif DAN role-nya admin. */
async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  return (await getRole(user.id)) === ADMIN_ROLE
}

/**
 * Login + enforce role admin. Bila bukan admin, sesi di-signOut lalu throw.
 */
async function signInAsAdmin(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw wrapError(error, "Login gagal")

  const user = data.user
  const role = user ? await getRole(user.id) : null
  if (role !== ADMIN_ROLE) {
    await supabase.auth.signOut()
    throw new AppError("Akses ditolak: akun ini bukan admin.", {
      code: "not_admin",
    })
  }

  return user as User
}

async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw wrapError(error, "Gagal logout")
}

export const sessionRepository = {
  getCurrentUser,
  getRole,
  isAdmin,
  signInAsAdmin,
  signOut,
}
