import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const ExploreSignatureDetails = () => {
  return (
        <section>
            <PageHeading title={"Explore Signature Details"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Elova jewelry is defined by its subtle, intentional signature details—elements that elevate form into art.
                </Typography>
                <Typography variant="h4"><b>Our Hallmarks Include:</b></Typography>
                <Typography variant="h5">
                   <li>Sleek under-gallery curves for comfort</li>
                   <li>Hidden diamonds or birthstones beneath the setting</li>
                   <li>Engraved initials or motifs inside bands</li>
                   <li>Customizable accent finishes, from matte to high polish</li>
                </Typography>

                <Typography variant="h5">
                   These details aren’t just aesthetic—they're personal touches that turn fine jewelry into lasting heirlooms. Ask about our signature options when creating your custom piece.
                </Typography>
            </div>
        </section>
    )
}

export default ExploreSignatureDetails;
