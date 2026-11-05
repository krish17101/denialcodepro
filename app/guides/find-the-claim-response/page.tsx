import { GuideArticle, guideMetadata } from '../GuideArticle';

const slug = 'find-the-claim-response';
export const metadata = guideMetadata(slug);
export default function Page() { return <GuideArticle slug={slug} />; }
