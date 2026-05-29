const fs = require('fs');
const dotenv = fs.readFileSync('.env', 'utf-8').split('\n');
for (const line of dotenv) {
  if (line.includes('=')) {
    const [k, v] = line.split('=');
    process.env[k.trim()] = v.trim().replace(/^"|"$/g, '');
  }
}

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  
  const { data: chats, error } = await supabase.from('chats').select('*');
  console.log("Chats:", chats);
  if (error) console.error("Error:", error);
}
main().catch(console.error);
