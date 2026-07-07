import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const CustomEngravings = () => {
  return (
        <section>
            <PageHeading title={"Custom Engravings"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Make your piece truly yours with a custom engraving. Whether it’s a special date, name, or message, engravings add emotional depth.
                </Typography>
                <Typography variant="h4">Options Include:</Typography>
                <Typography variant="h5">
                    <li>Inside-ring inscriptions</li>
                    <li>Bracelet or pendant messages</li>
                    <li>Coordinates, initials, and symbols</li>
                </Typography>

                <Typography variant="h5">
                    All engravings are done in-house with precision tools. Include your request during checkout or consult our team for ideas.
                </Typography>
            </div>
        </section>
    )
}

export default CustomEngravings;
