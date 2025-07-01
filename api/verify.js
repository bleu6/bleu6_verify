import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;

  // No ID provided
  if (!id) {
    return res.status(400).json({ success: false, message: 'No product ID provided.' });
  }

const filePath = path.join(__dirname, 'codes.json');
  let codes;

  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    codes = JSON.parse(fileData);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not read verification data.' });
  }

  const codeData = codes[id];

  if (!codeData) {
    return res.status(404).json({ success: false, message: 'Invalid product code.' });
  }

  if (codeData.status !== 'valid') {
    return res.status(403).json({ success: false, message: 'This product is not authentic.' });
  }

  if (codeData.used) {
    return res.status(409).json({ success: false, message: 'This product has already been verified.' });
  }

  // If valid and unused
  return res.status(200).json({
    success: true,
    message: '✅ This BLEU6 product is authentic.',
    drop: codeData.drop,
    id,
  });
}
🧪 Test It:
After you commit the file:

Go to your browser

Visit:
👉 https://verify.bleu6.com/api/verify?id=TEE21

You should get:

json
Copy
Edit
{
  "success": true,
  "message": "✅ This BLEU6 product is authentic.",
  "drop": "001",
  "id": "TEE21"
}
Try also:

TEE22 → should say already verified

TEEFAKE1 → should say not authentic

no id → should return error

Let me know once tested — then we’ll move to Step 3: Connect this to your frontend landing page.









Ask ChatGPT



