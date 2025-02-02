"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf"

interface Attendance {
  name: string
  date: string
  notes: string
}

export default function AttendanceRecord() {
  const [servantName, setServantName] = useState("")
  const [serviceName, setServiceName] = useState("")
  const [attendees, setAttendees] = useState<Attendance[]>([])
  const [newName, setNewName] = useState("")
  const [newNote, setNewNote] = useState("")

  const handleAddAttendee = () => {
    if (newName.trim()) {
      setAttendees([
        ...attendees,
        {
          name: newName.trim(),
          date: new Date().toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          notes: newNote.trim()
        },
      ])
      setNewName("")
      setNewNote("")
    }
  }

  const createTableHTML = (pageAttendees: Attendance[]) => `
    <div style="width: 100%; display: flex; justify-content: center; margin-top: 10px;">
      <table style="width: 50%; max-width: 300px; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 4px; text-align: center; color: #000; width: 33%; font-size: 12px;">
              اسم المخدوم
            </th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center; color: #000; width: 33%; font-size: 12px;">
              تاريخ الحضور
            </th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center; color: #000; width: 33%; font-size: 12px;">
              ملاحظات
            </th>
          </tr>
        </thead>
        <tbody>
          ${pageAttendees.map(attendee => `
            <tr>
              <td style="border: 1px solid #000; padding: 4px; text-align: center; color: #000; font-size: 12px;">
                ${attendee.name}
              </td>
              <td style="border: 1px solid #000; padding: 4px; text-align: center; color: #000; font-size: 12px;">
                ${attendee.date}
              </td>
              <td style="border: 1px solid #000; padding: 4px; text-align: center; color: #000; font-size: 12px;">
                ${attendee.notes}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      })

      const attendeesPerPage = 15
      const pages = Math.ceil(attendees.length / attendeesPerPage)

      for(let i = 0; i < pages; i++) {
        if (i > 0) {
          doc.addPage()
        }

        const pageAttendees = attendees.slice(i * attendeesPerPage, (i + 1) * attendeesPerPage)
        
        const printElement = document.createElement('div')
        printElement.style.position = 'absolute'
        printElement.style.left = '-9999px'
        printElement.innerHTML = `
          <div id="print-content-${i}" style="direction: rtl; padding: 10px; font-family: Arial;">
            <div style="text-align: center; font-size: 16px; margin-bottom: 10px; color: #000;">
              سجل الحضور والغياب
            </div>
            <div style="font-size: 12px; margin-bottom: 5px; color: #000; text-align: right;">
              الخادم: ${servantName}
            </div>
            <div style="font-size: 12px; margin-bottom: 10px; color: #000; text-align: right;">
              الخدمة: ${serviceName}
            </div>
            ${createTableHTML(pageAttendees)}
          </div>
        `
        document.body.appendChild(printElement)

        const element = document.getElementById(`print-content-${i}`)
        if (!element) continue

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })

        document.body.removeChild(printElement)

        const imgData = canvas.toDataURL('image/png')
        const pageWidth = doc.internal.pageSize.getWidth()
        const imgWidth = pageWidth - 40
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        doc.addImage(imgData, 'PNG', 20, 10, imgWidth, imgHeight)
      }

      doc.save(`سجل_الحضور_${serviceName}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("حدث خطأ أثناء إنشاء الملف")
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl text-primary text-center">
          نظام تسجيل الحضور
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>اسم الخادم</Label>
            <Input
              value={servantName}
              onChange={(e) => setServantName(e.target.value)}
              placeholder="أدخل اسم الخادم"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label>اسم الخدمة</Label>
            <Input
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="أدخل اسم الخدمة"
              className="text-right"
            />
          </div>
        </div>

        {servantName && serviceName && (
          <>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddAttendee} 
                  className="min-w-[100px]"
                  disabled={!newName.trim()}
                >
                  إضافة
                </Button>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="اسم المخدوم الجديد"
                  className="text-right"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newName.trim()) handleAddAttendee()
                  }}
                />
              </div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="ملاحظات..."
                className="text-right h-20"
              />
            </div>

            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right bg-gray-800 text-white w-[33%]">
                      اسم المخدوم
                    </TableHead>
                    <TableHead className="text-right bg-gray-800 text-white w-[33%]">
                      تاريخ الحضور
                    </TableHead>
                    <TableHead className="text-right bg-gray-800 text-white w-[33%]">
                      ملاحظات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee, index) => (
                    <TableRow key={index} className="text-gray-100">
                      <TableCell className="text-right">
                        {attendee.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {attendee.date}
                      </TableCell>
                      <TableCell className="text-right">
                        {attendee.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {attendees.length > 0 && (
              <Button
                onClick={generatePDF}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                تصدير إلى PDF
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}