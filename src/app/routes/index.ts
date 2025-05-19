import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { TermsRoutes } from '../modules/Terms/terms.route';
import { PolicyRoutes } from '../modules/Policy/policy.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { TrackerRoutes } from '../modules/Mood Tracker/tracker.route';
import { HadithRoutes } from '../modules/Hadith/hadith.routes';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { JournalRoutes } from '../modules/Journal/journal.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/terms',
    route: TermsRoutes,
  },
  {
    path: '/policy',
    route: PolicyRoutes,
  },
  {
    path: '/mood-tracker',
    route: TrackerRoutes,
  },
  {
    path: '/hadith',
    route: HadithRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/journal',
    route: JournalRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
