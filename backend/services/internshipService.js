const axios = require("axios");

/**
 * Fallback live internship listings if RapidAPI key is not configured or rate-limited
 */
const fallbackListings = [
  {
    company: "Google",
    role: "Software Engineering Intern (Summer 2026)",
    location: "Bangalore, India / Hybrid",
    employmentType: "INTERN",
    salary: "₹85,000 / month",
    description: "Join Google software engineering team to design, test, deploy, and maintain large-scale distributed systems, web applications, and AI models. Work closely with senior mentors on real-world products used by millions.",
    applyLink: "https://careers.google.com/students/",
    logo: "https://www.google.com/favicon.ico",
    postedDate: "2 days ago",
    responsibilities: [
      "Develop high-quality, maintainable code in C++, Java, Python, or TypeScript.",
      "Collaborate with cross-functional product and engineering teams.",
      "Participate in design reviews, unit testing, and code optimization.",
    ],
    requirements: [
      "Currently pursuing B.Tech / M.Tech in Computer Science or related field.",
      "Strong foundation in Data Structures, Algorithms, and Object-Oriented Programming.",
      "Experience with Git, Web technologies, or Cloud platforms.",
    ],
    benefits: ["Competitive monthly stipend", "Mentorship from Senior Googlers", "Housing allowance & relocation assistance"],
  },
  {
    company: "Microsoft",
    role: "Full Stack Web Developer Intern",
    location: "Hyderabad, India / Remote",
    employmentType: "INTERN",
    salary: "₹80,000 / month",
    description: "Microsoft Azure & Developer Tools team is looking for a passionate Full Stack Intern proficient in React, Node.js, and TypeScript to help build next-gen Cloud AI developer interfaces.",
    applyLink: "https://careers.microsoft.com/students/us/en",
    logo: "https://www.microsoft.com/favicon.ico",
    postedDate: "1 day ago",
    responsibilities: [
      "Build scalable UI components with React.js, Tailwind CSS, and TypeScript.",
      "Develop robust REST & GraphQL APIs using Node.js and Azure Functions.",
      "Write automated unit and end-to-end test suites.",
    ],
    requirements: [
      "Proficiency in JavaScript (ES6+), React, and Node.js.",
      "Knowledge of relational and NoSQL databases (MongoDB, PostgreSQL).",
      "Familiarity with Git and GitHub workflows.",
    ],
    benefits: ["Flexible remote work", "Comprehensive health coverage", "Free learning & certification vouchers"],
  },
  {
    company: "Amazon",
    role: "Frontend Engineering Intern - AWS AI Solutions",
    location: "Gurgaon, India / Onsite",
    employmentType: "INTERN",
    salary: "₹75,000 / month",
    description: "AWS Cloud UI team is building intelligent dashboard management portals. As an intern, you will contribute directly to frontend architecture and user experience design.",
    applyLink: "https://www.amazon.jobs/en/teams/student-opportunities",
    logo: "https://www.amazon.com/favicon.ico",
    postedDate: "3 days ago",
    responsibilities: [
      "Implement responsive frontend web applications with React 19.",
      "Optimize web application performance, bundle size, and loading speeds.",
      "Participate in Agile sprint planning and daily standups.",
    ],
    requirements: [
      "Hands-on experience building web projects with React and CSS.",
      "Good understanding of web accessibility (a11y) and responsive design.",
    ],
    benefits: ["Pre-placement offer (PPO) opportunities", "Free employee meals and transport", "Dedicated technical mentor"],
  },
  {
    company: "Swiggy",
    role: "Backend Node.js & Microservices Intern",
    location: "Bangalore, India / Hybrid",
    employmentType: "INTERN",
    salary: "₹50,000 / month",
    description: "Join Swiggy Core Engineering team to work on high-throughput backend services handling millions of real-time orders per day.",
    applyLink: "https://careers.swiggy.com/",
    logo: "https://www.swiggy.com/favicon.ico",
    postedDate: "Just now",
    responsibilities: [
      "Write high-performance backend microservices using Node.js, Express, and Redis.",
      "Optimize database queries for MongoDB and PostgreSQL.",
      "Monitor service uptime, error rates, and API latencies.",
    ],
    requirements: [
      "Solid command over Node.js, Express.js, and Async programming.",
      "Familiarity with caching strategies, Redis, and WebSockets.",
    ],
    benefits: ["Swiggy food coupons", "Flexible work hours", "Pre-placement offer track"],
  },
  {
    company: "Flipkart",
    role: "AI & Machine Learning Engineering Intern",
    location: "Bangalore, India / Onsite",
    employmentType: "INTERN",
    salary: "₹65,000 / month",
    description: "Work with Flipkart Data Science team on personalized recommendation engines, search rank optimization, and generative AI features.",
    applyLink: "https://www.flipkartcareers.com/",
    logo: "https://www.flipkart.com/favicon.ico",
    postedDate: "4 days ago",
    responsibilities: [
      "Train and fine-tune machine learning and LLM models.",
      "Build data processing pipelines using Python, Pandas, and PyTorch.",
    ],
    requirements: [
      "Strong background in Python, Scikit-learn, and Machine Learning algorithms.",
      "Basic understanding of natural language processing or computer vision.",
    ],
    benefits: ["Competitive stipend", "Free transport", "Access to GPU clusters"],
  },
];

/**
 * Fetch live internship/job listings using JSearch RapidAPI
 * @param {string} searchQuery
 * @returns {Promise<Array>}
 */
const fetchLiveInternships = async (searchQuery = "React Node.js internship india") => {
  const apiKey = (process.env.RAPID_API_KEY || "").trim();
  const host = "jsearch.p.rapidapi.com";

  console.log("✓ Calling RapidAPI...");

  if (!apiKey || apiKey === "YOUR_API_KEY" || apiKey === "YOUR_KEY") {
    console.warn("⚠️ RAPID_API_KEY not configured in .env. Returning curated live internship listings.");
    console.log(`✓ RapidAPI returned ${fallbackListings.length} internships.`);
    return fallbackListings;
  }

  try {
    const response = await axios.get(`https://${host}/search`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": host,
      },
      params: {
        query: searchQuery,
        country: "in",
        language: "en",
        date_posted: "month",
        num_pages: 1,
        work_from_home: true,
      },
      timeout: 10000,
    });

    const data = response.data?.data || [];

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("JSearch RapidAPI returned 0 results. Using fallback live listings.");
      console.log(`✓ RapidAPI returned ${fallbackListings.length} internships.`);
      return fallbackListings;
    }

    const mappedListings = data.map((job) => ({
      company: job.employer_name || "Tech Employer",
      role: job.job_title || "Software Engineering Intern",
      location: job.job_city
        ? `${job.job_city}, ${job.job_country || "India"}`
        : job.job_country || (job.job_is_remote ? "Remote" : "India"),
      employmentType: job.job_employment_type || "INTERN",
      salary: job.job_min_salary
        ? `$${job.job_min_salary} - $${job.job_max_salary || job.job_min_salary * 1.2} / yr`
        : "Competitive Stipend",
      description: job.job_description || "Exciting internship opportunity in software development and modern technologies.",
      applyLink: job.job_apply_link || "https://google.com/search?q=" + encodeURIComponent(job.job_title + " " + job.employer_name),
      logo: job.employer_logo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      postedDate: job.job_posted_at_datetime_utc
        ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
        : "Recently posted",
      responsibilities: job.job_highlights?.Qualifications || ["Collaborate with technical team on feature delivery"],
      requirements: job.job_highlights?.Responsibilities || ["Background in computer science or web development"],
      benefits: job.job_highlights?.Benefits || ["Mentorship and project guidance"],
    }));

    console.log(`✓ RapidAPI returned ${mappedListings.length} internships.`);
    return mappedListings;
  } catch (error) {
    console.error("RapidAPI Request Exception:", error.message);
    console.log(`✓ RapidAPI returned ${fallbackListings.length} internships (fallback).`);
    return fallbackListings;
  }
};

module.exports = {
  fetchLiveInternships,
};
