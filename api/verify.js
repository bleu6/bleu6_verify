import fs from 'fs';
import path from 'path';
import codes from './codes.json';

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No code provided' });
  }

  const codeIndex = codes.findIndex(c => c.code === id);

  if (codeIndex === -1) {
    return res.status(404).json({ success: false, status: 'invalid', message: 'Code not recognized' });
  }

  const code = codes[codeIndex];

  if (code.used) {
    return res.status(200).json({ success: true, status: 'used', message: 'Code already used' });
  }

  // Mark code as used
  code.used = true;

  try {
    const filePath = path.resolve('./api/codes.json');
    fs.writeFileSync(filePath, JSON.stringify(codes, null, 2));
    return res.status(200).json({ success: true, status: 'valid', message: 'Code is authentic' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not mark code as used', error: error.message });
  }
}

