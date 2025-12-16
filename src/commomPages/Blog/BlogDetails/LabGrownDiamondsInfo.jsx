import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const LabGrownDiamondsInfo = () => {
  return (
        <section>
            <PageHeading title={"Lab-Grown Diamonds Info"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    At Elova, our commitment to innovation, ethics, and beauty is embodied in our use of lab-grown diamonds. These stones are not imitations—they are real diamonds, grown using advanced technology that replicates the natural conditions under which diamonds form.
                </Typography>
                <Typography variant="h5">
                    <b>What Are Lab-Grown Diamonds?</b> Lab-grown diamonds are created in high-pressure, high-temperature (HPHT) or chemical vapor deposition (CVD) environments. The result is a diamond that is chemically, physically, and optically identical to mined diamonds—but with a significantly smaller environmental footprint.
                </Typography>

                <Typography variant="h4"><b>Why Choose Lab-Grown?</b></Typography>
                <Typography variant="h5">
                    <li>Ethically sourced, with no mining involved</li>
                    <li>More sustainable and environmentally conscious</li>
                    <li>Better value—often larger or higher quality at a similar price</li>
                </Typography>
                <Typography variant="h5">
                    Every Elova diamond is hand-selected, graded by independent gemological institutes, and accompanied by certification. With a lab-grown diamond, you get unmatched beauty and integrity in one perfect stone.
                </Typography>
            </div>
        </section>
    )
}

export default LabGrownDiamondsInfo;
