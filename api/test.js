import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server crash', error: err.message });
  }
}
