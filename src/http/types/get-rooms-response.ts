export type GetRoomsResponse = {
  rooms: Array<{
    id: string
    name: string
    questionsCount: number
    createdAt: string
  }>
}
