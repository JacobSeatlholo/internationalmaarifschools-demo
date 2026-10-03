export const IMAGES = {
  heroSlides: [
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/40b07aa547b3.jpg", alt: "Learners collaborating on campus" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f36a5097bedf.jpg", alt: "Robotics lab build session" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eb0403434a7c.jpg", alt: "Chemistry practical in the science lab" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e3fb87da18bf.jpg", alt: "Athletics day on the sports field" },
  ],
  gallery: [
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/556af33433d6.png", alt: "STREAM lab workbench", label: "STREAM Lab" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8ae4a1f7370a.jpg", alt: "Titration practical", label: "Chemistry Lab" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/32ecd38bc55c.jpg", alt: "Microscopy session", label: "Biology Lab" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f9cb36023399.jpg", alt: "Track training", label: "Athletics" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0aa0a5f96d74.jpg", alt: "Team huddle", label: "Team Sport" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4b0ed7b6b82d.jpg", alt: "Quad break time", label: "Campus Life" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c9c3b73544ee.jpg", alt: "Claremont and the mountain", label: "Our City" },
    { src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cd7d69539664.jpg", alt: "Cape Town coastline", label: "Mother City" },
  ],
  campus: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e701f82e39f9.jpg",
  cta: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/606bf22f3739.jpg",
} as const;

/** Sample teaching staff for the public-facing team grid (fully seeded team lives in ERP). */
export const PUBLIC_TEAM = [
  { name: "Dr. Emre Aydın", role: "Principal", subject: "School Leadership", tenure: "Since 2024", initials: "EA" },
  { name: "Thandiwe Mbeki", role: "Head of Sciences", subject: "Physical & Life Sciences", tenure: "Since 2024", initials: "TM" },
  { name: "Jaco van Wyk", role: "Head of Mathematics", subject: "Mathematics · AS-Level", tenure: "Since 2024", initials: "JW" },
  { name: "Sarah Petersen", role: "Senior Teacher", subject: "English Home Language", tenure: "Since 2024", initials: "SP" },
  { name: "Ahmet Demir", role: "STREAM Coordinator", subject: "Physics · Robotics", tenure: "Since 2024", initials: "AD" },
  { name: "Nomvula Dlamini", role: "Senior Teacher", subject: "History · Geography", tenure: "Since 2025", initials: "ND" },
  { name: "Riadh Isaacs", role: "Teacher", subject: "Mathematics · Accounting", tenure: "Since 2025", initials: "RI" },
  { name: "Zainep Yılmaz", role: "Cultural Programme Lead", subject: "Turkish Language & Culture", tenure: "Since 2025", initials: "ZY" },
] as const;
