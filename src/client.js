import { createClient } from "@supabase/supabase-js"

const URL = 'https://twocuxamptzczekkpqtp.supabase.co'
const API_KEY = 'sb_publishable_l0wNO5mAHJclihw20PExXg_KMp72i9K'

export const supabase = createClient(URL, API_KEY)