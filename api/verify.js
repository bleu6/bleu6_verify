import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No code provided' });
  }

  try {
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Fetch error:', error.message);
      return res.status(404).json({ success: false, message: 'Code not recognized', error: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: 'Code not found' });
    }

    if (data.used) {
      return res.status(200).json({ success: true, status: 'used', message: 'Code already used' });
    }

    const { error: updateError } = await supabase
      .from('codes')
      .update({ used: true })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError.message);
      return res.status(500).json({ success: false, message: 'Could not mark code as used', error: updateError.message });
    }

    return res.status(200).json({ success: true, status: 'valid', message: 'Code is authentic' });
  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}


