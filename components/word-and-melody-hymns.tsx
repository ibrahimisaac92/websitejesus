"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Play, Maximize, Minimize } from "lucide-react"

export default function WordAndMelodyHymns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videoFile, setVideoFile] = useState<string | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSearch = () => {
    // Simulating search in local folder
    const fileName = `${searchQuery.replace(/\s+/g, "_")}.mp4`
    setVideoFile(`/hymn-videos/${fileName}`)
  }

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullScreen(!isFullScreen)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ترانيم الكلمة واللحن</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>بحث عن ترنيمة</Label>
          <div className="relative">
            <Input
              type="search"
              placeholder="ابحث عن ترنيمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              onClick={handleSearch}
            />
          </div>
        </div>

        {videoFile && (
          <div className="relative">
            <video ref={videoRef} src={videoFile} controls className="w-full" />
            <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        )}

        <Button className="w-full" onClick={handleSearch} disabled={!searchQuery}>
          <Play className="mr-2 h-4 w-4" /> تشغيل الترنيمة
        </Button>
      </CardContent>
    </Card>
  )
}

