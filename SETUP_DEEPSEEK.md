# 🚀 DeepSeek API Setup Guide

## Why DeepSeek Instead of OpenAI?

✅ **Much Higher Rate Limits** - Won't hit limits easily
✅ **Cheaper/Free tier** - More generous than OpenAI
✅ **Faster responses** - Quick interview feedback
✅ **Same API format** - Uses OpenAI-compatible API
✅ **Better for development** - No constant rate limit errors

---

## 📝 Get Your Free DeepSeek API Key

### Step 1: Create Account
1. Go to https://platform.deepseek.com/
2. Click "Sign Up" or "Login"
3. Register with email or Google/GitHub

### Step 2: Get API Key
1. After login, go to https://platform.deepseek.com/api_keys
2. Click "Create API Key"
3. Give it a name (e.g., "CodePrep AI")
4. Click "Create"
5. **COPY THE KEY** - You won't see it again!

It will look like: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Add to Your .env File
1. Open `backend\.env` in your editor
2. Find the line: `DEEPSEEK_API_KEY=your_deepseek_api_key_here`
3. Replace `your_deepseek_api_key_here` with your actual key

Example:
```env
DEEPSEEK_API_KEY=sk-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### Step 4: Restart Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
✅ DeepSeek AI initialized
🚀 Server running on port 5000
```

---

## 🎯 That's It!

Now your AI interviews will work without rate limit issues!

---

## 💰 Pricing (As of 2025)

DeepSeek is very affordable:
- **DeepSeek-Chat (V3)**: ~$0.27 per million input tokens
- **Much cheaper** than GPT-4
- **Free tier** available for testing

For your interview app, you'll get thousands of interview sessions before hitting any limits!

---

## 🔧 What Changed in the Code?

We updated these files to use DeepSeek:

1. **backend/.env**
   - Added `DEEPSEEK_API_KEY`
   - Added `DEEPSEEK_BASE_URL`
   - Added `AI_MODEL=deepseek-chat`

2. **backend/services/openai.js**
   - Changed to use DeepSeek base URL
   - Uses `deepseek-chat` model
   - Still uses OpenAI SDK (compatible!)

---

## ✅ Benefits You Get

| Feature | OpenAI Free | DeepSeek |
|---------|-------------|----------|
| Rate Limits | 3 req/min | Much higher |
| Speed | Medium | Fast |
| Cost | Limited free | Generous free |
| Interview Quality | Good | Good |
| Rate Limit Errors | Often | Rare |

---

## 🆘 Troubleshooting

### "DeepSeek API key not configured"
→ Make sure you added the key to `backend/.env`
→ Restart the backend server

### "Invalid API key"
→ Check you copied the full key
→ Make sure no extra spaces

### Still getting errors?
→ Check you have internet connection
→ Verify API key is active at https://platform.deepseek.com/api_keys

---

## 📚 DeepSeek Models Available

- **deepseek-chat** - General purpose (what we use)
- **deepseek-reasoner** - With thinking mode
- Both are DeepSeek-V3.2-Exp under the hood

We use `deepseek-chat` for fast, direct responses perfect for interviews!

---

## 🎉 Ready to Use!

Once you have your API key configured, you can:
- ✅ Start unlimited AI interviews
- ✅ Get instant feedback
- ✅ No rate limit worries
- ✅ Faster responses than before

---

**Get your free API key now: https://platform.deepseek.com/api_keys** 🚀
