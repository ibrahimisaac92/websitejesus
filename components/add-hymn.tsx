"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function AddHymn() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Send to email logic (unchanged)
    const emailData = {
      title,
      content,
      timestamp: new Date().toISOString(),
    }

    try {
      await fetch("/api/send-hymn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })
      alert("تم إرسال الترنيمة بنجاح!")
    } catch (error) {
      alert("حدث خطأ أثناء الإرسال")
    }
  }

  const slides = content.split("\n\n")

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إضافة ترنيمة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان الترنيمة</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="أدخل عنوان الترنيمة" />
          </div>
          <div className="space-y-2">
            <Label>كلمات الترنيمة</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="أدخل كلمات الترنيمة"
              rows={5}
            />
          </div>
          <div className="flex gap-4">
            <Button type="button" onClick={() => setShowPreview(true)}>
              عرض كشرائح
            </Button>
            <Button type="submit">إرسال للإضافة</Button>
          </div>
        </form>

        {showPreview && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => setShowPreview(false)}>
              <X className="h-6 w-6" />
            </Button>

            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-4xl w-full text-center">
                <p className="text-4xl font-bold whitespace-pre-line">{slides[currentSlide]}</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePrevSlide} disabled={currentSlide === 0}>
                <ChevronRight className="h-6 w-6" />
              </Button>
              <span className="text-sm">
                {currentSlide + 1} من {slides.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextSlide}
                disabled={currentSlide === slides.length - 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

