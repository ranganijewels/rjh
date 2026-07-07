import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

const Certification = () => {
    return (
        <section>
            <PageHeading title={"Certification"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Every RJ House diamond is independently certified by leading gemological labs like IGI or GIA. Certification guarantees your diamond’s 4Cs, grading accuracy, and ethical origin.
                </Typography>
                
                <Typography variant="h4"><b>Each purchase includes :</b></Typography>
                <Typography variant="h5">
                    <li>A digital and printed certificate</li>
                    <li>Diamond origin and grading details</li>
                    <li>Warranty and care guide</li>
                </Typography>

                <Typography variant="h5">
                   Transparency is a core value. We want you to know and trust every facet of your stone.
                </Typography>
            </div>
        </section>
    )
}

export default Certification