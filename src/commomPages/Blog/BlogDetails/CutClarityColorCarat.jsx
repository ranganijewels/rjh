import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const CutClarityColorCarat = () => {
  return (
        <section>
            <PageHeading title={"Cut, Clarity, Color, Carat"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                   At Elova, we celebrate diamonds for what they truly are—marvels of nature and symbols of enduring love. Whether you're selecting a centerpiece for an engagement ring or accent stones for a bespoke piece, understanding the fundamentals can help you make a choice with clarity and confidence.
                </Typography>
                <Typography variant="h4"><b>The 4 Cs of Diamonds</b></Typography>
                <Typography variant="h4"><b>Cut:</b></Typography>
                <Typography variant="h5">
                    Often considered the most important of the 4 Cs, cut affects how a diamond reflects light—its brilliance, fire, and scintillation. Ideal or excellent cuts maximize sparkle, while poor cuts can make even high-quality stones appear dull.
                </Typography>

                <Typography variant="h4"><b>Color:</b></Typography>
                <Typography variant="h5">
                    Diamonds are graded on a scale from D (colorless) to Z (light yellow or brown). Elova primarily offers diamonds in the D–G range for their crisp, luminous appearance.
                </Typography>

                <Typography variant="h4"><b>Clarity:</b></Typography>
                <Typography variant="h5">
                   This refers to the presence of internal or external imperfections (inclusions or blemishes). Most are microscopic and do not affect the diamond’s beauty. Our preferred range includes VS1 to SI1 clarity—striking the perfect balance between appearance and value.
                </Typography>

                <Typography variant="h4"><b>Carat:</b></Typography>
                <Typography variant="h5">
                   Carat measures weight, not size. A well-cut diamond may appear larger than its carat suggests. We guide clients toward optimal proportions to suit their style and budget.
                </Typography>

                <Typography variant="h4"><b>Beyond the 4 Cs: What Elova Values</b></Typography>
                <Typography variant="h5">
                   We handpick each diamond for more than just grade—we look for symmetry, polish, light performance, and overall beauty. Whether lab-grown or natural, every stone is chosen with purpose and passion.
                </Typography>

                <Typography variant="h4"><b>Transparency & Trust</b></Typography>
                <Typography variant="h5">
                   Elova provides certification with each diamond, detailing its specifications and verifying its ethical origin. Our consultants are happy to guide you through comparisons and help you choose a diamond that’s as meaningful as it is magnificent.
                </Typography>
            </div>
        </section>
    )
}

export default CutClarityColorCarat;
