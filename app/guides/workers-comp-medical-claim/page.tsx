import { GuideArticle, guideMetadata } from '../GuideArticle';

const slug = 'workers-comp-medical-claim';
export const metadata = guideMetadata(slug);
export default function Page() { return <GuideArticle slug={slug} />; }
