import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const PickingYourSettingStyle = () => {
  return (
        <section>
            <PageHeading title={"Picking Your Setting & Style"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Your setting is the foundation of your ring’s character. Consider these factors:
                </Typography>
                <Typography variant="h4"><b>How to Measure:</b></Typography>
                <Typography variant="h5">
                    <li><b>Lifestyle :</b> Active wearers may prefer low-set or bezel settings</li>
                    <li><b>Stone shape :</b> Oval, round, pear—each looks best in different styles</li>
                    <li><b>Accent stones :</b> Pavé or halo adds extra sparkle</li>
                </Typography>

                <Typography variant="h5">
                   Let RJ House design specialists help you find the perfect combination of practicality and personality.
                </Typography>
                <Typography variant="h5">
                    Need personal assistance? Schedule a virtual fitting with our team, and we’ll guide you through the process.
                </Typography>
            </div>
        </section>
    )
}

export default PickingYourSettingStyle;
