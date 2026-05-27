# Feature: Security

## Implementation

- Middleware for auth
- Zod validation on all routes
- Rate limiting

---

## API Layer

All routes must:
1. Validate input
2. Check auth
3. Sanitize data

---

## Notes
- Never trust client input