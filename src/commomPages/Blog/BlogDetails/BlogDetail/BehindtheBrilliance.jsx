import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const BehindtheBrilliance = () => {
 return (
        <section>
            <PageHeading title={"Behind the Brilliance"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Every Elova diamond sparkles with a story. Go beyond the 4Cs and discover what makes our diamonds truly brilliant.
                </Typography>
                <Typography variant="h5">
                    <b>Cut & Light Performance</b> Our Ideal and Excellent cut grades maximize fire, scintillation, and brilliance. We go beyond certification, inspecting each diamond individually for visual beauty.
                </Typography>
                <Typography variant="h5">
                    <b>Sustainability Meets Luxury</b> Each diamond is lab-grown using green energy and sourced from vetted, ethical partners.
                </Typography>
                <Typography variant="h5">
                    <b>Personalized Brilliance</b> We offer light analysis reports and 3D scans to help you choose the diamond that captivates you—not just on paper, but in person.
                </Typography>
            </div>
        </section>
    )
}

export default BehindtheBrilliance;
