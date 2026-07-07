import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const CareLongevity = () => {
  return (
        <section>
            <PageHeading title={"Care & Longevity"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    RJ House pieces are made to endure—but care makes the difference. Protect your jewelry’s longevity with these best practices:
                </Typography>
                <Typography variant="h4"><b>How to Measure:</b></Typography>
                <Typography variant="h5">
                    <li>Store in soft-lined compartments</li>
                    <li>Avoid contact with chemicals and extreme temperatures</li>
                    <li>Schedule yearly professional cleanings</li>
                </Typography>

                <Typography variant="h5">
                    Our lifetime care program ensures your jewelry continues to tell your story, beautifully.
                </Typography>
            </div>
        </section>
    )
}

export default CareLongevity;