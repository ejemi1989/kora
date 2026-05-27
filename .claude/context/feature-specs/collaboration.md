# Feature: Collaboration

## Prisma Mapping

model Project {
  id      String @id @default(uuid())
  ownerId String
  name    String
}

model ProjectCollaborator {
  id        String @id @default(uuid())
  projectId String
  email     String
}

---

## API Routes

### POST /api/projects

### POST /api/projects/:id/invite

### GET /api/projects

---

## Notes
- Enforce access control