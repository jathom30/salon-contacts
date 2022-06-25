import { createNote, deleteNote, getNotes, updateNote } from "api"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import { Note } from "typings"

export const useUpdateNotes = () => {
  const { id } = useParams()
  const NOTES_QUERY_KEY = ['notes', id]
  const queryClient = useQueryClient()

  const notesQuery = useQuery(
    NOTES_QUERY_KEY,
    () => getNotes(id || ''),
    {
      enabled: !!id,
    }
  )
  const notes = notesQuery.data?.map(d => d.fields) as unknown as Note[] | undefined

  const createNoteMutation = useMutation(createNote, {
    onSettled: () => {
      queryClient.invalidateQueries(NOTES_QUERY_KEY)
    }
  })

  const updateNoteMutation = useMutation(updateNote, {
    onSettled: () => {
      queryClient.invalidateQueries(NOTES_QUERY_KEY)
    }
  })

  const deleteNoteMutation = useMutation(deleteNote, {
    onSettled: () => {
      queryClient.invalidateQueries(NOTES_QUERY_KEY)
    }
  })


  return {
    notes,
    createMutate: createNoteMutation.mutate,
    updateMutate: updateNoteMutation.mutate,
    deleteMutate: deleteNoteMutation.mutate,
  }

}