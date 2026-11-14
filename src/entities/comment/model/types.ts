/** Entity Comment (portfolio_comments; snake_case, tanpa mapper). */
export interface Comment {
  id: number | string
  content: string | null
  user_name: string | null
  profile_image: string | null
  is_pinned: boolean
  created_at?: string | null
}

export interface CommentInput {
  content: string
  user_name: string
  profile_image: string | null
}
