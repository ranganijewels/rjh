import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const MetalsMaterials = () => {
  return (
        <section>
            <PageHeading title={"Metals & Materials"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    At RJ House, we believe the beauty of a piece begins long before it’s worn. It begins with our materials—responsibly sourced, meticulously refined, and chosen for their enduring value.
                </Typography>
                <Typography variant="h5">
                    <b>Precious Metals</b>We use only high-quality, conflict-free gold and platinum. Much of our gold is recycled and refined to minimize environmental impact, without sacrificing purity or strength. Our platinum is sourced for its hypoallergenic properties and superior longevity.
                </Typography>
                <Typography variant="h5">
                    <b>Lab-Grown Diamonds</b>Our diamonds are ethically cultivated in high-tech laboratories using cutting-edge methods that replicate the natural formation process. These diamonds are chemically, physically, and optically identical to mined diamonds—but with significantly less environmental impact.
                </Typography>
                <Typography variant="h5">
                    <b>Gemstones & Accents</b>From sapphires to black diamonds, every gem in our collection is hand-selected for brilliance, hue, and quality. We trace every stone’s journey to ensure it meets our strict ethical and environmental standards.
                </Typography>
                <Typography variant="h5">
                   <b>Craftsmanship & Commitment</b>We work with artisans who share our values of sustainability, quality, and artistry. Our sourcing process reflects our belief that luxury should be both beautiful and responsible.
                </Typography>
            </div>
        </section>
    )
}

export default MetalsMaterials;
