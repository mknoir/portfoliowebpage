import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import '@/styles/interior.css'

const capabilities = [
  {
    number: '01',
    title: 'At the bench.',
    description:
      'Molecular biology, cell culture, and high-throughput assays. I’ve worked across cardiometabolic disease and gene therapy, with experimental design and statistics connecting the questions to the evidence.',
    detail: 'Biology & experimentation',
  },
  {
    number: '02',
    title: 'At the terminal.',
    description:
      'Python, R, and machine learning. From single-cell RNA-seq pipelines to exploring EGNNs and Transformers for target triage, I build tools that make complex data easier to work with.',
    detail: 'Software & intelligence',
  },
  {
    number: '03',
    title: 'Between the two.',
    description:
      'Automation workflows that connect liquid handlers, analysis scripts, and the people using them. I’m interested in what happens when a good idea in software becomes a useful action in the physical world.',
    detail: 'Robotics & automation',
  },
]

export function About() {
  return (
    <div className="interior-page shell">
      <section className="about-intro" aria-labelledby="about-title">
        <div className="about-intro-copy">
          <p className="eyebrow">About / The person behind the projects</p>
          <h1 id="about-title" className="interior-title">
            A scientist who<br className="about-title-break" /> thinks in systems.
          </h1>
          <p className="interior-lead">
            I’m Mickey. I’m fascinated by biology, robotics, and intelligence—and
            the possibilities that open up when they meet.
          </p>
          <p className="about-intro-detail">
            My work moves between the bench and the terminal: designing
            experiments, making sense of data, and building software and
            automation to connect it all.
          </p>
          <Link className="text-link" href="/experience">
            The path so far <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <figure className="about-portrait">
          <div className="about-portrait-image">
            <Image
              src="/portrait.jpg"
              alt="Mickey Makhija"
              fill
              sizes="(max-width: 700px) 78vw, 360px"
              priority
            />
          </div>
          <figcaption>Always curious. Usually building something.</figcaption>
        </figure>
      </section>

      <section className="about-practice" aria-labelledby="practice-title">
        <div className="interior-section-heading">
          <p className="eyebrow">What I bring</p>
          <h2 id="practice-title">A few different ways of thinking.</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability" key={capability.number}>
              <span className="capability-number" aria-hidden="true">
                {capability.number}
              </span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <span className="capability-detail">{capability.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="interior-editorial-row" aria-labelledby="philosophy-title">
        <div>
          <p className="eyebrow">How I see it</p>
          <h2 id="philosophy-title">The interesting part is the connection.</h2>
        </div>
        <div className="interior-prose">
          <p>
            Biology is complex, and software gives us ways to understand and work
            with that complexity. I’m drawn to the interfaces between them: how
            we describe an experiment, translate intent into action, and learn
            from what actually happens.
          </p>
          <p>
            But biology lives in the physical world. It grows in incubators,
            responds to temperature, and unfolds through time. The systems I want
            to build respect that reality—bringing software, hardware, and
            biology into a more useful conversation.
          </p>
        </div>
      </section>

      <section className="interior-editorial-row about-outside" aria-labelledby="outside-title">
        <div>
          <p className="eyebrow">Away from the screen</p>
          <h2 id="outside-title">A little room to wander.</h2>
        </div>
        <div className="interior-prose">
          <p>
            Running clears my head. Cycling gives me time to think. Snowboarding
            brings me back to the present. I like exploring new places and finding
            a different pace along the way.
          </p>
          <p>
            And yes, I take craft beer seriously. Fermentation is biology too.
          </p>
          <p className="outside-interests">Snowboarding / Running / Cycling / Travel</p>
        </div>
      </section>

      <section className="interior-contact" aria-labelledby="about-contact-title">
        <div>
          <p className="eyebrow">Keep the conversation going</p>
          <h2 id="about-contact-title">What are you curious about?</h2>
        </div>
        <a className="button-primary" href="mailto:himay75@gmail.com">
          Say hello <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>
    </div>
  )
}
