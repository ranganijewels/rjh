import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const TheElovaStandard = () => {
  return (
        <section>
            <PageHeading title={"The Elova Standard"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Our promise is more than quality—it’s a standard of integrity. The Elova Standard is our pledge to uphold the highest principles in every piece we create.
                </Typography>
                <Typography variant="h4"><b>What It Means :</b></Typography>
                <Typography variant="h5">
                    <li>Ethically sourced materials</li>
                    <li>Environmentally responsible processes</li>
                    <li>Handcrafted precision</li>
                    <li>Transparent pricing</li>
                    <li>Lifetime service and support</li>
                </Typography>
                <Typography variant="h5">
                    We don’t just meet industry norms—we redefine them. Every Elova creation embodies our core values: beauty, honesty, and responsibility.
                </Typography>
            </div>
        </section>
    )
}

export default TheElovaStandard;
