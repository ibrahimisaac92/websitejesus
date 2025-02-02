import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ColorSettings from "@/components/color-settings"
import AddLogo from "@/components/add-logo"
import AddHymn from "@/components/add-hymn"
import AudioBible from "@/components/audio-bible"
import InstallButton from "@/components/install-button"
import AddLecture from "@/components/add-lecture"
import AttendanceRecord from "@/components/attendance-record"
import WordAndMelodyHymns from "@/components/word-and-melody-hymns"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <InstallButton />
      <main className="container mx-auto p-6 space-y-8 flex-1">
        <Header />
        <HeroSection />
        <div className="space-y-8 max-w-4xl mx-auto">
          <ColorSettings />
          <AddLogo />
          <AddHymn />
          <AudioBible />
          <AddLecture />
          <WordAndMelodyHymns />
          <AttendanceRecord />
        </div>
      </main>
      <Footer />
    </div>
  )
}

