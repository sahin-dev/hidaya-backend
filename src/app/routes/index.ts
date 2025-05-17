import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { TermsRoutes } from '../modules/Terms/terms.route';
import { PolicyRoutes } from '../modules/Policy/policy.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/terms',
    route: TermsRoutes,
  },
  {
    path: '/policy',
    route: PolicyRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
