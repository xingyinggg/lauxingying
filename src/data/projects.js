import makanSimiImg from "../assets/makansimi.png";
import cloudPantryImg from "../assets/cloudpantry.png";
import clearPassImg from "../assets/clearpass.png";
import infoguardImg from "../assets/infoguard.png";
import afterclassImg from "../assets/afterclass.png";
import artifyImg from "../assets/artify.png";
import cathayImg from "../assets/cathay.png";
import heartSyncImg from "../assets/heartsync.png";
import maritimeRiskCareImg from "../assets/maritimeriskcare.png";
import taskAllinOneImg from "../assets/taskallinone.png";

const projects = [
  {
    title: "TaskAllinOne",
    category: "Web App",
    description:
      "A full-stack task and project management platform for HR, Manager and Staffs to manage their work and collaborate effectively.",
    image: taskAllinOneImg,
    tech: ["Next.js", "Express", "Supabase", "Jira"],
    githubUrl: "https://github.com/xingyinggg/ColdStorage",
  },
  {
    title: "MaritimeRiskCare",
    category: "Data Analytics",
    description:
      "A data mining project to examine maritime risk in terms of weather, piracy incidents and vessel collisions.",
    image: maritimeRiskCareImg,
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter Notebook"],
    githubUrl: "https://github.com/zuweii/datamining",
  },
  {
    title: "HeartSync",
    category: "Web App",
    description:
      "An AWS cloud-based health monitoring system that collects, analyses, and visualizes real-time heart rate data from wearable devices to provide insights and alerts for users.",
    image: heartSyncImg,
    tech: ["React", "Node.js", "AWS Lambda", "DynamoDB", "IoT"],
    // demoVideo: "https://youtu.be/6YhSaUao1f4?si=dSnTL5-3waReyAkA",
  },
  {
    title: "MakanSimi",
    category: "Web App",
    description:
      "A full-stack platform that helps friend groups plan and coordinate makan outings with ease — no more messy group chats.",
    image: makanSimiImg,
    tech: ["Vue.js", "Bootstrap", "Firebase", "Node.js"],
    demoVideo: "https://youtu.be/6YhSaUao1f4?si=dSnTL5-3waReyAkA",
  },
  {
    title: "CloudPantry",
    category: "Web App",
    description:
      "A donation logistics system that automates food allocation between donors, charities, and recipients to reduce waste and improve outreach.",
    image: cloudPantryImg,
    tech: [
      "React",
      "Tailwind CSS",
      "Docker",
      "Flask",
      "OutSystems",
      "Supabase",
    ],
    demoVideo: "https://youtu.be/UKpQZBsyxBs",
  },
  {
    title: "ClearPass",
    category: "Web App",
    description:
      "Upload, crop, and auto-remove photo backgrounds to create ICA-compliant passport photos using OpenCV and U2-Net.",
    image: clearPassImg,
    tech: [
      "React",
      "Spring Boot",
      "OpenCV",
      "U2-Net",
      "Haar Classifier",
      "OOP",
    ],
    demoVideo: "https://youtu.be/YMXRGslnNRk",
  },
  {
    title: "Infoguard",
    category: "Hackathon",
    description:
      "An all-in-one platform to detect scams and misinformation — combining content analysis, scam alerts, and educational tools.",
    image: infoguardImg,
    tech: ["React Native", "Node.js", "Expo Go", "Firebase"],
    figmaUrl:
      "https://www.figma.com/proto/J7PYb6tOpbcfvtnhfij8r8/CODE_EXP-2025?node-id=134-3320&p=f&t=dtikBaHDJSUxFu3G-1&scaling=scale-down&content-scaling=fixed&page-id=11%3A4&starting-point-node-id=134%3A3320",
    demoVideo: "https://youtu.be/p4sRmddvLgw",
    achievement: "DSTA CODE_EXP 2025 Finalist",
  },
  {
    title: "AfterClass Hackathon UI",
    category: "Hackathon",
    description:
      "A redesign of SMU’s bidding system with features like strategy toggles and mascot-assisted UX to help students manage their e$ more effectively.",
    image: afterclassImg,
    tech: ["Figma", "UI/UX", "Product Design"],
    liveUrl:
      "https://www.figma.com/proto/iUvrAvpnF1U8KagkvcCxGD/beforeclass-AfterClass-Design-Submission?node-id=3488-1582&p=f&t=IL3NEacPWlzX7nW6-1&scaling=min-zoom&content-scaling=fixed&page-id=1%3A593&starting-point-node-id=3488%3A1582&show-proto-sidebar=1",
    achievement: "6th Place",
  },
  {
    title: "Artify",
    category: "Mobile App Design",
    description:
      "A mobile app that connects creative professionals in Singapore — enabling them to collaborate, showcase work, and find new opportunities.",
    image: artifyImg,
    tech: ["Figma", "UI/UX", "Product Design"],
    demoVideo: "https://youtube.com/shorts/NQrLds2fOOs?feature=share",
    liveUrl:
      "https://www.figma.com/proto/ZzZ2zc9C6Lr2Yy3u7KmWcD/Artify?node-id=135-344&p=f&t=gyaueMlr1mLVk290-1&scaling=scale-down&content-scaling=fixed&page-id=3%3A2&starting-point-node-id=135%3A344&show-proto-sidebar=1",
  },
  {
    title: "Cathay Cineplex Digital Transformation",
    category: "Mobile App Design",
    description:
      "A conceptual revamp of Cathay’s mobile app to improve booking experience, streamline membership, and adapt to changing user behaviors.",
    image: cathayImg,
    tech: ["Figma", "UI/UX", "Product Design"],
    demoVideo: "https://youtube.com/shorts/NQrLds2fOOs?feature=share",
    liveUrl:
      "https://www.figma.com/proto/lWnMS45ZyJqTSjPf2r5ndo/Cathay?node-id=354-4650&p=f&t=VjfJ2ptRR5YfCP05-1&scaling=scale-down&content-scaling=fixed&page-id=1%3A6&starting-point-node-id=354%3A4650",
  },
];

export default projects;
