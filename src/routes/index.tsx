import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/seedco-pages';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [{title:'Seed Co Vegetables Zambia | The Home of Bumper Harvests'}, {name:'description',content:'Certified vegetable seeds selected for Zambia’s agro-ecologies. Discover Seed Co vegetable varieties and grow your next bumper harvest.'}] }),
  component: HomePage,
});
