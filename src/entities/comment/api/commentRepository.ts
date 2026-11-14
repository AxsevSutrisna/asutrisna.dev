import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { uploadFile } from "@/shared/api/storage"
import { subscribe as subscribeTable } from "@/shared/api/realtime"
import type { Comment, CommentInput } from "@/entities/comment/model/types"

const PROFILE_BUCKET = "profile-images"

/** Komentar yang dipin (maksimal satu). Null bila tidak ada. */
async function fetchPinned(): Promise<Comment | null> {
  const { data, error } = await supabase
    .from("portfolio_comments")
    .select("*")
    .eq("is_pinned", true)
    .maybeSingle()

  if (error) throw wrapError(error, "Gagal memuat pinned comment")
  return (data as Comment | null) ?? null
}

/** Komentar reguler (non-pin), terbaru dulu. */
async function fetchRegular(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("portfolio_comments")
    .select("*")
    .eq("is_pinned", false)
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat comments")
  return (data ?? []) as Comment[]
}

/**
 * Upload foto profil. Skema penamaan lama dipertahankan (prefix "profile-images/"
 * di dalam bucket "profile-images", nama acak + ekstensi file).
 */
async function uploadProfileImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()
  const path = `profile-images/${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}.${ext}`
  return uploadFile(PROFILE_BUCKET, file, { path })
}

async function add(input: CommentInput): Promise<void> {
  const { error } = await supabase.from("portfolio_comments").insert([
    {
      content: input.content,
      user_name: input.user_name,
      profile_image: input.profile_image,
      is_pinned: false,
      created_at: new Date().toISOString(),
    },
  ])
  if (error) throw wrapError(error, "Gagal mengirim komentar")
}

/** Realtime untuk komentar reguler (filter is_pinned=false). */
function subscribeRegular(onChange: () => void): () => void {
  return subscribeTable(
    {
      channel: "portfolio_comments",
      table: "portfolio_comments",
      event: "*",
      filter: "is_pinned=eq.false",
    },
    () => onChange()
  )
}

export const commentRepository = {
  fetchPinned,
  fetchRegular,
  uploadProfileImage,
  add,
  subscribeRegular,
}
