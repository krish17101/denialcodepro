import { GuideArticle, guideMetadata } from '../GuideArticle';

const slug = 'build-a-deadline-evidence-record';
export const metadata = guideMetadata(slug);
export default function Page() { return <GuideArticle slug={slug} />; }
