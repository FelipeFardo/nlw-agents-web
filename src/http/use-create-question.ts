import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateQuestionRequest } from './types/create-question-request '
import type { CreateQuestionResponse } from './types/create-question-response'
import type { GetRoomQuestionsResponse } from './types/get-room-question-response'

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
      setTimeout(() => {
        return 0
      }, 3000)
      const result: CreateQuestionResponse = await response.json()
      return result
    },
    onMutate({ question }) {
      const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
        'get-questions',
        roomId,
      ])?.questions

      const questionsArray = questions ?? []

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      }

      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-questions', roomId],
        {
          questions: [newQuestion, ...questionsArray],
        }
      )

      return {
        newQuestion,
        questions,
      }
    },
    // onError(_error, _variables, context) {
    //   if (context?.questions) {
    //     queryClient.setQueryData<GetRoomQuestionsResponse>(
    //       ['get-questions', roomId],
    //       {
    //         questions: context.questions,
    //       }
    //     )
    //   }
    // },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-questions', roomId],
        (questionsResponse) => {
          if (!questionsResponse) {
            return questionsResponse
          }
          if (!context.newQuestion) {
            return questionsResponse
          }

          const updatedQuestions = questionsResponse?.questions.map(
            (question) => {
              if (question.id === context.newQuestion.id) {
                return {
                  ...context.newQuestion,
                  id: data.questionId,
                  answer: data.answer,
                  isGeneratingAnswer: false,
                }
              }
              return question
            }
          )
          return {
            questions: updatedQuestions,
          }
        }
      )
    },
  })
}
