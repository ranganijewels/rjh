import PageHeading from "@/components/ui/Heading/PageHeading";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <section>
      <PageHeading title={"Privacy Policy"} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Typography variant="h3">Welcome to RJ House </Typography>
        <Typography variant="h5">
          RJ House values your privacy and is committed to safeguarding it. This
          Privacy Statement outlines the types of personal information we
          collect when you use our website, online services, or platforms
          (collectively referred to as the “Services”). It explains how we use
          this information, with whom we share it, and the options available to
          you regarding its use. Additionally, this Privacy Statement describes
          the measures we take to protect your personal information and how you
          can contact us with any questions or concerns about our privacy
          practices.
        </Typography>
        <Typography variant="h5">
          This section outlines the Privacy Policy applicable to the website and
          native mobile applications. Please note that this Privacy Policy is
          subject to change without prior notice, and it is your responsibility
          to review it periodically to stay informed of any updates.
        </Typography>

        <Typography variant="h4">Terms of Our Privacy Policy</Typography>
        <Typography variant="h4">Personal Information Collected</Typography>
        <Typography variant="h5">
          By accepting this Privacy Policy, you authorize RJ House to collect,
          store, and use any information you provide on our website or native
          mobile applications. The information we collect includes:
        </Typography>

        <Typography variant="h5">
          <li>
            All information you enter on our website and native mobile
            applications, such as your name, address, contact number, email ID,
            chat history, and any other information sent by you via emails to
            our provided email ID.
          </li>
          <li>
            Information collected through cookies installed on your device.
          </li>
          <li>
            Technical details such as the IP address of your device, the server
            from which you access our website and native mobile applications,
            details of the web browser and operating system used, as well as the
            date, time, and location of access.
          </li>
        </Typography>

        <Typography variant="h4">Cookies</Typography>
        <Typography variant="h5">
          Cookies are small pieces of information stored by your browser on your
          device. They are used to record various aspects of your visit and help
          RJ House provide you with seamless service. RJ House does not use cookies to
          store personal information for external purposes.
        </Typography>
        <Typography variant="h5">
          We, along with third-party vendors, including Google, utilize
          first-party cookies (such as Google Analytics cookies) and third-party
          cookies (such as the DoubleClick cookie) to analyze and report how ad
          impressions, usage of ad services, and interactions with these ad
          impressions and services are connected to visits to our website.
        </Typography>
        <Typography variant="h5">
          RJ House.com retains full ownership of all information collected via the
          website or applications installed on the website or native mobile
          applications.
        </Typography>
        <Typography variant="h5">
          As applicable, the information collected by RJ House.com will be used for
          the following purposes:
        </Typography>
        <Typography variant="h5">
          <li>
            To contact you regarding the website, native mobile applications,
            and related updates or services.
          </li>
          <li>
            To monitor and enhance the performance of the website and native
            mobile applications.
          </li>
          <li>
            To calculate the number of visitors and understand their
            geographical distribution.
          </li>
          <li>
            To inform you about special offers and promotions available on the
            website or native mobile applications.
          </li>
          <li>
            To ensure a superior shopping experience, including sending
            promotional emails about various offers. You may choose to
            unsubscribe from these emails at any time.
          </li>
        </Typography>
        <Typography variant="h5">
          Certain information may be shared with third parties, such as courier
          companies, credit card processing companies, and vendors, to
          facilitate their services and fulfill your order requirements.
          RJ House.com strictly prohibits unauthorized individuals or organizations
          from accessing or using any information collected through the website
          and native mobile applications.
        </Typography>
        <Typography variant="h5">
          If you have any questions regarding this Privacy Policy, please feel
          free to reach out to us through our website or native mobile
          applications.
        </Typography>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
