import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const RingSizeGuide = () => {
    return (
        <section>
            <PageHeading title={"Ring Size Guide"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Finding the right fit is essential for comfort and security. Use our comprehensive Ring Size Guide to measure your finger with precision.
                </Typography>
                <Typography variant="h4"><b>How to Measure:</b></Typography>
                <Typography variant="h5">
                    <li>Order a complimentary RJ House ring sizer</li>
                    <li>Print our at-home sizing chart</li>
                    <li>Use a string or paper strip to measure your finger’s circumference</li>
                </Typography>

                <Typography variant="h4"><b>Tips for Accuracy:</b></Typography>
                <Typography variant="h5">
                    <li>Measure at the end of the day when fingers are largest</li>
                    <li>Avoid measuring when hands are cold, as fingers shrink slightly</li>
                    <li>If between sizes, choose the larger option</li>
                </Typography>
                <Typography variant="h5">
                    Need personal assistance? Schedule a virtual fitting with our team, and we’ll guide you through the process.
                </Typography>
            </div>
        </section>
    )
}

export default RingSizeGuide;
