import { prisma } from "@/app/utils/db";
async function getQuestions() {
    const res = await prisma.question.findMany({
        select: {
            id: true,
            statement: true,
        }
    });
    return res;
}
export default async function Test() {
    const questions = await getQuestions();
    return (
        <div>
            {questions.map((question) => (
                <div key={question.id}>
                    # I want to change text to be hite please recommend me
                    <p className='text-lg text-white'>{question.statement}</p>
                </div>
            ))}
        </div>
    );
}