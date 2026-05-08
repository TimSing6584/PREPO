import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Navbar from '@/components/main/Navbar';
import { QuestionType } from '@/lib/generated/prisma/client';
import { prisma } from '@/app/utils/db';
import PersonalizedQuestionsClient from './PersonalizedQuestionsClient';

export default async function PersonalizedQuestionsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userKindeId = user?.id ?? '';

  const questions = userKindeId
    ? await prisma.question.findMany({
        where: {
          deleted: false,
          type: QuestionType.PERSONALIZED,
          createdById: userKindeId,
          topic: { deleted: false },
        },
        select: {
          id: true,
          createdAt: true,
          statement: true,
          imageUrl: true,
          topic: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    : [];

  const initialQuestions = questions.map((question) => ({
    ...question,
    createdAt: question.createdAt.toISOString(),
  }));

  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />
      <div className="flex-1 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <PersonalizedQuestionsClient initialQuestions={initialQuestions} />
          </div>
        </div>
      </div>
    </div>
  );
}
