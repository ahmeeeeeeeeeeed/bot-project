import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

console.log("🤖 Bot is running...")

supabase
  .channel('room_messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'room_messages'
  }, async (payload) => {

    const msg = payload.new.message
    const room_id = payload.new.room_id

    if (!msg) return

    let reply = null

    if (msg === "/ping") reply = "🟢 Pong"
    if (msg === "/help") reply = "/ping /help /time"
    if (msg === "/time") reply = new Date().toLocaleString()

    if (reply) {
      await supabase.from('room_messages').insert([
        {
          room_id,
          user: "bot",
          message: reply
        }
      ])
    }
  })
  .subscribe()
