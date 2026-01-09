@---
task: Complete Padel Connect web application
test_command: "npm run dev"
---

# Task: Complete Padel Connect App

Finish building and fixing the Padel Connect web application - a Next.js app for connecting padel players and organizing matches.

## Requirements

1. Fix authentication flow (signup/login issues)
2. Ensure all components work properly
3. Fix TypeScript/linter errors
4. Verify database integration
5. Test complete user flow

## Success Criteria

1. [x] Fix signup flow to handle email confirmation properly
2. [x] Fix login flow to work after account creation
3. [x] Ensure player profile is created correctly on signup
4. [x] Fix all TypeScript errors in app files
5. [x] Verify dashboard loads and shows online players
6. [x] Test match request flow (send, accept, reject)
7. [x] Verify live match page works with real-time updates
8. [x] Ensure middleware protects routes correctly
9. [x] Test logout functionality
10. [x] Verify all components render without errors

## Example Test Flow

```
1. Sign up new account → Should create profile and redirect to dashboard
2. Log out → Should redirect to login
3. Log in → Should redirect to dashboard
4. See other players → Dashboard should show online players
5. Send match request → Should appear in recipient's dashboard
6. Accept match request → Should create match and redirect to live match page
7. View live match → Should show real-time status updates
```

---

## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes (check for errors)
4. Fix issues as they arise
5. When ALL criteria are [x], say: `RALPH_COMPLETE`
6. If stuck on the same issue 3+ times, say: `RALPH_GUTTER`
