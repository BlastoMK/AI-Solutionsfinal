import { Settings, CropRotate, ViewInAr, PieChart, Code, BarChart, CloudOutlined, FavoriteBorder, Public, PersonOutlined, AddLocationAltOutlined, PhoneIphone, EmailOutlined, Facebook, Twitter, Instagram, YouTube } from "@mui/icons-material"

export const navlink = [
  {
    url: "/",
    text: "Home",
  },
  {
    url: "/about",
    text: "About",
  },
  {
    url: "/services",
    text: "Services",
  },
  {
    url: "/portfolio",
    text: "Portfolio",
  },
  {
    url: "/testimonials",
    text: "Testimonials",
  },
  {
    url: "/blog",
    text: "Events",
  },
  {
    url: "/contact",
    text: "Contact",
  },
]
export const home = [
  {
    text: "Welcome To",
    name: "AI Solutions",
    post: "New Innovation",
    design: "New Workflow",
    desc: "AI-Solutions is a startup specializing in AI-powered virtual assistance and prototyping solutions to enhance the digital employee experience",
  },
]
export const about = [
  {
    desc: "At AI-Solutions, we are passionate about leveraging the power of Artificial Intelligence to transform the digital employee experience. As a forward-thinking startup based in Sunderland, we specialize in providing innovative AI-powered virtual assistance and prototyping solutions that help businesses streamline their operations, enhance productivity, and drive innovation.",
    desc1: "Our mission is to empower organizations with cutting-edge AI tools that not only solve complex challenges but also create seamless, intuitive, and engaging experiences for their employees. Whether you're looking to automate repetitive tasks, improve decision-making, or accelerate product development, we’re here to help you achieve your goals.",
    cover: "./images/ai.png",
  },
]
export const services = [
  {
    id: 1,
    icon: <Settings />,
    title: " AI-Powered Virtual Assistance",
    desc: "Streamline your operations with intelligent virtual assistants that automate repetitive tasks, enhance productivity, and provide 24/7 support for your employees.",
  },
  {
    id: 2,
    icon: <CropRotate />,
    title: "Prototyping Solutions",
    desc: "Unlock the power of your data with advanced analytics tools that provide actionable insights, enabling smarter decision-making and improved business outcomes.",
  },
  {
    id: 3,
    icon: <ViewInAr />,
    title: "Data Analytics & Insights",
    desc: "Unlock the power of your data with advanced analytics tools that provide actionable insights, enabling smarter decision-making and improved business outcomes.",
  },
  {
    id: 4,
    icon: <PieChart />,
    title: "Custom Software Development",
    desc: " Build tailored software solutions designed to meet your unique business needs, ensuring seamless integration and scalability for future growth.",
  },
  {
    id: 5,
    icon: <Code />,
    title: "UX/UI Design",
    desc: " Create intuitive and engaging user interfaces that enhance the employee experience, driving adoption and satisfaction across your digital platforms.",
  },
  {
    id: 6,
    icon: <BarChart />,
    title: "AI Integration & Consulting",
    desc: "Seamlessly integrate AI technologies into your existing systems with expert guidance, ensuring optimal performance and maximum ROI.",
  },
]
export const project = [
  {
    id: 1,
    icon: <CloudOutlined />,
    num: "100",
    title: "HAPPY CLIENTS",
  },
  {
    id: 2,
    icon: <FavoriteBorder />,
    num: "231",
    title: "PROJECTS COMPLETED",
  },
  {
    id: 3,
    icon: <Public />,
    num: "58",
    title: "EVENTS HOSTED",
  },
  {
    id: 4,
    icon: <PersonOutlined />,
    num: "1446",
    title: "STAFF",
  },
]
export const portfolio = [
  {
    id: 1,
    cover: "../images/port/P5.png",
    name: "Vibe Coding",
    category: "development",
    title: "AI in DevOP",
  },
  {
    id: 2,
    cover: "../images/port/port2.jpg",
    name: "New Age Tech",
    category: "design",
    title: "Smart Watch Design",
  },
  {
    id: 3,
    cover: "../images/port/A1.jpg",
    name: "Agri_Tech",
    category: "development",
    title: "AI In Agriculture",
  },
  {
    id: 4,
    cover: "../images/port/port4.jpg",
    name: "Future Style",
    category: "marketing",
    title: "Animation Styling",
  },
  {
    id: 5,
    cover: "../images/port/C3.png",
    name: "NextGen",
    category: "design",
    title: "Future of Development",
  },
  {
    id: 6,
    cover: "../images/port/port6.jpg",
    name: "Mc'DeesNutz",
    category: "development",
    title: "Taste The Future",
  },
]
export const testimonials = [
  {
    id: 1,
    name: "Tuelo Tlhaping",
    position: "CTO, TechGlobal",
    company: "TechGlobal",
    content: "AI-Solutions transformed our customer service operations. Their virtual assistant implementation exceeded our expectations and delivered ROI within just 3 months.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    date: "2025-04-15"
  },
  {
    id: 2,
    name: "Lefika Emmanuel",
    position: "Director of Innovation, HealthFirst",
    company: "HealthFirst",
    content: "The predictive analytics platform developed by AI-Solutions has revolutionized how we approach patient care. We can now identify potential issues before they become problems.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    date: "2025-02-28"
  },
  {
    id: 3,
    name: "Rachel Masego",
    position: "Head of Digital Transformation, GlobalBank",
    company: "GlobalBank",
    content: "Working with AI-Solutions was seamless from start to finish. Their team understood our unique challenges and delivered a solution that perfectly addressed our needs.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    date: "2025-01-02"
  }
];
export const blog = [
  {
    _id: "6819d4847e4a929cdf987355",
    id: 1,
    title: "AI in Healthcare Summit",
    date: "Aug 22, 2025",
    author: "Dorian Gray",
    desc: "Exploring the latest AI applications in healthcare and medical research.",
    cover: "./images/blog/b1.png",
    eventId: "healthcare-summit-2025" 
  },
  {
    _id: "6819e6337e4a929cdf98735b",
    id: 2,
    title: "Machine Learning Workshop",
    date: "Oct 27, 2025",
    author: "Mike Ortiz",
    desc: "Hands-on workshop for implementing machine learning solutions in business.",
    cover: "./images/blog/b2.png",
    eventId: "ml-workshop-2025"
  },
  {
    _id: "6819e6537e4a929cdf98735c",
    id: 3,
    title: "Natural Language Processing Summit",
    date: "Sep 07, 2025",
    author: "Daniel Mothusi",
    desc: "Advancements in NLP and their applications in business and customer service.",
    cover: "./images/blog/b3.png",
    eventId: "nlp-summit-2025"
  },
]
export const contact = [
  {
    icon: <AddLocationAltOutlined />,
    text1: "2651 Main Street, Suit 124",
    text2: "Sunderland, United Kingdom",
  },
  {
    icon: <PhoneIphone />,
    text1: "070 2284 0944 ",
    
  },
  {
    icon: <EmailOutlined />,
    text1: "info@ai-solutions.com",
    text2: "careers@ai-solutions.com",
  },
]
export const social = [
  {
    icon: <Facebook />,
  },
  {
    icon: <Twitter />,
  },
  {
    icon: <Instagram />,
  },
  {
    icon: <YouTube />,
  },
]
