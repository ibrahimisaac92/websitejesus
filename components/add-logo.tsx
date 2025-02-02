import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddLogo() {
  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>شعار</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>نص الشعار</Label>
          <Input placeholder="أدخل نص الشعار" />
        </div>
        <div className="space-y-2">
          <Label>حجم الخط</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر حجم الخط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">صغير</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="large">كبير</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>نوع الخط</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الخط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">عادي</SelectItem>
              <SelectItem value="bold">عريض</SelectItem>
              <SelectItem value="italic">مائل</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full">حفظ الشعار</Button>
      </CardContent>
    </Card>
  )
}

