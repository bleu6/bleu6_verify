import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'No code provided' });
  }
const filePath = path.resolve('./api/codes.json');
  let codes;

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    codes = JSON.parse(data);

    const codeIndex = codes.findIndex((c) => c.code === id);

    if (codeIndex === -1) {
      return res.status(404).json({ success: false, status: 'invalid', message: 'Code not recognized' });
    }

    if (codes[codeIndex].used) {
      return res.status(200).json({ success: true, status: 'used', message: 'Code already used' });
    }

    // Mark code as used
    codes[codeIndex].used = true;
    fs.writeFileSync(filePath, JSON.stringify(codes, null, 2));

    return res.status(200).json({ success: true, status: 'valid', message: 'Code is authentic' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not read verification data.', error: error.message });
  }
}

