import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const JewelryStylingGuide = () => {
 return (
        <section>
            <PageHeading title={"Jewelry Styling Guide"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Jewelry is not just an accessory—it’s the finishing touch that brings your entire look to life. Whether you’re building a personal collection or refreshing your daily essentials, our Jewelry Styling Guide helps you master the art of layering, mixing, and self-expression.
                </Typography>
                <Typography variant="h4"><b>Layering Like a Pro</b></Typography>
                <Typography variant="h5">
                    <ul className="list-disc list-inside">
                        <li>Start with a centerpiece: a pendant or choker to anchor your look.</li>
                        <li>Add varying chain lengths for depth and dimension.</li>
                        <li>Mix metals for contrast and texture.</li>
                    </ul>
                </Typography>

                <Typography variant="h4"><b>Ring Stacking</b></Typography>
                <Typography variant="h5">
                    <ul className="list-disc list-inside">
                        <li>Begin with one bold or sentimental piece (like a solitaire or signet).</li>
                        <li>Stack with slim bands or textured rings for balance.</li>
                        <li>Use negative space to avoid overcrowding.</li>
                    </ul>
                </Typography>
                <Typography variant="h4"><b>Bracelets & Bangles</b></Typography>
                <Typography variant="h5">
                    <ul className="list-disc list-inside">
                        <li>Combine structured bangles with flexible chains.</li>
                        <li>Choose similar themes—geometric, organic, minimalist—for visual cohesion.</li>
                    </ul>
                </Typography>
                <Typography variant="h4"><b>Earrings & Piercings</b></Typography>
                <Typography variant="h5">
                    <ul className="list-disc list-inside">
                        <li>Curate your ear with a mix of studs, huggies, and drops.</li>
                        <li>Balance bold statement pieces with dainty complements.</li>
                    </ul>
                </Typography>
                <Typography variant="h5">
                    Styling is about storytelling. Build a look that speaks to who you are—elegant, bold, romantic, or all at once.
                </Typography>
            </div>
        </section>
    )
}

export default JewelryStylingGuide;
