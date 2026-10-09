import { Hero } from '@/sections/Hero'
import { AboutPreview } from '@/sections/AboutPreview'
import { Projects } from '@/sections/Projects'
import { Thoughts } from '@/sections/Thoughts'
import { TalkToMe } from '@/sections/TalkToMe'
import { Contact } from '@/sections/Contact'
import '@/styles/home.css'

export default function Home() {
  return <><Hero /><Projects /><AboutPreview /><Thoughts /><TalkToMe /><Contact /></>
}
