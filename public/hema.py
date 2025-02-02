import os
import json
import datetime
from mutagen.mp3 import MP3

def get_duration(file_path):
    try:
        audio = MP3(file_path)
        return str(datetime.timedelta(seconds=int(audio.info.length)))
    except Exception as e:
        print(f"خطأ في قراءة المدة: {str(e)}")
        return "00:00:00"

audio_folder = r"C:\Users\ibrahim isaac\Downloads\weeeb\public\audio-bible"
audio_data = []

print("\n--- بدء المعالجة ---")
print(f"المسار المستخدم: {audio_folder}")

# استخدم os.walk للوصول لجميع الملفات في المجلدات الفرعية
for root, dirs, files in os.walk(audio_folder):
    for filename in files:
        file_path = os.path.join(root, filename)
        
        print(f"\nجارٍ معالجة: {filename}")
        print(f"المسار الكامل: {file_path}")
        
        try:
            stat = os.stat(file_path)
            print(f"الحجم: {stat.st_size} بايت")
            
            file_ext = os.path.splitext(filename)[1].lower().replace('.', '')
            print(f"الامتداد: {file_ext}")
            
            duration = get_duration(file_path)
            print(f"المدة: {duration}")
            
            creation_time = datetime.datetime.fromtimestamp(stat.st_ctime)
            if creation_time.year > datetime.datetime.now().year + 1:
                creation_time = datetime.datetime.now()
            
            # حفظ المسار النسبي بدل اسم الملف فقط
            relative_path = os.path.relpath(file_path, audio_folder).replace('\\', '/')
            
            audio_data.append({
                "id": len(audio_data)+1,
                "filename": relative_path,
                "format": file_ext,
                "size": stat.st_size,
                "duration": duration,
                "created_at": creation_time.strftime('%Y-%m-%d %H:%M:%S'),
                "tags": ["عهد جديد" if "جديد" in filename else "عهد قديم"],
                "category": "الكتاب المقدس"
            })
            print("✓ تمت الإضافة بنجاح")
            
        except Exception as e:
            print(f"→ خطأ في المعالجة: {str(e)}")

# حفظ الملف
output_path = os.path.join(os.path.expanduser('~'), 'Downloads', 'audio_library.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(audio_data, f, indent=4, ensure_ascii=False)

print("\n--- النتائج ---")
print(f"عدد الملفات المعالجة: {len(audio_data)}")
print(f"مسار الملف الناتج: {output_path}")