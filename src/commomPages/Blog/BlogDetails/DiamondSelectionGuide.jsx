import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const DiamondSelectionGuide = () => {
  return (
        <section>
            <PageHeading title={"Diamond Selection Guide"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Choosing a diamond can feel overwhelming—but it doesn’t have to be. At Elova, we guide you through every step to ensure you find a stone that aligns with your values, taste, and budget.
                </Typography>
                <Typography variant="h4"><b>The 4Cs</b></Typography>
                <Typography variant="h5">
                    <li><b>Cut :</b> Determines brilliance. We offer only Excellent or Ideal cuts.</li>
                    <li><b>Color :</b> Ranges from D (colorless) to Z (light yellow/brown). We typically recommend D–H for a bright appearance.</li>
                    <li><b>Clarity :</b> Measures internal imperfections. Our stones are VS2 or higher, offering excellent eye-clean clarity.</li>
                    <li><b>Carat :</b> Refers to weight. We help you balance carat size with quality to meet your budget.</li>
                </Typography>

                <Typography variant="h4"><b>Certification & Ethics</b></Typography>
                <Typography variant="h5">
                    All Elova diamonds come with certification from reputable labs like IGI or GIA. And because we exclusively offer lab-grown diamonds, you can trust that your stone is both stunning and responsibly sourced.
                </Typography>
            </div>
        </section>
    )
}

export default DiamondSelectionGuide;