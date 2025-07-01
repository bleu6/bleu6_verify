import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No code provided' });
  }

  try {
    const filePath = path.join(process.cwd(), 'api', 'codes.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const codes = JSON.parse(data);

    const code = codes.find(c => c.code === id);

    if (!code) {
      return res.status(404).json({ success: false, message: 'Code not recognized' });
    }

    if (code.used) {
      return res.status(200).json({ success: true, status: 'used', message: 'Code already used' });
    }

    return res.status(200).json({ success: true, status: 'valid', message: 'Code is authentic' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not read verification data.', error: error.message });
  }
}

