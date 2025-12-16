import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const HowtoLayerStack = () => {
   return (
        <section>
            <PageHeading title={"How to Layer & Stack"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Layering necklaces, stacking rings, and combining bracelets can transform your jewelry into a curated collection that evolves with your mood and style.
                </Typography>
                <Typography variant="h5">
                    <b>Start with a Statement</b> Choose one anchor piece—a bold pendant or chunky ring—as your focal point. Build around it with subtler companions.
                </Typography>
                <Typography variant="h5">
                    <b>Mix Widths & Textures</b> Play with contrast: smooth and hammered metals, thick and thin bands, sparkling stones and plain finishes.
                </Typography>

                <Typography variant="h4"><b>Create Balance</b></Typography>
                <Typography variant="h5">
                    <li>Limit to 3–5 layers for necklaces</li>
                    <li>Don’t overcrowd fingers—leave negative space</li>
                    <li>Alternate stacking on both wrists or ears for harmony</li>
                </Typography>
                <Typography variant="h5">
                    Elova's modular designs are perfect for stacking—designed to interlock or complement each other effortlessly.
                </Typography>
            </div>
        </section>
    )
}

export default HowtoLayerStack;
