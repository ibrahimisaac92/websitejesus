"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react"

interface Song {
  title: string
  verses: string[][]
  chorus?: string[]
  formated?: boolean
  chorusFirst?: boolean
  type: 'song'
}

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  type: 'bible'
}

type SearchResult = Song | BibleVerse

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [bible, setBible] = useState<BibleVerse[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // تحميل البيانات
  useEffect(() => {
    const loadData = async () => {
      try {
        // تحميل الترانيم
        const songsRes = await fetch("/songs.json")
        if (!songsRes.ok) throw new Error(`Failed to load songs`)
        const songsData = await songsRes.json()
        setSongs(songsData.map((song: Song) => ({...song, type: 'song'})))

        // تحميل الكتاب المقدس
        const bibleRes = await fetch("/bible.json")
        if (!bibleRes.ok) throw new Error(`Failed to load bible`)
        const bibleData = await bibleRes.json()
        setBible(bibleData.map((verse: BibleVerse) => ({...verse, type: 'bible'})))

      } catch (error) {
        console.error("Error loading data:", error)
        setError("فشل تحميل البيانات. الرجاء المحاولة لاحقًا.")
      }
    }
    loadData()
  }, [])

  // البحث
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }
      
      const normalizedQuery = searchQuery.toLowerCase().trim()
      
      // البحث في الترانيم
      const songsResults = songs.filter(song => 
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.verses.some(verse => verse.some(line => line.toLowerCase().includes(normalizedQuery))) ||
        (song.chorus && song.chorus.some(line => line.toLowerCase().includes(normalizedQuery)))
      )

      // البحث في الكتاب المقدس
      const bibleResults = bible.filter(verse => 
        verse.text.toLowerCase().includes(normalizedQuery)
      )

      setSearchResults([...songsResults, ...bibleResults])
    }, 300)
    
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, songs, bible])

  // تحديد العنصر
  const handleItemSelect = (item: SearchResult) => {
    setSelectedItem(item)
    setCurrentSlide(0)
    setShowFullScreen(true)
    setSearchQuery("")
    setSearchResults([])
  }

  // تنسيق المحتوى
  const formatContent = useCallback((item: SearchResult) => {
    if (item.type === 'song') {
      const song = item as Song
      let content: string[] = []
      if (song.chorusFirst && song.chorus) content.push(...song.chorus)
      song.verses.forEach((verse, idx) => {
        content.push(...verse)
        if (song.chorus && !song.chorusFirst && idx < song.verses.length - 1) {
          content.push(...song.chorus)
        }
      })
      return content
    }
    
    // للكتاب المقدس
    const verse = item as BibleVerse
    return [`${verse.book} ${verse.chapter}:${verse.verse}`, verse.text]
  }, [])

  // التنقل
  const handleNextSlide = useCallback(() => {
    if (!selectedItem) return
    const maxSlides = formatContent(selectedItem).length
    setCurrentSlide(prev => (prev < maxSlides - 1 ? prev + 1 : prev))
  }, [selectedItem, formatContent])

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev))
  }, [])

  // تفعيل اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextSlide()
      if (e.key === "ArrowLeft") handlePrevSlide()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleNextSlide, handlePrevSlide])

  return (
    <div className="relative min-h-screen">
      {/* شريط البحث */}
      {!showFullScreen && (
        <div className="p-4 max-w-xl mx-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="ابحث عن ترنيمة أو آية..."
              className="w-full pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          
          {searchResults.length > 0 && (
            <Card className="mt-2 absolute w-full z-50">
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-right justify-start"
                    onClick={() => handleItemSelect(item)}
                  >
                    {item.type === 'song' ? 
                      (item as Song).title : 
                      `${(item as BibleVerse).book} ${(item as BibleVerse).chapter}:${(item as BibleVerse).verse}`
                    }
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* عرض المحتوى */}
      {showFullScreen && selectedItem && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="text-center max-w-4xl w-full">
              <p className="text-6xl font-bold text-white leading-tight whitespace-pre-line">
                {formatContent(selectedItem)[currentSlide]}
              </p>
            </div>
          </div>

          {/* عناصر التحكم */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8">
            <Button
              variant="outline"
              size="icon"
              className="text-white border-white hover:bg-white/10"
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            
            <span className="text-white text-lg">
              {currentSlide + 1} / {formatContent(selectedItem).length}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="text-white border-white hover:bg-white/10"
              onClick={handleNextSlide}
              disabled={currentSlide === formatContent(selectedItem).length - 1}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-white/10"
            onClick={() => setShowFullScreen(false)}
          >
            <X className="h-8 w-8" />
          </Button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      )}
    </div>
  )
}