import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const MetalSettingOptions = () => {
  return (
        <section>
            <PageHeading title={"Metal & Setting Options"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    The setting is more than a frame—it’s the stage on which your diamond shines. At Elova, we offer a curated selection of timeless and contemporary settings to complement your personal style.
                </Typography>
                <Typography variant="h4"><b>Popular Setting Styles:</b></Typography>
                <Typography variant="h5">
                    <li><b>Solitaire :</b> Classic elegance that puts your diamond front and center</li>
                    <li><b>Halo :</b> A ring of smaller diamonds that enhance size and sparkle.</li>
                    <li><b>Three-Stone :</b> Symbolizing past, present, and future</li>
                    <li><b>Pavé :</b> Delicate rows of diamonds that shimmer with every movement.</li>
                </Typography>

                <Typography variant="h5">
                    Pair any of these settings with your preferred metal—14K or 18K gold (yellow, white, or rose) or platinum—for a design that feels uniquely yours.
                </Typography>
                <Typography variant="h5">
                   Our jewelry consultants can walk you through combinations and even provide 3D renders of your custom selection.
                </Typography>
            </div>
        </section>
    )
}

export default MetalSettingOptions
