// Editorial content for the four "About Us" nav groups. Each page/section group
// is a hero + a `blocks` array rendered by StoryPages/blocks.jsx (split / stats /
// values / quote / process / duo / stories / mosaic / testimonials). Block `id`s
// MUST match the nav deep-links in components/layout/Navbar/constant.js.

export const OUR_STORY = {
  heroTitle: "Our Story",
  heroSubtitle:
    "More than 50 years with diamonds, a name rooted in richness, and a quiet promise to make brilliance without compromise.",
  heroImage: "/images/about-us-banner.png",
  blocks: [
    {
      type: "split",
      id: "our-story",
      eyebrow: "50+ Years With Diamonds",
      title: "The RJ House Journey",
      image: "/images/home/jewellery.jpg",
      imageAlt: "Rangani fine jewelry",
      body: [
        "Our family has worked with diamonds for more than 50 years, beginning in natural diamond manufacturing. That experience grew into growing and cutting our own lab-grown diamonds, and from there into making the jewellery they are set in.",
        "Rangani Jewelry House brings that knowledge together: lab-grown diamonds set in 10K, 14K and 18K gold and 925 sterling silver, made with the attention to detail that comes from understanding a diamond from the inside.",
      ],
    },
    {
      type: "stats",
      items: [
        { value: "50+", label: "Years With Diamonds" },
        { value: "100%", label: "Lab-Grown Diamonds" },
        { value: "10K–18K", label: "Gold & 925 Silver" },
        { value: "IGI · GIA · SGL", label: "Certified" },
      ],
    },
    {
      type: "values",
      id: "mission-values",
      eyebrow: "Principles",
      title: "Our Mission and Values",
      intro:
        "Rangani Jewelry House exists to prove that extraordinary diamonds should not cost the earth — in every sense of the phrase. Master craftsmanship, honest sourcing, and diamonds grown rather than mined, so beauty never comes at the expense of conscience.",
      cards: [
        {
          icon: "shield",
          title: "Integrity",
          text: "Honesty in how every material is sourced and every piece is priced — standards we would be proud to explain in full.",
        },
        {
          icon: "gem",
          title: "Craft",
          text: "Respect for the skill of the artisans who shape each setting, continuing techniques taught bench-side.",
        },
        {
          icon: "infinity",
          title: "Permanence",
          text: "Jewelry designed to be passed down rather than replaced — made for decades of wear, not a single season.",
        },
      ],
    },
    {
      type: "quote",
      id: "meaning-name",
      eyebrow: "Etymology",
      title: "The Meaning Behind the Name",
      quote: "Fine jewelry should feel personal and alive — not simply valuable.",
      body: [
        "Rangani draws from a word rooted in color and richness, a nod to the vivid life a well-made piece of jewelry brings to the person who wears it.",
        "Paired with House, the name signals belonging rather than transaction — a family atelier and, by extension, a home for every client who enters it. The name has stayed a constant through every evolution of the craft.",
      ],
    },
    {
      type: "split",
      id: "what-different",
      eyebrow: "Distinction",
      title: "What Makes Us Different",
      image: "/images/customize/oval-solitaire.png",
      imageAlt: "Hand-set oval solitaire ring",
      reverse: true,
      body: [
        "Rangani Jewelry House builds exclusively with lab-grown diamonds and responsibly sourced gold — a deliberate choice rather than a trend, so clients never have to weigh brilliance against conscience.",
      ],
      bullets: [
        "Exclusively lab-grown diamonds — IGI or GIA reports for solitaires, SGL certificates for jewellery",
        "10K, 14K and 18K gold and 925 sterling silver, hallmarked for purity",
        "Every setting shaped by hand by master artisans",
        "Quiet luxury — understated, meticulous, made for a lifetime",
      ],
    },
  ],
};

export const CRAFTSMANSHIP = {
  heroTitle: "The Craft Behind Every Piece",
  heroSubtitle:
    "More than 50 years of working with diamonds shapes how an RJ House piece is imagined, made, and finished.",
  heroImage: "/videos/the-art-of-making.mp4",
  blocks: [
    {
      type: "process",
      id: "craft",
      eyebrow: "From Sketch To Setting",
      title: "The Craft of an RJ House Piece",
      intro:
        "Every RJ House piece begins as a sketch, refined over several passes before a single stone is chosen — a sequence that has changed little since our atelier's earliest years, updated only where new tools genuinely improve precision.",
      image: "/images/customize/picking-your-setting.png",
      imageAlt: "Selecting a ring setting at the bench",
      steps: [
        {
          title: "The Sketch",
          text: "Proportion and light are considered on paper first — refined over several passes before any metal is touched.",
        },
        {
          title: "Wax & Cast",
          text: "The drawing is translated into wax, then cast in responsibly sourced gold, shaping each setting by hand.",
        },
        {
          title: "Stone Setting",
          text: "Certified lab-grown diamonds are set one by one, each seat cut to hold the stone at its most brilliant angle.",
        },
        {
          title: "Polish & Inspection",
          text: "Finished by hand and inspected against the House standard — a piece passes through many careful hands before it reaches you.",
        },
      ],
    },
    {
      type: "split",
      id: "design-philosophy",
      eyebrow: "Quiet, Not Loud",
      title: "Our Design Philosophy",
      image: "/images/customize/minimalist-emerald-cut.png",
      imageAlt: "Minimalist emerald-cut ring",
      reverse: true,
      quoteLine:
        "We design for the piece that is still being worn in twenty years — not the one that photographs loudest today.",
      body: [
        "That means proportions that flatter the hand, settings built to be lived in, and a restraint that lets the diamond, rather than the design around it, hold the eye.",
        "Trends inform us, but they do not govern us. An RJ House design is judged by how it wears over time: whether it still feels considered a decade on, and whether it was made with a person in mind rather than a passing moment.",
      ],
    },
    {
      type: "split",
      id: "atelier",
      eyebrow: "The People At The Bench",
      title: "Behind the Atelier",
      image: "/images/customize/custom-engravings.png",
      imageAlt: "Hand engraving at the atelier bench",
      body: [
        "Rangani Jewelry House grew out of a family business in diamonds, and much of that spirit remains: a small bench of jewelers, gemologists, and finishers who know a piece by the hands that made it. Skills here are still taught bench-side, one jeweler mentoring the next.",
        "It is slower work than a factory floor, and we have kept it that way on purpose. Every ring, pendant, or pair of earrings passes through people who take responsibility for it personally, from the first wax model to the final polish.",
      ],
    },
    {
      type: "duo",
      id: "materials",
      eyebrow: "Chosen With Care",
      title: "Materials and Sourcing",
      intro:
        "An extraordinary piece should not cost the earth — we choose our materials with that principle in view at every step.",
      cards: [
        {
          image: "/images/customize/cut-clarity.png",
          title: "Lab-Grown Diamonds",
          text: "Chosen for clarity, consistency, and a considerably lighter footprint — selected against the same cut and color standards we have always held.",
        },
        {
          image: "/images/customize/choosing-ring-metal.png",
          title: "Responsible Gold",
          text: "10K, 14K and 18K gold and 925 sterling silver, sourced through responsible channels and hallmarked for purity.",
        },
      ],
    },
  ],
  cta: {
    image: "/videos/customize-banner.mp4",
    backgroundIsVideo: true,
    title: "Create Something Uniquely Yours",
    description:
      "From first sketch to final polish — design a bespoke piece with the atelier.",
    buttons: [{ button_text: "Start Your Design", button_url: "/customize" }],
  },
};

export const SUSTAINABILITY = {
  heroTitle: "Sustainability, By Design",
  heroSubtitle:
    "A family atelier's commitment to lab-grown diamonds, responsible sourcing, and jewelry that honors the earth it comes from.",
  heroImage: "/images/home/shine-with-rj-4.png",
  blocks: [
    {
      type: "split",
      id: "ethical-promise",
      eyebrow: "Our Foundation",
      title: "A Promise We Keep Quietly",
      image: "/images/home/shine-with-rj-2.png",
      imageAlt: "Rangani jewelry, responsibly made",
      body: [
        "Rangani Jewelry House was a family business in diamonds long before it was a jewellery brand, and that shapes how it defines integrity. An ethical promise, for us, is not a marketing claim but a daily discipline: knowing where a diamond began, how a gold band was formed, and who shaped it along the way.",
        "It asks a simple question before any other: would we be proud to explain, in full, how this piece came to be. That standard, more than any certificate, is what we hold ourselves to.",
      ],
    },
    {
      type: "values",
      id: "lab-grown",
      eyebrow: "Our Craft",
      title: "Diamonds, Grown With Intention",
      intro:
        "Lab-grown diamonds carry the same brilliance, hardness, and fire as mined stones — without the uncertainty of extraction.",
      cards: [
        {
          icon: "leaf",
          title: "Grown, Not Mined",
          text: "Cultivated under controlled conditions, avoiding the land disruption associated with traditional mining.",
        },
        {
          icon: "gem",
          title: "Graded by the 4Cs",
          text: "Held to the same cut, color, clarity, and carat standards that have long guided the trade — beauty is never a compromise.",
        },
        {
          icon: "doc",
          title: "Documented Origin",
          text: "The growing process is recorded from the outset, giving every diamond a clarity of origin mined stones rarely offer.",
        },
      ],
    },
    {
      type: "split",
      id: "responsible-sourcing",
      eyebrow: "Our Materials",
      title: "Sourcing With Care, Start to Finish",
      image: "/images/customize/twin-band-design.png",
      imageAlt: "Responsibly sourced gold bands",
      reverse: true,
      body: [
        "Beyond diamonds, Rangani Jewelry House is attentive to the gold that anchors every setting, favoring gold and silver from suppliers who can speak plainly to their own practices. Relationships with artisans and material partners are built over years, not transactions.",
        "Responsible sourcing also means asking questions of every partner in the chain, from refiners to setters, and choosing to work only where those answers hold up to scrutiny. It is a slower way of building a jewelry house — one we consider worth the extra care.",
      ],
    },
    {
      type: "split",
      id: "environmental-impact",
      eyebrow: "Our Footprint",
      title: "Extraordinary Diamonds, Lighter On The Earth",
      image: "/images/customize/care-longevity.png",
      imageAlt: "Jewelry made to last generations",
      body: [
        "Lab-grown diamonds allow Rangani Jewelry House to offer the diamonds our clients love while avoiding the land disruption of traditional mining — central to our belief that extraordinary diamonds shouldn't cost the earth, in the most literal sense.",
      ],
      bullets: [
        "No mining — every diamond grown under controlled conditions",
        "Durable, long-lived designs over disposable trends",
        "Thoughtful packaging and workshop practices",
        "Made to be worn for generations — longevity as sustainability",
      ],
    },
  ],
  cta: {
    image: "/images/home/explore-the-collection.png",
    title: "Brilliance Without the Footprint",
    description:
      "Explore certified lab-grown diamonds set in responsibly sourced gold.",
    buttons: [{ button_text: "Explore the Collection", button_url: "/product" }],
  },
};

export const CUSTOMER_LOVE = {
  heroTitle: "Stories, Told by Those Who Wear Them",
  heroSubtitle:
    "In the words of the people who have chosen Rangani jewellery.",
  heroImage: "/images/review/review-bg.png",
  blocks: [
    {
      type: "testimonials",
      id: "testimonials",
      eyebrow: "In Their Words",
      title: "What Our Clients Say",
      intro:
        "Published with each customer's permission.",
    },
    {
      type: "split",
      id: "reviews",
      eyebrow: "Product Reviews",
      title: "Reviews From Every Step of the Journey",
      image: "/images/review/review-4.jpg",
      imageAlt: "A client wearing her Rangani piece",
      body: [
        "Reviews on our product pages are written by customers who bought that piece, and are moderated only for spam and personal details — never for rating.",
        "If you have bought from us, we would value your honest review of the piece and of how we looked after you.",
      ],
      button: { text: "Browse All Reviews", url: "/reviews" },
    },
    {
      type: "stories",
      id: "client-stories",
      eyebrow: "Made for the Moment",
      title: "Pieces for Every Occasion",
      intro:
        "Some pieces mark an engagement, others a milestone anniversary or a promise made quietly to oneself. A few of the moments our jewellery is designed for.",
      cards: [
        {
          image: "/images/home/customer-1.png",
          tag: "The Proposal",
          title: "A Yes in the Making",
          text: "Design a solitaire around one person's hand, from a first sketch on a consultation call to the finished ring.",
        },
        {
          image: "/images/home/customer-2.png",
          tag: "The Anniversary",
          title: "A Promise, Retold",
          text: "Reimagine an anniversary band and carry the original engraving into a new design.",
        },
        {
          image: "/images/home/customer-3.png",
          tag: "The Self-Purchase",
          title: "Worn for Oneself",
          text: "Something well made needs no other reason — choose a piece simply because you love it.",
        },
      ],
    },
    {
      type: "mosaic",
      id: "real-moments",
      eyebrow: "In the Details",
      title: "Rangani, Up Close",
      intro:
        "A closer look at the settings, stones and finishes that go into our jewellery.",
      images: [
        "/images/review/review-1.png",
        "/images/review/review-5.jpg",
        "/images/review/review-2.png",
        "/images/review/review-6.jpg",
        "/images/review/review-3.png",
        "/images/gallery/gallery-6.png",
      ],
    },
  ],
  cta: {
    image: "/images/home/start-designing.png",
    title: "Begin Your Own Story",
    description:
      "Design a piece that will be told about for decades — with the atelier at your side.",
    buttons: [{ button_text: "Start Your Design", button_url: "/customize" }],
  },
};
