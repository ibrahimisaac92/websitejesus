"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface AudioEntry {
  id: number
  filename: string
  format: string
  size: number
  duration: string
  created_at: string
  tags: string[]
  category: string
}

export default function AudioBible() {
  const [audioLibrary, setAudioLibrary] = useState<AudioEntry[]>([])
  const [selectedTestament, setSelectedTestament] = useState<string>("")
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<AudioEntry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const loadAudioLibrary = async () => {
      try {
        const response = await fetch('/audio_library.json', { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to fetch audio library")
        const data = await response.json()
        setAudioLibrary(data)
      } catch (error) {
        console.error("Error loading audio library:", error)
        setError("فشل تحميل المكتبة الصوتية. الرجاء المحاولة لاحقًا.")
      }
    }
    loadAudioLibrary()
  }, [])

  const availableTestaments = ["العهد القديم", "العهد الجديد"]

  const availableBooks = selectedTestament
    ? [...new Set(audioLibrary
        .filter(audio => audio.filename.includes(selectedTestament))
        .map(audio => audio.filename.split("/")[1])
      )]
    : []

  console.log("Available Books:", availableBooks)

  const availableChapters = selectedBook
    ? [...new Set(
        audioLibrary
          .filter(audio => audio.filename.includes(selectedBook))
          .map(audio => {
            const match = audio.filename.match(/\d+(?=\.mp3)/)
            return match ? parseInt(match[0]) : null
          })
      )].filter((num): num is number => num !== null).sort((a, b) => a - b)
    : []

  console.log("Available Chapters for", selectedBook, ":", availableChapters)

  useEffect(() => {
    if (selectedBook && selectedChapter !== null) {
      const audio = audioLibrary.find(
        (entry) => entry.filename.includes(selectedBook) && entry.filename.includes(` ${selectedChapter}.mp3`)
      )
      setSelectedAudio(audio || null)
    } else {
      setSelectedAudio(null)
    }
  }, [selectedBook, selectedChapter, audioLibrary])

  return (
    <Card className="rtl">
      <CardHeader>
        <CardTitle>الكتاب المقدس الصوتي</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Select value={selectedTestament} onValueChange={setSelectedTestament}>
            <SelectTrigger>
              <SelectValue placeholder="اختر العهد" />
            </SelectTrigger>
            <SelectContent>
              {availableTestaments.map((testament) => (
                <SelectItem key={testament} value={testament}>
                  {testament}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTestament && (
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger>
                <SelectValue placeholder="اختر السفر" />
              </SelectTrigger>
              <SelectContent>
                {availableBooks.length > 0 ? (
                  availableBooks.map((book) => (
                    <SelectItem key={book} value={book}>
                      {book}
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-gray-500 px-4 py-2">لا توجد أسفار متاحة</p>
                )}
              </SelectContent>
            </Select>
          )}

          {selectedBook && availableChapters.length > 0 && (
            <Select value={selectedChapter?.toString() || ""} onValueChange={(chapter) => setSelectedChapter(Number(chapter))}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الإصحاح" />
              </SelectTrigger>
              <SelectContent>
                {availableChapters.map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedAudio && (
          <div className="space-y-2">
            <audio 
              controls 
              ref={audioRef} 
              className="w-full" 
              onEnded={() => setSelectedAudio(null)}
              onError={() => console.error("Error loading audio file: ", `/audio/${selectedAudio.filename}`)}
            >
              <source src={`/audio/${selectedAudio.filename}`} type="audio/mpeg" />
              متصفحك لا يدعم تشغيل الملفات الصوتية.
            </audio>
            <p className="text-gray-400 text-sm">المسار: {`/audio/${selectedAudio.filename}`}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
