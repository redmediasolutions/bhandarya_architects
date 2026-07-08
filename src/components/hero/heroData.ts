export interface HeroButton {
  text: string;
  href: string;
  outline?: boolean;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttons: HeroButton[];
}

export const slides: HeroSlide[] = [
  {
    id: 1,
    subtitle: "Residential Architecture",
    title: `Designing
Spaces That
Endure`,
    description:
      "Creating timeless homes that combine innovation, craftsmanship and refined living.",
    image: "/images/slides/11.webp",
    buttons: [
      {
        text: "View Projects",
        href: "/projects",
      },
      {
        text: "Start a Project",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 2,
    subtitle: "Luxury Residences",
    title: `Homes
Designed For
Generations`,
    description:
      "Beautiful residences carefully crafted around lifestyle, context and enduring quality.",
    image: "/images/slides/(2).webp",
    buttons: [
      {
        text: "Explore Homes",
        href: "/projects/residential",
      },
      {
        text: "Talk To Us",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 3,
    subtitle: "Commercial Architecture",
    title: `Creating
Workspaces That
Inspire`,
    description:
      "Modern commercial environments that encourage collaboration, innovation and growth.",
    image: "/images/slides/(3).webp",
    buttons: [
      {
        text: "Commercial Projects",
        href: "/projects",
      },
      {
        text: "Get Started",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 4,
    subtitle: "Hospitality",
    title: `Extraordinary
Guest
Experiences`,
    description:
      "Designing hotels, resorts and hospitality destinations with timeless elegance.",
    image: "/images/slides/(4).webp",
    buttons: [
      {
        text: "View Portfolio",
        href: "/projects",
      },
      {
        text: "Contact Us",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 5,
    subtitle: "Interior Design",
    title: `Interiors
With Purpose
& Character`,
    description:
      "Thoughtfully curated interior environments where materials, light and craftsmanship meet.",
    image: "/images/slides/(5).webp",
    buttons: [
      {
        text: "Interior Projects",
        href: "/projects",
      },
      {
        text: "Enquire",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 6,
    subtitle: "Master Planning",
    title: `Planning
Communities
For Tomorrow`,
    description:
      "Strategic master planning that balances sustainability, connectivity and long-term vision.",
    image: "/images/slides/(6).webp",
    buttons: [
      {
        text: "Learn More",
        href: "/services",
      },
      {
        text: "Contact",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 7,
    subtitle: "Contemporary Design",
    title: `Minimalism
Inspired By
Nature`,
    description:
      "Architecture rooted in simplicity, natural materials and timeless proportions.",
    image: "/images/slides/(7).webp",
    buttons: [
      {
        text: "Our Philosophy",
        href: "/about",
      },
      {
        text: "Contact",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 8,
    subtitle: "Urban Living",
    title: `Transforming
Cities
Through Design`,
    description:
      "Shaping vibrant urban environments that improve everyday life through thoughtful planning.",
    image: "/images/slides/(8).webp",
    buttons: [
      {
        text: "Projects",
        href: "/projects",
      },
      {
        text: "Let's Talk",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 9,
    subtitle: "Architecture + Interiors",
    title: `Every Detail
Designed
Together`,
    description:
      "A holistic design approach where architecture and interiors work seamlessly as one.",
    image: "/images/slides/(9).webp",
    buttons: [
      {
        text: "See Portfolio",
        href: "/projects",
      },
      {
        text: "Contact",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 10,
    subtitle: "Sustainable Design",
    title: `Designing
For Future
Generations`,
    description:
      "Sustainable architecture that respects the environment while enriching everyday life.",
    image: "/images/slides/10.webp",
    buttons: [
      {
        text: "Our Process",
        href: "/about",
      },
      {
        text: "Get Started",
        href: "/contact",
        outline: true,
      },
    ],
  },

  {
    id: 11,
    subtitle: "Bhandary Architects",
    title: `Architecture
That
Endures`,
    description:
      "Three decades of thoughtful architecture, timeless design and exceptional craftsmanship.",
    image: "/images/slides/11.webp",
    buttons: [
      {
        text: "Our Story",
        href: "/about",
      },
      {
        text: "Start Your Project",
        href: "/contact",
        outline: true,
      },
    ],
  },
];