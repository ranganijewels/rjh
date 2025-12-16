import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'
import React from 'react'

export const OurCraftsmanship = () => {
  return (
        <section>
            <PageHeading title={"Our Craftsmanship"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h5">
                    Every Elova piece begins with a story—and ends with something truly timeless. Behind every glimmer lies hours of skilled artistry, precise engineering, and a dedication to perfection that defines who we are.
                </Typography>
                <Typography variant="h4"><b>Designed with Purpose</b></Typography>
                <Typography variant="h5">
                    Our design philosophy blends classic elegance with modern sensibility. We believe form should enhance function—whether it’s a hidden halo, an elevated setting for more light, or a comfort-fit band made for everyday wear.
                </Typography>

                <Typography variant="h4"><b>Hand-Finished by Master ArtisansM</b></Typography>
                <Typography variant="h5">
                   Each piece is meticulously crafted in small batches at our atelier, where heritage techniques meet modern innovation. Our artisans sculpt, set, polish, and inspect every item by hand, ensuring each detail meets our uncompromising standards.
                </Typography>

                <Typography variant="h4"><b>Customization & Bespoke Work</b></Typography>
                <Typography variant="h5">
                   Looking for something unique? We offer personalized modifications—from engraving to stone changes—and full bespoke designs. Collaborate with our designers to bring your vision to life with our signature Elova refinement.
                </Typography>

                <Typography variant="h4"><b>Quality that Endures</b></Typography>
                <Typography variant="h5">
                   We build our jewelry to last a lifetime. From reinforced prongs to hypoallergenic alloys and secure clasps, every element is engineered for durability without compromising beauty.
                </Typography>

                <Typography variant="h4"><b>Certified Excellence</b></Typography>
                <Typography variant="h5">
                   Before reaching your hands, each piece undergoes multiple inspections and quality assurance checks. You deserve jewelry that reflects not just your taste—but our promise of excellence.
                </Typography>
            </div>
        </section>
    )
}

export default OurCraftsmanship;
