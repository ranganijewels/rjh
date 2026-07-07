"use client";

import React from 'react'
// import TwoColGrid from "@/components/common/TwoColGrid";
import Typography from "@/components/ui/Typography/Typography";
import PageHeading from "@/components/ui/Heading/PageHeading";
import Accordion from "@/components/ui/Accordion/Accordion";
import { QUESTIONS } from '@/commomPages/Customize/constant';
import Heading from "@/components/ui/Heading/Heading";



const guideLinks = [
    { id: "01", label: "Necklace Length Chart", href: "#necklace-length-chart" },
    { id: "02", label: "Chain Length Guide", href: "#chain-length-guide" },
    { id: "03", label: "How to Measure Necklace Length", href: "#how-to-measure-necklace-length" },
    { id: "04", label: "Necklace Sizing Guide", href: "#necklace-sizing-guide" },
    { id: "05", label: "How to Choose Necklace Length", href: "#how-to-choose-necklace-length" },
];

const NecklaceLengthChart = [
    { length: "14 inches", cm: "35-36 cm", positiononbody: "Sits tightly against the base of the neck — commonly referred to as a choker" },
    { length: "16 inches", cm: "40-41 cm", positiononbody: "Rests at the base of the throat/collarbone" },
    { length: "18 inches", cm: "45-46 cm", positiononbody: "Sits at the collarbone — the most common length" },
    { length: "20 inches", cm: "50-51 cm", positiononbody: "Falls just below the collarbone" },
    { length: "22 inches", cm: "55-56 cm", positiononbody: "Rests between the collarbone and bust" },
    { length: "22 inches", cm: "60-61 cm", positiononbody: "Falls at the top of the bust" },
    { length: "30 inches", cm: "76 cm", positiononbody: "Rests at mid-chest/sternum" },
    { length: "36 inches", cm: "91 cm", positiononbody: "Falls below the bust, can be doubled" },
];

const StandardNecklaceLengths1 = [
    { title: "14-Inch Necklace", description: "14-inch necklaces sit snugly around the neck like a choker. This length makes a bold statement and draws attention to the neck and face. 14-inch necklaces pair beautifully with off-shoulder styles, boat necks, and V-necks, creating a striking contrast that frames the neck area." },
    { title: "16-Inch Necklace", description: "At 16 inches, this versatile length rests at the base of the throat, making it an excellent choice for highlighting the collarbones. This length works wonderfully with open necklines and adds a refined accent to business attire. " },
    { title: "18-Inch Necklace", description: "The 18-inch length is the most common and universally flattering necklace length. It sits perfectly at the collarbone, making it ideal for pendant necklaces and everyday wear. This versatile length complements virtually any outfit or neckline, making it a staple in most jewelry collections." },
];

const StandardNecklaceLengths2 = [
    { title: "20-22 Inch Necklace", description: "20-22 inch necklaces fall below the collarbone, creating a sophisticated look that works well with both casual and formal attire. This length is particularly flattering with higher necklines and business wear, as it adds visual interest without competing with the neckline." },
    { title: "24-Inch Necklace", description: "The 24-inch length reaches the top of the bust, creating an elongating effect. This length works excellently for statement pieces and pendant necklaces, balancing well with both casual and professional outfits. It's also a popular length for men's chains, particularly for pendants." },
    { title: "30-36-Inch Necklace", description: "30-36 inch necklaces rest at mid-chest or below, creating dramatic elegance. These longer strands can be worn as single dramatic pieces or doubled to create layered looks. They're particularly striking with evening wear, high necklines, and minimalist outfits." },
];

export const NecklaceLengthGuide = () => {
    return (
        <>
            {/* Image Section */}
            <section>
                <div className="relative w-full font-montserrat pt-12 px-6 md:px-8 py-10">
                    <img
                        src="/images/category/necklacelengthguide.jpg"
                        alt="Necklace Length Guide"
                        className="w-full h-[350px] object-cover"
                    />

                    <div className="absolute inset-0 flex justify-end items-center px-6 md:px-14">
                        <div className="sm p-6 rounded-lg max-w-lg ml-auto">
                            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                                Necklace Length Guide
                            </h2>
                            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                This guide will help you understand standard necklace sizes, <br />
                                how to measure chains properly, and how to select the ideal <br />
                                length for your preferences.
                            </p>
                            <button className="bg-[var(--teal-1)] text-white px-6 py-2 rounded hover:bg-[var(--brand-deep)] transition">
                                Shop Necklaces
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            {/* Guide Section */}
            <div className="font-montserrat px-6 md:px-[33px] py-10">
                <h4 className="text-[20px] font-semibold mb-4">In This Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-10 underline underline-offset-4">
                    {guideLinks.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="text-[15px] md:text-base font-medium hover:text-primary transition"
                        >
                            {item.id} {item.label}
                        </a>
                    ))}
                </div>
            </div>


            {/* Necklace Length Chart Section */}
            <section className="mt-20 font-montserrat">
                {/* Header Section */}
                <div className="px-4 sm:px-6 md:px-[100px]">
                    <h3 className="text-2xl md:text-[36px] font-semibold mb-4 text-center">
                        Necklace Length Chart
                    </h3>
                    <p className="text-base text-center">
                        Necklaces come in standard sizes of 14”, 16”, 18”, 20”, 22”, 24”, 30” and 36”.
                    </p>
                    <p className="text-base text-center">
                        Though all necklaces are standardized in size, each length will rest differently on different body types.
                    </p>
                </div>


                {/* Table Section */}
                <div className="overflow-x-auto mt-10 px-10">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full bg-white border border-gray-300 text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="px-4 py-2 whitespace-nowrap">Length (inches)</th>
                                    <th className="px-4 py-2 whitespace-nowrap">Length (cm)</th>
                                    <th className="px-4 py-2 whitespace-nowrap">Position on Body</th>
                                </tr>
                            </thead>
                            <tbody>
                                {NecklaceLengthChart.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap">{item.length}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{item.cm}</td>
                                        <td className="px-4 py-2">{item.positiononbody}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>


            {/* Standard Necklace Lengths With Left Side Image */}
            <section className="mt-20 font-montserrat px-6 lg:px-[100px]">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-semibold text-[28px] md:text-[36px]">Standard Necklace Lengths</h3>
                    <p className="text-basemt-5 mt-5">
                        Each standard necklace length creates a distinct visual effect and pairs best with certain outfits and necklines.

                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center md:items-start gap-10">
                    {/* Image Section */}
                    <div className="lg:w-1/2 w-full">
                        <img
                            src="/images/category/standardnecklacelengths1.jpg"
                            alt="Standard Necklace Lengths"
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="lg:w-1/2 w-full order-1 md:order-2">
                        {StandardNecklaceLengths1.map((item, index) => (
                            <div key={index} className="p-6">
                                <h4 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900">{item?.title}</h4>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item?.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Standard Necklace Lengths With Right Side Image */}
            <section className="mt-20 font-montserrat px-6 lg:px-[100px]">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                    {/* Image Section */}
                    <div className="lg:w-1/2 w-full order-1 lg:order-2">
                        <img
                            src="/images/category/standardnecklacelengths2.jpg"
                            alt="Standard Necklace Lengths"
                            className="w-full h-auto"
                        />
                    </div>
                    {/* Text Section */}
                    <div className="lg:w-1/2 w-full order-2 md:order-1 space-y-8">
                        {StandardNecklaceLengths2.map((item, index) => (
                            <div key={index} className="p-6">
                                <h4 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">{item?.title}</h4>
                                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{item?.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/*How To Measure Necklace Length */}
            <section className="mt-20 font-montserrat px-6 lg:px-[100px]">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-semibold text-[28px] md:text-[36px]">How to Measure Necklace Length</h3>
                    <p className="text-base text-gray-700 mt-5">
                        Accurate measurements are important for ensuring your necklace sits exactly where you want it. Here are two reliable methods for determining the perfect length:
                    </p>
                </div>
            </section>
            <section>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                    <Typography variant="h4" className="mb-2">
                        Method 1: Using an Existing Necklace
                    </Typography>

                    <Typography variant="h5" className="mt-0">
                        If you already own a necklace that sits at your preferred length:
                    </Typography>

                    <Typography variant="h5">
                        1. Lay the necklace flat on a level surface, ensuring it's straight with no kinks. <br />
                        2. Use a ruler or measuring tape to measure from end to end, including the clasp.
                    </Typography>

                    <Typography variant="h4" className="mb-2">
                        Method 2: Using String or Measuring Tape
                    </Typography>

                    <Typography variant="h5" className="mt-0">
                        For a personalized fit:
                    </Typography>

                    <Typography variant="h5">
                        1. Wrap a flexible measuring tape or piece of string around your neck, positioning it where you want the necklace to rest.<br />
                        2. For choker styles, measure snugly but comfortably at the base of the neck. <br />
                        3. For longer styles, hold the string/tape where you'd like the necklace to fall.<br />
                        4. Mark or pinch the point where the ends meet.<br />
                        5. Lay the string/tape flat against a ruler to determine the length.<br />
                        6. Add 1-2 inches (2.5-5 cm) to allow for movement and the weight of any pendant.<br />
                    </Typography>

                    <Typography variant="h4" className="mb-2">
                        Measuring with Pendants in Mind
                    </Typography>

                    <Typography variant="h5" className="mt-0">
                        When selecting a chain for a pendant:
                    </Typography>

                    <Typography variant="h5">
                        1. Measure as described above to determine your preferred chain length.<br />
                        2. Consider the pendant's size—larger pendants typically need longer chains.<br />
                        3. Add the pendant's length (including bail) to understand the total drop length.<br />
                        4. For pendants with significant weight, choose a slightly shorter chain than you might otherwise, as the weight will cause the necklace to hang lower.<br />
                    </Typography>
                </div>
            </section>


            {/* How to Choose Necklace Length With Left Side Image */}
            <section className="mt-20 px-6 lg:px-[100px] font-montserrat">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-semibold text-[28px] md:text-[36px]">How to Choose Necklace Length</h3>
                    <p className="text-basemt-5 mt-5">
                        Selecting the ideal necklace length involves considering several key factors beyond personal preference.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center md:items-start gap-10">
                    {/* Image Section */}
                    <div className="lg:w-1/2 w-full">
                        <img
                            src="/images/category/necklacelength1.jpg"
                            alt="Standard Necklace Lengths"
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="lg:w-1/2 w-full space-y-4 md:space-y-6 text-left 2xl:mt-45 mt-0 font-montserrat">
                        <Typography variant="h2" className="pt-2 pb-1 mb-0 font-montserrat">
                            Outfit and Neckline
                        </Typography>

                        <Typography variant="h4" className="pt-0 pb-0 mt-0 font-montserrat">
                            Different necklace lengths harmonize with specific clothing styles:
                        </Typography>

                        <ul className="list-disc pl-10 text-[16px] leading-relaxed font-montserrat">
                            {[
                                "Turtlenecks pair beautifully with 30-36\" lengths or longer pendants.",
                                "V-necks work best with pendants or chains that mirror the neckline.",
                                "Crew necks go well with short statement necklaces like chokers or collar styles.",
                                "Strapless dresses pair nicely with chokers or short necklaces.",
                                "Button-down shirts pair well with mid-length pendants.",
                                "Off-shoulder tops shine with collar-length necklaces.",
                            ].map((item, idx) => (
                                <li key={idx}><b>{item.split(" ")[0]}</b>{item.slice(item.indexOf(" "))}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>


            {/* How to Choose Necklace Length With Right Side Image */}
            <section className="mt-20 font-montserrat px-6 lg:px-[100px]">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                    {/* Text Section */}
                    <div className="lg:w-1/2 w-full space-y-4 md:space-y-6 text-left 2xl:mt-45 order-2 lg:order-1">
                        <Typography variant="h2" className="pt-2 pb-1 mb-0">
                            Layering Considerations
                        </Typography>

                        <Typography variant="h4" className="pt-0 pb-0 mt-0">
                            When planning to <a href="#" className="underline underline-offset-4">layer multiple necklaces</a>
                        </Typography>

                        <ul className="list-disc pl-10 text-[16px] leading-relaxed">
                            {[
                                "Choose varying lengths with at least 2-4 inches difference between each piece.",
                                "The most popular layering combination involves 16\", 18\", and 20\" necklaces worn together.",
                                "Consider necklace weight and bulk—pair delicate chains with heavier statement pieces for balance.",
                                "Mix metals and textures thoughtfully for a curated rather than cluttered appearance.",
                            ].map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>

                        <button className="bg-[var(--teal-1)] text-white px-6 py-2 rounded hover:bg-[var(--brand-deep)] transition">
                            Shop Necklaces
                        </button>
                    </div>

                    {/* Image Section */}
                    <div className="lg:w-1/2 w-full order-1 lg:order-2">
                        <img
                            src="/images/category/necklacelength2.jpg"
                            alt="Standard Necklace Lengths"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>


            {/* FAQs */}
            <div className="text-3xl text-[28px] md:text-[36px] px-[18px] mt-10 font-montserrat">
                {/* <Heading
                    isCenter
                    title="Necklace Length FAQ"
                    className="xl:mb-[40px] mb-[20px] font-bold"
                /> */}
                <h3 className="text-3xl font-semibold text-[28px] md:text-[36px] xl:mb-[40px] mb-[20px] text-center">Necklace Length FAQ</h3>

                {QUESTIONS.map((que, idx) => {
                    return (
                        <ul
                            className="container mx-auto 2xl:px-[404px] lg:px-[125px] px-0"
                            key={idx}
                        >
                            <Accordion
                                title={que.question}
                                caretIcons={{
                                    open: "/icons/minus.svg",
                                    close: "/icons/plus.svg",
                                }}
                            >
                                <li className="list-disc list-inside">{que.ans}</li>
                            </Accordion>
                        </ul>
                    );
                })}
            </div>


            {/* Explore More */}
            {/* <section className="py-12 px-4 md:px-20 font-montserrat text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-10">Explore More Guides</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {[
                        "Men's Chain & Necklace Lengths",
                        "Types of Necklaces",
                        "What Jewelry to Wear with Your Wedding Dress",
                        "Jewelry Trends",
                        "How to Stack Earrings",
                        "Types of Earrings",
                        "How to Stack Bracelets",
                        "How to Stack Rings",
                    ].map((text, idx) => (
                        <a
                            key={idx}
                            href="#"
                            className="border border-gray-400 px-4 py-4 max-w-[250px] w-full h-[100px] flex items-center justify-center text-sm text-center hover:shadow-md transition-all"
                        >
                            {text}
                        </a>
                    ))}
                </div>
            </section> */}
        </>
    )
}

export default NecklaceLengthGuide