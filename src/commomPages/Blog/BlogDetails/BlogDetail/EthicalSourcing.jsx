import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const EthicalSourcing = () => {
  return (
        <section>
            <PageHeading title={"Ethical Sourcing"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Luxury, in our eyes, means more than aesthetics—it means integrity. RJ House is committed to sourcing materials that respect both people and the planet, without compromise.
                </Typography>
                <Typography variant="h4"><b>Responsibly Sourced Diamonds</b></Typography>
                <Typography variant="h5">
                    We offer both lab-grown and mined diamonds, with strict sourcing criteria for each. All our mined diamonds are conflict-free, sourced in accordance with the Kimberley Process and from suppliers who prioritize labor rights and environmental protections.
                </Typography>

                <Typography variant="h4"><b>Lab-Grown Innovation</b></Typography>
                <Typography variant="h5">
                    Lab-grown diamonds offer the same beauty and durability as mined stones—with a lighter footprint. These diamonds are traceable, sustainable, and independently graded for quality.
                </Typography>

                <Typography variant="h4"><b>Recycled & Reclaimed Metals</b></Typography>
                <Typography variant="h5">
                    We use recycled gold and platinum whenever possible to reduce our impact on the earth’s resources. These metals are refined to the same standards as newly mined ones—pure, strong, and brilliant.
                </Typography>

                <Typography variant="h4"><b>Gemstones with a Conscience</b></Typography>
                <Typography variant="h5">
                   Whether it’s a rich blue sapphire or a shimmering opal, our colored stones are chosen for ethical origin and environmental stewardship. We work only with trusted partners who align with our values.
                </Typography>

                <Typography variant="h4"><b>A Transparent Supply Chain</b></Typography>
                <Typography variant="h5">
                  We believe our customers deserve to know the story behind their jewelry. From mine to masterpiece, we aim for full transparency—so you can wear your RJ House piece with pride and peace of mind.
                </Typography>
            </div>
        </section>
    )
}

export default EthicalSourcing;
