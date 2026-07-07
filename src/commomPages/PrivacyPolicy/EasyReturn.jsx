import React from 'react'
import PageHeading from '@/components/ui/Heading/PageHeading'
import Typography from '@/components/ui/Typography/Typography'

export const EasyReturn = () => {
    return (
        <section>
            <PageHeading title={"Easy Return"} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Typography variant="h4"><b>30-Day Return Policy</b></Typography>
                <Typography variant="h5">
                    At RJ House Diamonds, we pride ourselves on delivering jewelry of exceptional quality. However,
                    we understand that sometimes purchases don’t go as planned, and you may need to return or
                    exchange an item. That’s why we offer a 30-day return policy for your peace of mind.
                </Typography>
                {/* <Typography variant="h4">Explore Our Metal Palette:</Typography> */}
                <Typography variant="h5">
                    If you are not satisfied with your purchase, simply return it within 30 days for an exchange or a
                    full refund. The returned items must be in their original, unworn condition accompanied by all
                    original documentation included.
                </Typography>

                <hr className="border-t border-gray-200" />

                <Typography variant="h4">Return Policy Details</Typography>
                <Typography variant="h5">The 30-day return/exchange period begins on the delivery date of your order.</Typography>
                <Typography variant="h5">Express order fees are non-refundable.</Typography>
                <Typography variant="h5">Refund requests must be submitted in writing via email to support@therjhouse.com.</Typography>
                <Typography variant="h5">Exceptions to the 30-Day Return Policy.</Typography>

                <hr className="border-t border-gray-200" />

                <Typography variant="h4">1. Personalised Items</Typography>
                <Typography variant="h5">The following are non-returnable due to their customised nature:</Typography>
                <Typography variant="h5">Engraved, resized, or modified items</Typography>
                <Typography variant="h5">Previously exchanged items</Typography>
                <Typography variant="h5">Custom-designed jewellery</Typography>

                <Typography variant="h4">2. Custom-Designed Rings</Typography>
                <Typography variant="h5">Custom designed rings/ jewellery are those that have to be specifically made for
                    the client which are a different design to that listed on our website, are not eligible
                    for returns.</Typography>
                <Typography variant="h5">The certified diamond from a custom ring can still be returned within 30 days for a full
                    refund.
                </Typography>

                <Typography variant="h4">3. Multiple Returns/Exchanges</Typography>
                <Typography variant="h5">Customers may use the 30-day policy once per 12-month period per product category
                    (e.g., engagement rings, earrings).
                </Typography>

                <Typography variant="h4">4. Fancy Coloured Diamonds</Typography>
                <Typography variant="h5">All sales of Fancy Coloured Diamonds (Pink, Blue, Yellow) are final and cannot be
                    returned or exchanged.
                </Typography>

                <Typography variant="h4">5.  Men's Wedding Rings</Typography>
                <Typography variant="h5">Returns for men’s wedding rings are not accepted.</Typography>

                <Typography variant="h4">6. Unworn and Tagged Products</Typography>
                <Typography variant="h5">Items must be returned in new, unworn condition, with tags intact, unbroken and &
                    untampered with.
                </Typography>

                <hr className="border-t border-gray-200" />

                <Typography variant="h4">How to Return an Order</Typography>
                <Typography variant="h5">1. Obtain a return shipping authorization code by contacting us. This code must be
                    included on your return label.
                </Typography>
                <Typography variant="h5">2. Include all original packaging, documents, and diamond certificates. Missing certificates
                    will incur a $250 CAD fee.
                </Typography>
                <Typography variant="h5">3. Ship the item via registered post or courier with tracking and signature on delivery.
                    Returns are at the customer’s expense.
                </Typography>
                <Typography variant="h5">4. Returns must be shipped within 14 days of receiving the authorization code.
                </Typography>

                <hr className="border-t border-gray-200" />

                <Typography variant="h4">Refund Process</Typography>
                <Typography variant="h5">Once the returned item is received, it will be inspected by our gemologists or
                    jewellers.
                </Typography>
                <Typography variant="h5">The verification process, including video-recorded unboxing, may take up to 7 business
                    days.
                </Typography>
                <Typography variant="h5">Refunds are processed via the original payment method. Credit card refunds may take
                    up to one billing cycle to appear on your statement.
                </Typography>
                <Typography variant="h5">If additional paperwork is required, our team will notify you.
                </Typography>

                <hr className="border-t border-gray-200" />

                <Typography variant="h4">Important Notes</Typography>
                <Typography variant="h5">Shipping costs, appraisals, and grading cards are non-refundable. The customer is
                    responsible for the shipping cost to return the product. However, we will refund you the
                    purchase amount minus the original shipping fee.
                </Typography>
                <Typography variant="h5">Customers are responsible for any loss or damage during return shipping. We
                    recommend insuring the item for its value.
                </Typography>
                <Typography variant="h5">For questions or to request a return, email support@therjhouse.com.
                </Typography>
            </div>
        </section>
    )
}

export default EasyReturn;
