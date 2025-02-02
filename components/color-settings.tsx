import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ColorSettings() {
  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>إعدادات الألوان</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>لون الخط</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر لون الخط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">أبيض</SelectItem>
              <SelectItem value="yellow">أصفر</SelectItem>
              <SelectItem value="green">أخضر</SelectItem>
              <SelectItem value="blue">أزرق</SelectItem>
              <SelectItem value="red">أحمر</SelectItem>
              <SelectItem value="purple">بنفسجي</SelectItem>
              <SelectItem value="orange">برتقالي</SelectItem>
              <SelectItem value="pink">وردي</SelectItem>
              <SelectItem value="teal">تركواز</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>لون الخلفية</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="اختر لون الخلفية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">أسود</SelectItem>
              <SelectItem value="darkblue">أزرق داكن</SelectItem>
              <SelectItem value="darkgreen">أخضر داكن</SelectItem>
              <SelectItem value="darkpurple">بنفسجي داكن</SelectItem>
              <SelectItem value="darkred">أحمر داكن</SelectItem>
              <SelectItem value="navy">كحلي</SelectItem>
              <SelectItem value="gray-900">رمادي داكن</SelectItem>
              <SelectItem value="brown">بني</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

