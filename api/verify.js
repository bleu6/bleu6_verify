import codes from './codes.json';

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'No code provided' });
  }

  const code = codes.find(c => c.code === id);

  if (!code) {
    return res.status(404).json({ status: 'invalid', message: 'Code not recognized' });
  }

  if (code.used) {
    return res.status(200).json({ status: 'used', message: 'Code already used' });
  }

  return res.status(200).json({ status: 'valid', message: 'Code is authentic' });
}
