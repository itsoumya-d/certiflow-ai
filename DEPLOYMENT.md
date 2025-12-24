# Deployment Guide

## Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   GEMINI_API_KEY=your-gemini-api-key
   ```
4. Deploy!

### Docker

```bash
# Build
docker build -t certiflow-ai .

# Run
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e GEMINI_API_KEY=your-gemini-key \
  certiflow-ai
```

### Manual

```bash
npm install
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | Yes | Auth encryption key |
| `NEXTAUTH_URL` | Yes | Your app URL |
| `GEMINI_API_KEY` | No | Enables AI features |

---

## Health Check

After deployment, verify at:
```
GET /api/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": [...]
}
```

---

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@certiflow.ai | admin123 | Admin |
| auditor@certiflow.ai | auditor123 | Auditor |
| user@certiflow.ai | user123 | User |

---

## Production Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure proper `NEXTAUTH_URL`
- [ ] Add `GEMINI_API_KEY` for AI features
- [ ] Enable HTTPS
- [ ] Set up monitoring (health endpoint)
- [ ] Configure error tracking
