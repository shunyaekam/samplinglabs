'use client'

import { useState } from 'react'

interface Note {
  id: string
  content: string
  timestamp: string
  section: string
}

export default function CourseNotes({ courseId }: { courseId: string }) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Important concepts from introduction section',
      timestamp: '2024-01-26T10:30:00',
      section: 'Introduction'
    },
    {
      id: '2',
      content: 'Key takeaways from the core principles discussion',
      timestamp: '2024-01-26T11:15:00',
      section: 'Core Principles'
    }
  ])
  const [newNote, setNewNote] = useState('')

  const addNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: new Date().toISOString(),
      section: 'Current Section' // This should be dynamic based on current section
    }

    setNotes(prev => [note, ...prev])
    setNewNote('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Course Notes</h3>
        <p className="text-sm text-gray-500 mt-1">
          Take notes as you progress through the course
        </p>
      </div>

      <form onSubmit={addNote} className="space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={!newNote.trim()}
          >
            Add Note
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-50 p-4 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-indigo-600">
                {note.section}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(note.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-900">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 