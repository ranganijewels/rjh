import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

const ChoosingRightMetal = () => {
   return (
        <section>
            <PageHeading title={"Choosing the Right Metal"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Your jewelry should suit your style and your lifestyle. Here’s how to choose:
                </Typography>
                <Typography variant="h4"><b>How to Measure:</b></Typography>
                <Typography variant="h5">
                    <li><b>Yellow Gold :</b> Traditional warmth and timeless appeal</li>
                    <li><b>White  Gold :</b> Sleek and modern</li>
                    <li><b>Rose  Gold :</b> Romantic and unique</li>
                    <li><b>Platinum :</b> Durable, bright, and hypoallergenic</li>
                </Typography>

                <Typography variant="h5">
                    Consider skin tone, maintenance needs, and aesthetic. Our consultants are happy to guide your decision.
                </Typography>
                <Typography variant="h5">
                    Need personal assistance? Schedule a virtual fitting with our team, and we’ll guide you through the process.
                </Typography>
            </div>
        </section>
    )
}

export default ChoosingRightMetal