import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isSpotsAdd = createRouteMatcher(['/spots/add']);

export default clerkMiddleware((auth, req) => {
  if (isSpotsAdd(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
