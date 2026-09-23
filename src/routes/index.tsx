import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/seedco-pages';
export const Route = createFileRoute('/')({
  head: () => { const title='Seed Co Vegetables Zambia | The Home of Bumper Harvests'; const description='Certified vegetable seeds selected for Zambia’s agro-ecologies. Discover Seed Co vegetable varieties and grow your next bumper harvest.'; return { meta: [{title}, {name:'description',content:description}, {property:'og:title',content:title}, {property:'og:description',content:description}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }; },
  component: HomePage,
});
