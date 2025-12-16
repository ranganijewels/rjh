import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const BehindtheCraft = () => {
  return (
        <section>
            <PageHeading title={"Behind the Craft"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Elova is not mass-produced. Every piece is individually crafted, thoughtfully designed, and ethically made. Discover what goes into each creation.
                </Typography>
                <Typography variant="h5">
                    <b>Craft of an Elova Piece</b> From initial sketch to final polish, our artisans pour passion and precision into every step. Each piece passes through many expert hands—designers, casters, gem-setters, polishers—before it reaches yours.
                </Typography>
                <Typography variant="h5">
                    <b>Our Design Philosophy</b>Minimal yet meaningful. Every design reflects modern elegance with timeless grace. We blend innovation with tradition, honoring craftsmanship while embracing new possibilities.
                </Typography>
                <Typography variant="h5">
                    <b>Behind the Atelier</b>Our ateliers are sanctuaries of creativity and technical mastery. We believe in slow jewelry—where quality is never rushed, and every detail is intentional.
                </Typography>
                <Typography variant="h5">
                   <b>Materials & Sourcing</b>WeWe partner with ethical suppliers, work with recycled metals, and use only lab-grown diamonds to reduce our environmental footprint while ensuring the highest standards.
                </Typography>
            </div>
        </section>
    )
}

export default BehindtheCraft;
