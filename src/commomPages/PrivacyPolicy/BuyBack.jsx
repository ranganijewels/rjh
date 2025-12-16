import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

const BuyBack = () => {
    return (
        <section>
            <PageHeading title={"BuyBack"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Elova’s Buy Back Program offers future flexibility with present value. If your tastes change or you upgrade your piece, we’ll credit your original Elova diamond.
                </Typography>
                <Typography variant="h4"><b>Program Highlights :</b></Typography>
                <Typography variant="h5">
                    <li>50% credit toward your next Elova diamond purchase</li>
                    <li>Available for select solitaire rings and diamonds over 0.50ct</li>
                    <li>Must be in original condition with certificate</li>
                </Typography>
                
                <Typography variant="h5">
                   Our mission is to make luxury circular, sustainable, and always evolving.
                </Typography>
            </div>
        </section>
    )
}

export default BuyBack