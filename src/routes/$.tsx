import { createFileRoute } from '@tanstack/react-router';
import catalogue from '@/lib/seedco-content.json';
import { ArticlePage, CategoryPage, ContactPage, ContentPage, FaqPage, ListingPage, NotFoundPage, ProductsPage, VarietyPage } from '@/components/seedco-pages';
export const Route = createFileRoute('/$')({
  head: ({params}) => { const slug=params._splat?.replace(/^\/+|\/+$/g,'') || ''; const item=[...catalogue.pages,...catalogue.articles,...catalogue.products,...catalogue.categories].find(i=>i.path===slug); const title=item ? ('title' in item ? item.title : item.name) : slug==='products'?'Our vegetables':slug==='news'?'News':slug==='blog'?'Blog':slug==='contact-us'?'Contact Us':'Seed Co Vegetables'; return {meta:[{title:`${title} | Seed Co Vegetables Zambia`},{name:'description',content:`Explore ${title} at Seed Co Vegetables Zambia — the home of bumper harvests.`}]}; },
  component: DynamicPage,
});
function DynamicPage(){
 const { _splat }=Route.useParams();
 const slug=_splat?.replace(/^\/+|\/+$/g,'') || '';
 if(slug==='products')return <ProductsPage/>;
 if(slug==='contact-us')return <ContactPage/>;
 if(slug==='news')return <ListingPage title="News" items={catalogue.articles} kind="news"/>;
 if(slug==='blog')return <ListingPage title="The blog" items={catalogue.articles} kind="blog"/>;
 if(slug==='media/faqs')return <FaqPage/>;
 const category=catalogue.categories.find(c=>c.path===slug); if(category)return <CategoryPage crop={category}/>;
 const product=catalogue.products.find(p=>p.path===slug); if(product)return <VarietyPage product={product}/>;
 const article=catalogue.articles.find(a=>a.path===slug); if(article)return <ArticlePage item={article}/>;
 const page=catalogue.pages.find(p=>p.path===slug); if(page)return <ContentPage item={page}/>;
 return <NotFoundPage/>;
}
