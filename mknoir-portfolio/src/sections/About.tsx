'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SkillsRadarChart from '@/components/SkillsRadarChart'

export function About() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          About Me
        </motion.h1>

        {/* ============================================= */}
        {/* PHILOSOPHY                                    */}
        {/* ============================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16 space-y-6 text-base leading-relaxed text-muted-foreground"
        >
          <h2 className="text-xl font-semibold text-foreground">Philosophy</h2>

          <p>I&apos;ve always been drawn to systems.</p>

          <p>
            Biology is often described as messy, stochastic, and unpredictable.
            Software is described as deterministic, structured, and exact. Most
            people see these as opposites but I believe they are complementary.
          </p>

          <p>
            I believe biology can be structured without stripping away its
            complexity. We have not uncovered all of its logic, and we likely
            never will in full. But there is coherence beneath the apparent
            chaos, and better interfaces allow us to reveal it.
          </p>

          <p className="font-medium text-foreground">
            My work explores these complementary interfaces.
          </p>

          <p>
            I design systems that bridge molecular biology, automation, and
            software. Biology cannot be reduced to code (yet), but
            experimentation must become reproducible, scalable, and loggable. I
            believe we are moving toward a world where biological processes can
            be described, orchestrated, and iterated on with the same fluency we
            apply to software.
          </p>

          <p>
            At the same time, I don&apos;t believe biology becomes meaningful in
            abstraction alone. Biology exists in the physical world, and we must
            understand it in that context. Life cannot be abstracted away from
            the physical world. It grows in incubators, responds to force and
            temperature, unfolds through time. It is bound to physics. Within
            that physicality, there is logic. Hardware is not secondary to
            software. It is where intent becomes reality. Software is a lens
            through which life&apos;s structure becomes visible.
          </p>

          <p className="font-medium text-foreground">
            For me, the future isn&apos;t software replacing biology. It&apos;s
            software and biology moving in sync.
          </p>

          <p>
            The transformation happens at the boundary. When digital logic
            reaches into the physical world and moves matter. When code alters
            motion. When data reshapes experimentation. That boundary between
            computation and embodiment is not theoretical. It is executable.
          </p>

          <p className="font-medium text-foreground">
            Biology lives at that boundary.
          </p>

          <p>
            And that interplay, between matter and abstraction, physics and
            logic, is where I find the most beauty. That is where the future
            unfolds.
          </p>

          <p>
            Life is better understood when we stop separating software, hardware,
            and biology, and instead treat them as a single, flowing system
            where abstraction and embodiment are in constant dialogue.
          </p>

          <p>
            When those systems are aligned, experimentation begins to feel less
            chaotic and more like flow. It becomes iterative, responsive, almost
            fluid.
          </p>

          <p>
            Curiosity drives everything I do. I&apos;m interested in how systems
            interact, where friction exists, and how constraints can be turned
            into design principles.
          </p>

          <p className="font-medium text-foreground">
            This leads me to the work I do.
          </p>
        </motion.div>

        <Separator className="mb-16" />

        {/* ============================================= */}
        {/* THE STACK                                     */}
        {/* ============================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-xl font-semibold text-foreground">The Stack</h2>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              My work sits at the intersection of the bench and the terminal. On
              any given day I might be designing a molecular assay, writing a
              pipeline to process gene expression data, or building automation
              workflows that connect liquid handlers to analysis scripts.
            </p>

            <p>
              On the biology side, I have deep experience in molecular biology,
              cell culture, PCR, gene expression analysis, and high-throughput
              assay development. I&apos;ve worked across therapeutic areas but my focus is cardiovascular disease.
            </p>

            <p>
              On the computational side, I work in Python, R, and increasingly
              with ML frameworks. I&apos;ve explored EGNNs and Transformers for
              target triage, built single-cell and single-nucleus RNA-seq
              pipelines, and developed dashboards and data tools to accelerate
              decision-making.
            </p>

            <p>
              Statistics ties it all together. Experimental design, hypothesis
              testing, and data interpretation are the connective tissue between
              wet lab and dry lab.
            </p>

            <p>
              Robotics and automation are where it all converges. I believe the
              future of biology is programmable, and the instruments we build
              should reflect that.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Molecular Biology',
              'Cell Culture',
              'PCR / qPCR',
              'Gene Expression',
              'Python',
              'R',
              'Machine Learning',
              'scRNA-seq',
              'Statistics',
              'Automation',
              'Robotics',
              'Bioinformatics',
            ].map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Radar chart */}
          <div className="mx-auto max-w-xl pt-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-base">
                  Skills &amp; Interests
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  A blend of the serious and the not-so-serious.
                </p>
              </CardHeader>
              <CardContent>
                <SkillsRadarChart />
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Separator className="mb-16" />

        {/* ============================================= */}
        {/* LIFE                                          */}
        {/* ============================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-foreground">Life</h2>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              Outside of work, I look for the same flow in motion.
              Snowboarding down a mountain, cycling long distances, running, or
              exploring new places. Movement sharpens thinking. Physical systems
              teach you about balance, momentum, and feedback loops just as much
              as engineering does.
            </p>

            <p>
              I run to clear my head. I bike to cover ground and think at a
              different pace. Snowboarding is pure commitment to the present
              moment. Each one is a different kind of practice.
            </p>

            <p>
              And yes, I take craft beer seriously. Fermentation is biology too.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Snowboarding',
              'Running',
              'Cycling',
              'Swimming',
              'Craft Beer',
              'Travel',
            ].map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
