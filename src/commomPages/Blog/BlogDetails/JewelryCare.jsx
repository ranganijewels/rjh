import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const JewelryCare = () => {
  return (
        <section>
            <PageHeading title={"Jewelry Care"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Your RJ House piece is more than jewelry—it’s a keepsake, a memory, a reflection of your story. Preserving its brilliance requires mindful care. We’ve created this comprehensive guide to help you maintain the elegance and integrity of your piece over the years.
                </Typography>
                <Typography variant="h4"><b>Everyday Maintenance</b></Typography>
                <Typography variant="h5">
                    <li>After wearing, gently wipe your jewelry with a soft, lint-free cloth to remove oils and residue.</li>
                    <li>Store each piece separately in a fabric-lined box or pouch to avoid scratches and tangling.</li>
                    <li>Avoid exposure to perfumes, lotions, chlorine, salt water, and harsh chemicals, which can damage finishes and stones.</li>
                </Typography>

                <Typography variant="h4"><b>Deep Cleaning Tips</b></Typography>
                <Typography variant="h5">
                    <li>For diamonds and most gemstones: Soak in a bowl of warm water with mild soap. Gently scrub with a soft-bristled brush.</li>
                    <li>Avoid ultrasonic cleaners for delicate settings, pearls, and vintage pieces.</li>
                </Typography>
                <Typography variant="h5">
                    <b>Professional Cleaning & Inspection</b> Every RJ House piece comes with complimentary lifetime cleaning and inspection services. We recommend an annual visit to our atelier or a certified jeweler to ensure stones remain secure and your piece maintains its luster.
                </Typography>
                <Typography variant="h5">
                    Jewelry is meant to be worn and lived in. With a little care, your RJ House creation will shine for generations.
                </Typography>
            </div>
        </section>
    )
}

export default JewelryCare;
