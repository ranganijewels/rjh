import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

const FreeResizing = () => {
    return (
        <section>
            <PageHeading title={"Free Resizing"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    At RJ House, we believe every detail matters—including the fit. 
                    When you find the perfect ring, it should feel as flawless on your finger as it looks in the box. 
                    That's why we offer complimentary resizing within 60 days of your purchase.
                </Typography>
                {/* <Typography variant="h4">What Are Lab-Grown Diamonds?</Typography> */}
                <Typography variant="h5">
                    Whether your ring feels a touch too snug or slightly loose, our expert jewelers are 
                    here to make it just right. Our resizing service maintains the integrity of your 
                    original design, ensuring the final result is seamless and secure. All resizing is 
                    done in our in-house atelier by artisans who know every RJ House piece intimately.
                </Typography>

                {/* <Typography variant="h4">
                    Why Lab-Grown Diamonds Are Better for the Planet?
                </Typography> */}
                <Typography variant="h5">
                    We also provide a printable Ring Size Guide and a complimentary sizer upon 
                    request to help you get the most accurate measurement. Still unsure? Our 
                    jewelry consultants are available for virtual sizing support. With RJ House, 
                    comfort and beauty go hand in hand.
                </Typography>
            </div>
            
        </section>
    )
}

export default FreeResizing