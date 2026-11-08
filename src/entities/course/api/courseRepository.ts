import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import type { Course } from "@/entities/course/model/types"

async function fetchAll(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat courses")
  return (data ?? []) as Course[]
}

export const courseRepository = { fetchAll }
