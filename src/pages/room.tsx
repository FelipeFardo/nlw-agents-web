import { Navigate, useParams } from 'react-router-dom'

type RoomsParams = {
  roomId: string
}

export function RoomDetails() {
  const params = useParams<RoomsParams>()

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }
  return <div>Room Details</div>
}
