import { GuideArticle, guideMetadata } from '../GuideArticle';

const slug = 'choose-a-correction-or-review';
export const metadata = guideMetadata(slug);
export default function Page() { return <GuideArticle slug={slug} />; }
