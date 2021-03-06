import { FieldSet, Records } from "airtable"
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

  const notesSortedByDate = notes?.sort((a, b) => {
    // creates a number which can more reliably be compared 
    const aTime = new Date(a.date).getTime()
    const bTime = new Date(b.date).getTime()
    if (aTime < bTime) {
      return 1
    } 
    return -1
  })

  const createNoteMutation = useMutation(createNote, {
    onMutate: async (newNote) => {
      await queryClient.cancelQueries(NOTES_QUERY_KEY)

      const prevNotes = queryClient.getQueryData<Records<FieldSet>>(NOTES_QUERY_KEY)

      if (prevNotes) {
        queryClient.setQueryData(NOTES_QUERY_KEY, [
          ...prevNotes,
          {
            // temp id will be replaced when notesQuery completes
            id: 'temp',
            fields: {
              id: 'temp',
              ...newNote,
            }
          }
        ])
      }

      return { prevNotes}
    },
    onSettled: () => {
      queryClient.invalidateQueries(NOTES_QUERY_KEY)
    }
  })

  const updateNoteMutation = useMutation(updateNote, {
    onMutate: async (newNote) => {
      await queryClient.cancelQueries(NOTES_QUERY_KEY)

      const prevNotes = queryClient.getQueryData<Records<FieldSet>>(NOTES_QUERY_KEY)

      if (prevNotes) {
        const updatedNote = prevNotes.find(prevNote => prevNote.id === newNote.id)
        const noteWithUpdatedField = {
          ...updatedNote,
          fields: newNote
        }
        const index = prevNotes.findIndex(prevNote => prevNote.id === newNote.id)
        const updatedNotes = [...prevNotes.slice(0, index), noteWithUpdatedField, ...prevNotes.slice(index + 1)]
        queryClient.setQueryData(NOTES_QUERY_KEY, updatedNotes)
      }

      return { prevNotes }

    },
    onSettled: () => {
      queryClient.invalidateQueries(NOTES_QUERY_KEY)
    }
  })

  const deleteNoteMutation = useMutation(deleteNote, {
    onSettled: () => {
      queryClient.invalidateQueries(NOTES_QUERY_KEY)
    }
  })

  const deleteAllNotesMutation = useMutation(async () => {
    const noteIds = notes?.map(note => note.id) || []
    const responses = noteIds.map(async id => {
      const response = await deleteNote(id)
      return response
    })
    return Promise.all(responses)
  })


  return {
    notes: notesSortedByDate,
    notesLoading: notesQuery.isLoading,
    createMutate: createNoteMutation.mutate,
    updateMutate: updateNoteMutation.mutate,
    deleteMutate: deleteNoteMutation.mutate,
    deleteLoading: deleteNoteMutation.isLoading,
    deleteAllNotesMutation
  }
}
