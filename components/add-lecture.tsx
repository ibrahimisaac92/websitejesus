"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import pptxgen from "pptxgenjs"

interface Slide {
  content: string
  fontSize: string
  fontColor: string
  backgroundColor: string
  alignment: "left" | "center" | "right"
}

export default function AddLecture() {
  const [slideCount, setSlideCount] = useState<number>(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleSlideCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number.parseInt(e.target.value) || 0
    setSlideCount(count)
    setSlides(
      Array(count)
        .fill(null)
        .map(() => ({
          content: "",
          fontSize: "medium",
          fontColor: "white",
          backgroundColor: "black",
          alignment: "center",
        })),
    )
  }

  const handleContentChange = (index: number, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], content: value }
    setSlides(newSlides)
  }

  const handleStyleChange = (index: number, property: keyof Slide, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [property]: value }
    setSlides(newSlides)
  }

  const getFontSize = (size: string) => {
    switch (size) {
      case "small":
        return "text-lg"
      case "medium":
        return "text-2xl"
      case "large":
        return "text-4xl"
      default:
        return "text-2xl"
    }
  }

  const saveToPowerPoint = () => {
    const pptx = new pptxgen()
    slides.forEach((slide) => {
      const pptSlide = pptx.addSlide()
      pptSlide.addText(slide.content, {
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fontSize: Number.parseInt(slide.fontSize) * 2,
        color: slide.fontColor,
        align: slide.alignment,
        valign: "middle",
      })
      pptSlide.background = { color: slide.backgroundColor }
    })
    pptx.writeFile("lecture.pptx")
  }

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>إضافة محاضرة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>عدد الشرائح</Label>
          <Input type="number" min="0" value={slideCount} onChange={handleSlideCountChange} />
        </div>

        {slides.map((slide, index) => (
          <Card key={index} className="p-4 space-y-4 bg-gray-800">
            <h3 className="font-bold">شريحة {index + 1}</h3>

            <div className="space-y-2">
              <Label>محتوى الشريحة</Label>
              <Textarea value={slide.content} onChange={(e) => handleContentChange(index, e.target.value)} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>حجم الخط</Label>
                <Select value={slide.fontSize} onValueChange={(value) => handleStyleChange(index, "fontSize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحجم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">صغير</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="large">كبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>لون الخط</Label>
                <Select value={slide.fontColor} onValueChange={(value) => handleStyleChange(index, "fontColor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللون" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">أبيض</SelectItem>
                    <SelectItem value="yellow">أصفر</SelectItem>
                    <SelectItem value="green">أخضر</SelectItem>
                    <SelectItem value="blue">أزرق</SelectItem>
                    <SelectItem value="red">أحمر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>لون الخلفية</Label>
                <Select
                  value={slide.backgroundColor}
                  onValueChange={(value) => handleStyleChange(index, "backgroundColor", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخلفية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">أسود</SelectItem>
                    <SelectItem value="darkblue">أزرق داكن</SelectItem>
                    <SelectItem value="darkgreen">أخضر داكن</SelectItem>
                    <SelectItem value="gray">رمادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleStyleChange(index, "alignment", "left")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleStyleChange(index, "alignment", "center")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleStyleChange(index, "alignment", "right")}>
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {slideCount > 0 && (
          <div className="flex gap-4">
            <Button className="flex-1" onClick={() => setShowPreview(true)}>
              عرض المحاضرة
            </Button>
            <Button className="flex-1" onClick={saveToPowerPoint}>
              حفظ كملف PowerPoint
            </Button>
          </div>
        )}

        {showPreview && slides.length > 0 && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <div
              className="w-full h-full flex items-center justify-center p-8"
              style={{ backgroundColor: slides[currentSlide].backgroundColor }}
            >
              <p
                className={`${getFontSize(slides[currentSlide].fontSize)} text-center whitespace-pre-line`}
                style={{
                  color: slides[currentSlide].fontColor,
                  textAlign: slides[currentSlide].alignment,
                }}
              >
                {slides[currentSlide].content}
              </p>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))}
                disabled={currentSlide === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                إغلاق
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev))}
                disabled={currentSlide === slides.length - 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

