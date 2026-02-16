'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, Github, Linkedin } from 'lucide-react'

const contactLinks = [
  {
    label: 'Email Me',
    href: 'mailto:himay75@gmail.com',
    icon: Mail,
    variant: 'default' as const,
  },
  {
    label: 'Call Me',
    href: 'tel:323-398-9379',
    icon: Phone,
    variant: 'default' as const,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mknoir',
    icon: Github,
    variant: 'outline' as const,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/himay-makhija-mickey/',
    icon: Linkedin,
    variant: 'outline' as const,
    external: true,
  },
]

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Get in Touch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-10 max-w-xl text-muted-foreground"
        >
          Interested in collaboration, biotech innovation, or just a good
          conversation? Reach out!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex flex-wrap justify-center gap-3 p-6">
              {contactLinks.map(({ label, href, icon: Icon, variant, external }) => (
                <Button
                  key={label}
                  variant={variant}
                  className="gap-2"
                  asChild
                >
                  <Link
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
