import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const GiftConcierge = () => {
  return (
        <section>
            <PageHeading title={"Gift Concierge"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Give the gift of unforgettable luxury. Our Gift Concierge service helps you select, personalize, and present the perfect piece for any occasion.
                </Typography>
                <Typography variant="h4">Services Include:</Typography>
                <Typography variant="h5">
                    <li>Personalized gift recommendations</li>
                    <li>Custom engraving and gift notes</li>
                    <li>Elegant gift wrapping and packaging</li>
                    <li>Private consultations and delivery planning</li>
                </Typography>

                <Typography variant="h5">
                    Need something special? Let us curate a moment that matters.
                </Typography>
            </div>
        </section>
    )
}

export default GiftConcierge;
