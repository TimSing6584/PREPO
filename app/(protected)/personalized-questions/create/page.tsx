import { Suspense } from 'react';
import CreatePersonalizedQuestionPage from './CreatePersonalizedQuestionPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePersonalizedQuestionPage />
    </Suspense>
  );
}