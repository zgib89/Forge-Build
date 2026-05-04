import type { FontPairId, RadiusScaleId } from "./typography";

export type CareerCategory =
  | "general"
  | "beauty-wellness"
  | "software-it"
  | "design-creative"
  | "writing-research"
  | "operations-admin"
  | "sales-marketing"
  | "hospitality-food"
  | "retail-customer-service"
  | "education-training"
  | "healthcare-care"
  | "trades-field"
  | "real-estate-property"
  | "logistics-transportation"
  | "manufacturing-warehouse"
  | "finance-legal"
  | "public-service-nonprofit"
  | "fitness-coaching"
  | "arts-events"
  | "agriculture-outdoor"
  | "student-early-career";

export type VisualStyleId =
  | "custom"
  | "signal-dossier"
  | "forge-glass"
  | "westfall-archive"
  | "northbridge-horizon"
  | "righteous-recon"
  | "quiet-studio"
  | "terminal-minimal";

export type CardStyleId =
  | "flat-editorial"
  | "border-line"
  | "soft-bubble"
  | "forge-glass"
  | "archive-evidence"
  | "recon-stat"
  | "app-icon";

export type BackgroundTreatment = "none" | "soft" | "duotone" | "grain" | "spotlight";
export type MotionLevel = "none" | "calm" | "standard" | "expressive";

export interface CareerExample {
  role: string;
  tagline: string;
  workTitle: string;
  workSummary: string;
  skills: string[];
  contribution: string;
  proofPlaceholder: string;
}

export interface CareerProfile {
  id: CareerCategory;
  label: string;
  description: string;
  workLabel: string;
  workItemLabel: string;
  skillLabel: string;
  proofLabel: string;
  rolePlaceholder: string;
  taglinePlaceholder: string;
  examples: CareerExample[];
}

export const CAREER_CATEGORIES: CareerProfile[] = [
  {
    id: "general",
    label: "General / custom",
    description: "Works for any career, side project, or personal brand.",
    workLabel: "Selected work",
    workItemLabel: "Work sample",
    skillLabel: "Skills, tools, or methods",
    proofLabel: "Proof link",
    rolePlaceholder: "Operations leader, writer, nurse, designer...",
    taglinePlaceholder: "A practical line about the work you do and the outcomes you create.",
    examples: [
      {
        role: "Independent Professional",
        tagline: "Clear work, useful systems, and measurable follow-through.",
        workTitle: "Client workflow refresh",
        workSummary: "Rebuilt the handoff process so work moved faster and fewer details were missed.",
        skills: ["Process design", "Documentation", "Client communication"],
        contribution: "Lead operator",
        proofPlaceholder: "https://your-site.com/case-study",
      },
      {
        role: "Career Switcher",
        tagline: "Turning real experience into a sharper, proof-driven portfolio.",
        workTitle: "Portfolio case study",
        workSummary: "Documented a project from problem to outcome with clear evidence and next steps.",
        skills: ["Research", "Writing", "Presentation"],
        contribution: "Author",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "beauty-wellness",
    label: "Beauty / wellness",
    description: "Hair, barbering, nails, skin, massage, spa, and wellness services.",
    workLabel: "Service proof",
    workItemLabel: "Transformation",
    skillLabel: "Services, techniques, or specialties",
    proofLabel: "Gallery, booking, review, or social link",
    rolePlaceholder: "Hair Stylist",
    taglinePlaceholder: "Polished cuts, color, and care that help clients feel like themselves.",
    examples: [
      {
        role: "Hair Stylist",
        tagline: "Dimensional color, healthy hair plans, and client-first styling.",
        workTitle: "Color correction gallery",
        workSummary: "Documented a multi-session color correction from consultation through final tone and care plan.",
        skills: ["Color correction", "Blonding", "Client care"],
        contribution: "Stylist",
        proofPlaceholder: "https://instagram.com/yourhandle",
      },
      {
        role: "Barber",
        tagline: "Clean fades, beard shaping, and consistent chair experience.",
        workTitle: "Cut transformation series",
        workSummary: "Built a before-and-after gallery showing shape, fade detail, and finished style.",
        skills: ["Fades", "Beard work", "Consultation"],
        contribution: "Barber",
        proofPlaceholder: "https://your-booking-link.com",
      },
      {
        role: "Esthetician",
        tagline: "Practical skin care, calm appointments, and visible treatment plans.",
        workTitle: "Skin care routine plan",
        workSummary: "Created a simple client routine with treatment notes, product guidance, and progress photos.",
        skills: ["Facials", "Skin analysis", "Aftercare"],
        contribution: "Provider",
        proofPlaceholder: "https://your-site.com/services",
      },
    ],
  },
  {
    id: "software-it",
    label: "Software / IT",
    description: "Apps, infrastructure, security, identity, data, and technical systems.",
    workLabel: "Projects",
    workItemLabel: "Project",
    skillLabel: "Stack, tools, or protocols",
    proofLabel: "Live, repo, or technical write-up",
    rolePlaceholder: "IAM Engineer",
    taglinePlaceholder: "Identity engineer building secure systems people can actually use.",
    examples: [
      {
        role: "IAM Engineer",
        tagline: "Identity systems, access control, and practical security automation.",
        workTitle: "Access review cleanup",
        workSummary: "Standardized app ownership and approval evidence across a messy access review cycle.",
        skills: ["IAM", "Okta", "Audit evidence", "Automation"],
        contribution: "Engineer",
        proofPlaceholder: "https://github.com/yourname/project",
      },
      {
        role: "Frontend Developer",
        tagline: "Building fast product surfaces with strong interaction design.",
        workTitle: "Customer dashboard rebuild",
        workSummary: "Turned a slow reporting view into a focused, filterable workflow for account teams.",
        skills: ["React", "TypeScript", "UX systems"],
        contribution: "Frontend lead",
        proofPlaceholder: "https://demo.yoursite.com",
      },
    ],
  },
  {
    id: "design-creative",
    label: "Design / creative",
    description: "Brand, visual design, content, photography, motion, and creative direction.",
    workLabel: "Case work",
    workItemLabel: "Case study",
    skillLabel: "Mediums, tools, or services",
    proofLabel: "Portfolio, campaign, or gallery link",
    rolePlaceholder: "Brand Designer",
    taglinePlaceholder: "Visual systems that make small teams look impossible to ignore.",
    examples: [
      {
        role: "Brand Designer",
        tagline: "Identity, launch systems, and campaign assets for ambitious teams.",
        workTitle: "Restaurant brand refresh",
        workSummary: "Built a warmer identity system across menus, social assets, and launch signage.",
        skills: ["Identity", "Typography", "Art direction"],
        contribution: "Creative lead",
        proofPlaceholder: "https://behance.net/yourname",
      },
      {
        role: "Photographer",
        tagline: "Editorial images for people, spaces, and brands with a point of view.",
        workTitle: "Maker studio shoot",
        workSummary: "Captured process, product, and founder portraits for a launch-ready press kit.",
        skills: ["Portraits", "Lighting", "Retouching"],
        contribution: "Photographer",
        proofPlaceholder: "https://your-gallery.com",
      },
    ],
  },
  {
    id: "writing-research",
    label: "Writing / research",
    description: "Books, essays, reports, research notes, documentation, and editorial work.",
    workLabel: "Published work",
    workItemLabel: "Piece",
    skillLabel: "Methods, beats, or formats",
    proofLabel: "Article, sample, or publication link",
    rolePlaceholder: "Research Writer",
    taglinePlaceholder: "Deep research shaped into clear, useful stories.",
    examples: [
      {
        role: "Author",
        tagline: "Long-form fiction and worldbuilding with a researcher's spine.",
        workTitle: "Serialized book project",
        workSummary: "Developed characters, locations, and a release pipeline for a long-running story world.",
        skills: ["Fiction", "Worldbuilding", "Editing"],
        contribution: "Writer",
        proofPlaceholder: "https://yourpublication.com/story",
      },
      {
        role: "Research Analyst",
        tagline: "Turning scattered evidence into briefings people can act on.",
        workTitle: "Market landscape brief",
        workSummary: "Synthesized competitor movement, customer patterns, and risk signals into a decision memo.",
        skills: ["Research", "Synthesis", "Briefing"],
        contribution: "Analyst",
        proofPlaceholder: "https://your-site.com/report",
      },
    ],
  },
  {
    id: "operations-admin",
    label: "Operations / admin",
    description: "Coordination, scheduling, office operations, process cleanup, and service delivery.",
    workLabel: "Operational wins",
    workItemLabel: "Improvement",
    skillLabel: "Systems, tools, or methods",
    proofLabel: "Case note, metric, or reference link",
    rolePlaceholder: "Operations Coordinator",
    taglinePlaceholder: "Cleaner workflows, better handoffs, fewer avoidable fires.",
    examples: [
      {
        role: "Operations Coordinator",
        tagline: "Making repeat work easier to run, track, and improve.",
        workTitle: "Scheduling handoff cleanup",
        workSummary: "Reduced missed handoffs by standardizing weekly intake, owner notes, and follow-up timing.",
        skills: ["Scheduling", "SOPs", "Vendor coordination"],
        contribution: "Process owner",
        proofPlaceholder: "https://your-site.com/ops-case",
      },
      {
        role: "Executive Assistant",
        tagline: "Calendar control, communications, and calm execution for busy leaders.",
        workTitle: "Board packet workflow",
        workSummary: "Built a reusable prep timeline that made monthly board materials easier to review.",
        skills: ["Calendar management", "Docs", "Stakeholder updates"],
        contribution: "Coordinator",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "sales-marketing",
    label: "Sales / marketing",
    description: "Campaigns, growth, partnerships, customer stories, and revenue work.",
    workLabel: "Campaigns and wins",
    workItemLabel: "Campaign",
    skillLabel: "Channels, tools, or tactics",
    proofLabel: "Campaign, deck, or result link",
    rolePlaceholder: "Growth Marketer",
    taglinePlaceholder: "Sharper positioning, cleaner funnels, and campaigns people remember.",
    examples: [
      {
        role: "Growth Marketer",
        tagline: "Positioning, experiments, and launch systems for practical growth.",
        workTitle: "Regional pipeline recovery",
        workSummary: "Reworked follow-up cadence and messaging for stalled accounts across a regional book.",
        skills: ["CRM", "Email", "Pipeline analysis"],
        contribution: "Campaign owner",
        proofPlaceholder: "https://your-site.com/campaign",
      },
      {
        role: "Account Executive",
        tagline: "Consultative sales with clean follow-through and durable relationships.",
        workTitle: "Enterprise renewal save",
        workSummary: "Mapped objections, coordinated internal owners, and brought a high-risk renewal back on track.",
        skills: ["Discovery", "Negotiation", "Customer strategy"],
        contribution: "Deal lead",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "hospitality-food",
    label: "Hospitality / food",
    description: "Restaurants, bars, hotels, catering, events, and guest experience.",
    workLabel: "Service wins",
    workItemLabel: "Service moment",
    skillLabel: "Stations, systems, or service skills",
    proofLabel: "Menu, review, event, or venue link",
    rolePlaceholder: "Restaurant Manager",
    taglinePlaceholder: "Calm service, tight operations, and guest experiences people remember.",
    examples: [
      {
        role: "Chef",
        tagline: "Seasonal menus, clean execution, and food people talk about.",
        workTitle: "Seasonal menu rollout",
        workSummary: "Built a focused menu update with prep notes, plating direction, and service feedback.",
        skills: ["Menu development", "Prep systems", "Plating"],
        contribution: "Chef",
        proofPlaceholder: "https://instagram.com/yourfood",
      },
      {
        role: "Hotel Front Desk Lead",
        tagline: "Fast problem solving and steady guest communication under pressure.",
        workTitle: "Check-in recovery workflow",
        workSummary: "Improved peak-hour check-in flow with clearer room-status handoffs and guest updates.",
        skills: ["Guest service", "Scheduling", "Conflict resolution"],
        contribution: "Shift lead",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "retail-customer-service",
    label: "Retail / customer service",
    description: "Store teams, support, merchandising, customer success, and front-line service.",
    workLabel: "Customer wins",
    workItemLabel: "Win",
    skillLabel: "Systems, products, or service skills",
    proofLabel: "Metric, review, or reference link",
    rolePlaceholder: "Customer Service Lead",
    taglinePlaceholder: "Clear answers, patient support, and better customer handoffs.",
    examples: [
      {
        role: "Retail Manager",
        tagline: "Store operations, merchandising, and practical team leadership.",
        workTitle: "Holiday floor reset",
        workSummary: "Reworked product placement and associate zones to improve traffic flow during peak season.",
        skills: ["Merchandising", "Team leadership", "Inventory"],
        contribution: "Store lead",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
      {
        role: "Customer Support Specialist",
        tagline: "Patient, precise support that gets customers unstuck.",
        workTitle: "Support macro cleanup",
        workSummary: "Updated common replies and escalation notes so customers got clearer answers faster.",
        skills: ["Support", "Documentation", "Escalation"],
        contribution: "Support owner",
        proofPlaceholder: "https://your-site.com/support",
      },
    ],
  },
  {
    id: "education-training",
    label: "Education / training",
    description: "Teaching, coaching, curriculum, workshops, enablement, and learning design.",
    workLabel: "Teaching work",
    workItemLabel: "Learning outcome",
    skillLabel: "Subjects, methods, or tools",
    proofLabel: "Lesson, credential, or resource link",
    rolePlaceholder: "Instructional Designer",
    taglinePlaceholder: "Learning experiences that make hard things usable.",
    examples: [
      {
        role: "Teacher",
        tagline: "Clear instruction, better routines, and measurable student support.",
        workTitle: "Algebra intervention cycle",
        workSummary: "Built a six-week support plan for students below benchmark and tracked weekly gains.",
        skills: ["Lesson planning", "Assessment", "Student support"],
        contribution: "Instructor",
        proofPlaceholder: "https://your-site.com/lesson",
      },
      {
        role: "Trainer",
        tagline: "Practical enablement that turns process into behavior.",
        workTitle: "New hire onboarding",
        workSummary: "Designed a repeatable onboarding path that helped new team members ramp faster.",
        skills: ["Workshops", "Docs", "Enablement"],
        contribution: "Program designer",
        proofPlaceholder: "https://your-site.com/training",
      },
    ],
  },
  {
    id: "healthcare-care",
    label: "Healthcare / care",
    description: "Patient care, intake, coordination, support programs, and clinical operations.",
    workLabel: "Care outcomes",
    workItemLabel: "Outcome",
    skillLabel: "Care skills, systems, or methods",
    proofLabel: "Credential, reference, or case note",
    rolePlaceholder: "Patient Care Coordinator",
    taglinePlaceholder: "Compassionate coordination with strong process behind it.",
    examples: [
      {
        role: "Patient Care Coordinator",
        tagline: "Better intake, clearer follow-up, and calmer care experiences.",
        workTitle: "Patient intake workflow",
        workSummary: "Helped standardize intake notes and reduce repeat questions across recurring visits.",
        skills: ["Patient intake", "Scheduling", "Documentation"],
        contribution: "Coordinator",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
      {
        role: "Caregiver",
        tagline: "Reliable support, strong observation, and human-centered follow-through.",
        workTitle: "Medication reminder routine",
        workSummary: "Created a repeatable daily routine that improved consistency and reduced missed steps.",
        skills: ["Care planning", "Observation", "Communication"],
        contribution: "Care support",
        proofPlaceholder: "https://your-site.com/care-note",
      },
    ],
  },
  {
    id: "trades-field",
    label: "Trades / field work",
    description: "Construction, installation, maintenance, field service, logistics, and hands-on work.",
    workLabel: "Field work",
    workItemLabel: "Job",
    skillLabel: "Tools, methods, or certifications",
    proofLabel: "Photo, certification, or job note",
    rolePlaceholder: "Field Service Technician",
    taglinePlaceholder: "Reliable field work, clear communication, and clean closeout.",
    examples: [
      {
        role: "Field Service Technician",
        tagline: "Clean installs, practical troubleshooting, and no loose ends.",
        workTitle: "Multi-site installation",
        workSummary: "Coordinated materials, site access, install notes, and punch-list closeout across locations.",
        skills: ["Installation", "Troubleshooting", "Safety"],
        contribution: "Field lead",
        proofPlaceholder: "https://your-site.com/job-gallery",
      },
      {
        role: "Maintenance Lead",
        tagline: "Preventive systems and fast fixes that keep work moving.",
        workTitle: "Preventive maintenance route",
        workSummary: "Reorganized recurring checks so issues surfaced earlier and downtime dropped.",
        skills: ["PM schedules", "Diagnostics", "Repair logs"],
        contribution: "Lead technician",
        proofPlaceholder: "https://your-site.com/maintenance",
      },
    ],
  },
  {
    id: "real-estate-property",
    label: "Real estate / property",
    description: "Agents, leasing, property management, staging, inspections, and facilities.",
    workLabel: "Property work",
    workItemLabel: "Property result",
    skillLabel: "Markets, tools, or service skills",
    proofLabel: "Listing, review, or case link",
    rolePlaceholder: "Real Estate Agent",
    taglinePlaceholder: "Clear guidance, strong follow-through, and smoother property decisions.",
    examples: [
      {
        role: "Real Estate Agent",
        tagline: "Helping clients move through big decisions with clean communication.",
        workTitle: "First-time buyer plan",
        workSummary: "Guided a buyer through search criteria, offer timing, inspection notes, and closing steps.",
        skills: ["Buyer guidance", "Negotiation", "Market research"],
        contribution: "Agent",
        proofPlaceholder: "https://your-listing-link.com",
      },
      {
        role: "Property Manager",
        tagline: "Responsive operations for tenants, vendors, and owners.",
        workTitle: "Maintenance request cleanup",
        workSummary: "Reorganized request intake and vendor follow-up to reduce unresolved tickets.",
        skills: ["Tenant support", "Vendor coordination", "Inspections"],
        contribution: "Manager",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "logistics-transportation",
    label: "Logistics / transportation",
    description: "Dispatch, delivery, fleet, routes, warehouse movement, and supply chain.",
    workLabel: "Logistics wins",
    workItemLabel: "Route or process",
    skillLabel: "Systems, routes, or equipment",
    proofLabel: "Metric, certificate, or case link",
    rolePlaceholder: "Logistics Coordinator",
    taglinePlaceholder: "Cleaner routing, better handoffs, and dependable delivery windows.",
    examples: [
      {
        role: "Dispatcher",
        tagline: "Route control, driver communication, and fast exception handling.",
        workTitle: "Route exception tracker",
        workSummary: "Created a simpler exception log so delayed deliveries had clear owners and updates.",
        skills: ["Dispatch", "Route planning", "Driver communication"],
        contribution: "Coordinator",
        proofPlaceholder: "https://your-site.com/logistics",
      },
      {
        role: "Delivery Driver",
        tagline: "Reliable routes, customer care, and clean delivery records.",
        workTitle: "Customer delivery routine",
        workSummary: "Standardized photo proof, customer notes, and issue reporting for daily routes.",
        skills: ["Route safety", "Customer service", "Proof of delivery"],
        contribution: "Driver",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "manufacturing-warehouse",
    label: "Manufacturing / warehouse",
    description: "Production, quality, inventory, fulfillment, safety, and shift leadership.",
    workLabel: "Production wins",
    workItemLabel: "Improvement",
    skillLabel: "Equipment, systems, or methods",
    proofLabel: "Metric, cert, or improvement note",
    rolePlaceholder: "Warehouse Supervisor",
    taglinePlaceholder: "Safer shifts, cleaner inventory, and dependable throughput.",
    examples: [
      {
        role: "Warehouse Supervisor",
        tagline: "Inventory accuracy, shift rhythm, and practical team leadership.",
        workTitle: "Pick path cleanup",
        workSummary: "Reorganized high-volume pick zones and daily checks to reduce avoidable travel time.",
        skills: ["Inventory", "Shift leadership", "Safety"],
        contribution: "Supervisor",
        proofPlaceholder: "https://your-site.com/warehouse",
      },
      {
        role: "Quality Technician",
        tagline: "Careful inspection, clean records, and repeatable quality checks.",
        workTitle: "Inspection checklist update",
        workSummary: "Improved a recurring inspection checklist so defects were easier to classify and escalate.",
        skills: ["Quality control", "Documentation", "Root cause"],
        contribution: "Technician",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "finance-legal",
    label: "Finance / legal",
    description: "Client service, compliance, analysis, document operations, and risk-aware work.",
    workLabel: "Client work",
    workItemLabel: "Matter",
    skillLabel: "Methods, tools, or domains",
    proofLabel: "Credential, article, or case note",
    rolePlaceholder: "Financial Analyst",
    taglinePlaceholder: "Clear analysis, clean records, and risk-aware execution.",
    examples: [
      {
        role: "Financial Analyst",
        tagline: "Decision-ready models, clean assumptions, and practical reporting.",
        workTitle: "Budget variance model",
        workSummary: "Reworked monthly variance reporting so leaders could see changes and causes faster.",
        skills: ["Excel", "Forecasting", "Reporting"],
        contribution: "Analyst",
        proofPlaceholder: "https://your-site.com/analysis",
      },
      {
        role: "Legal Assistant",
        tagline: "Document control, client intake, and careful deadline management.",
        workTitle: "Client document process",
        workSummary: "Improved intake accuracy and filing turnaround with a simpler checklist and review path.",
        skills: ["Intake", "Document review", "Filing"],
        contribution: "Case support",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "public-service-nonprofit",
    label: "Public service / nonprofit",
    description: "Community programs, public administration, advocacy, volunteer leadership, and services.",
    workLabel: "Community impact",
    workItemLabel: "Impact story",
    skillLabel: "Programs, partners, or service skills",
    proofLabel: "Program, report, or reference link",
    rolePlaceholder: "Program Coordinator",
    taglinePlaceholder: "Community work with clear operations and measurable follow-through.",
    examples: [
      {
        role: "Program Coordinator",
        tagline: "Turning community needs into organized, accountable programs.",
        workTitle: "Volunteer intake refresh",
        workSummary: "Simplified sign-up, orientation, and shift reminders for a recurring community program.",
        skills: ["Program ops", "Volunteer coordination", "Outreach"],
        contribution: "Coordinator",
        proofPlaceholder: "https://your-nonprofit.org/program",
      },
      {
        role: "Public Service Specialist",
        tagline: "Clear service, accurate records, and steady support for residents.",
        workTitle: "Resident request workflow",
        workSummary: "Improved request notes and routing so common resident questions reached the right team faster.",
        skills: ["Case notes", "Public service", "Routing"],
        contribution: "Service specialist",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "fitness-coaching",
    label: "Fitness / coaching",
    description: "Personal training, sports coaching, nutrition, wellness coaching, and instruction.",
    workLabel: "Client progress",
    workItemLabel: "Progress story",
    skillLabel: "Methods, programs, or certifications",
    proofLabel: "Program, review, or booking link",
    rolePlaceholder: "Personal Trainer",
    taglinePlaceholder: "Clear plans, consistent coaching, and progress clients can feel.",
    examples: [
      {
        role: "Personal Trainer",
        tagline: "Strength plans, sustainable habits, and practical accountability.",
        workTitle: "12-week strength block",
        workSummary: "Built a progressive training plan around client goals, constraints, and weekly check-ins.",
        skills: ["Strength training", "Programming", "Coaching"],
        contribution: "Coach",
        proofPlaceholder: "https://your-booking-link.com",
      },
      {
        role: "Youth Coach",
        tagline: "Skill development, confidence, and team habits that last.",
        workTitle: "Preseason skills clinic",
        workSummary: "Designed a focused clinic for fundamentals, practice rhythm, and player confidence.",
        skills: ["Instruction", "Team building", "Practice planning"],
        contribution: "Coach",
        proofPlaceholder: "https://your-site.com/clinic",
      },
    ],
  },
  {
    id: "arts-events",
    label: "Arts / events",
    description: "Performing arts, event production, music, venues, coordination, and creative programs.",
    workLabel: "Productions",
    workItemLabel: "Production",
    skillLabel: "Mediums, venues, or production skills",
    proofLabel: "Gallery, ticket, reel, or event link",
    rolePlaceholder: "Event Coordinator",
    taglinePlaceholder: "Well-run events with clear details and a strong audience experience.",
    examples: [
      {
        role: "Event Coordinator",
        tagline: "Timelines, vendor handoffs, and guest flow without the chaos.",
        workTitle: "Community launch event",
        workSummary: "Coordinated run-of-show, vendors, signage, and day-of issue handling for a public launch.",
        skills: ["Run of show", "Vendor coordination", "Guest experience"],
        contribution: "Coordinator",
        proofPlaceholder: "https://your-event-link.com",
      },
      {
        role: "Musician",
        tagline: "Performance, production, and releases with a clear creative identity.",
        workTitle: "Live session release",
        workSummary: "Planned, recorded, and published a live session package with photos and release notes.",
        skills: ["Performance", "Production", "Promotion"],
        contribution: "Artist",
        proofPlaceholder: "https://your-music-link.com",
      },
    ],
  },
  {
    id: "agriculture-outdoor",
    label: "Agriculture / outdoor",
    description: "Landscaping, farming, outdoor services, conservation, horticulture, and grounds work.",
    workLabel: "Outdoor work",
    workItemLabel: "Job or season",
    skillLabel: "Equipment, methods, or specialties",
    proofLabel: "Gallery, certificate, or job link",
    rolePlaceholder: "Landscape Crew Lead",
    taglinePlaceholder: "Reliable outdoor work, clean sites, and practical care plans.",
    examples: [
      {
        role: "Landscape Crew Lead",
        tagline: "Clean installs, careful maintenance, and visible site improvement.",
        workTitle: "Residential yard reset",
        workSummary: "Planned cleanup, edging, planting, and maintenance guidance for a full-yard refresh.",
        skills: ["Landscape install", "Crew leadership", "Maintenance"],
        contribution: "Crew lead",
        proofPlaceholder: "https://your-site.com/gallery",
      },
      {
        role: "Farm Assistant",
        tagline: "Seasonal work, equipment care, and dependable daily operations.",
        workTitle: "Harvest workflow",
        workSummary: "Supported harvest prep, equipment checks, and produce handling during peak season.",
        skills: ["Harvest", "Equipment care", "Safety"],
        contribution: "Field support",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
  {
    id: "student-early-career",
    label: "Student / early career",
    description: "Capstones, internships, clubs, volunteer work, coursework, and first professional proof.",
    workLabel: "Proof of work",
    workItemLabel: "Experience",
    skillLabel: "Skills, coursework, or tools",
    proofLabel: "Demo, certificate, or write-up",
    rolePlaceholder: "Marketing Student",
    taglinePlaceholder: "Learning fast, building proof, and showing the work clearly.",
    examples: [
      {
        role: "Computer Science Student",
        tagline: "Coursework, projects, and internships presented as clear evidence.",
        workTitle: "Capstone project",
        workSummary: "Researched, built, presented, and documented a final deliverable for a real audience.",
        skills: ["Research", "Teamwork", "Presentation"],
        contribution: "Student lead",
        proofPlaceholder: "https://your-site.com/capstone",
      },
      {
        role: "Early Career Professional",
        tagline: "Entry-level experience with visible learning, ownership, and momentum.",
        workTitle: "Internship project",
        workSummary: "Supported a team initiative, documented the process, and presented lessons learned.",
        skills: ["Communication", "Analysis", "Documentation"],
        contribution: "Intern",
        proofPlaceholder: "https://linkedin.com/in/yourname",
      },
    ],
  },
];

export const getCareerProfile = (id?: string): CareerProfile =>
  CAREER_CATEGORIES.find((c) => c.id === id) ?? CAREER_CATEGORIES[0];

export interface VisualStyle {
  id: VisualStyleId;
  label: string;
  description: string;
  palette: {
    name: string;
    bg: string;
    surface: string;
    border: string;
    text: string;
    mute: string;
    accent: string;
    accent2?: string;
  };
  darkMode: boolean;
  fontPair: FontPairId;
  radiusScale: RadiusScaleId;
  cardStyle: CardStyleId;
  backgroundTreatment: BackgroundTreatment;
  effects: {
    glowIntensity: number;
    edgeGlow: number;
    motionLevel: MotionLevel;
    marqueeSpeed: number;
    hoverDepth: number;
    grainIntensity: number;
    glassBlur: number;
  };
}

export const VISUAL_STYLES: VisualStyle[] = [
  {
    id: "signal-dossier",
    label: "Signal Dossier",
    description: "Paper, ink, acid signal color, and sharp editorial hierarchy.",
    palette: {
      name: "Signal Paper",
      bg: "oklch(0.965 0.012 92)",
      surface: "oklch(0.935 0.015 92)",
      border: "oklch(0.82 0.025 92)",
      text: "oklch(0.17 0.02 95)",
      mute: "oklch(0.42 0.025 95)",
      accent: "#d4ff00",
      accent2: "oklch(0.70 0.13 70)",
    },
    darkMode: false,
    fontPair: "classic",
    radiusScale: "sharp",
    cardStyle: "flat-editorial",
    backgroundTreatment: "grain",
    effects: { glowIntensity: 1, edgeGlow: 1, motionLevel: "calm", marqueeSpeed: 34, hoverDepth: 2, grainIntensity: 2, glassBlur: 0 },
  },
  {
    id: "forge-glass",
    label: "Forge Glass",
    description: "Black field, cyan/purple light, glass cards, and app-icon polish.",
    palette: {
      name: "Forge Neon",
      bg: "oklch(0.10 0.02 260)",
      surface: "oklch(0.15 0.025 255)",
      border: "oklch(0.34 0.08 240)",
      text: "oklch(0.96 0.005 85)",
      mute: "oklch(0.72 0.03 240)",
      accent: "oklch(0.76 0.18 205)",
      accent2: "oklch(0.68 0.22 292)",
    },
    darkMode: true,
    fontPair: "display",
    radiusScale: "soft",
    cardStyle: "forge-glass",
    backgroundTreatment: "spotlight",
    effects: { glowIntensity: 3, edgeGlow: 3, motionLevel: "expressive", marqueeSpeed: 24, hoverDepth: 5, grainIntensity: 1, glassBlur: 2 },
  },
  {
    id: "westfall-archive",
    label: "Westfall Archive",
    description: "Noir archive mood with brass edges, oxblood marks, and evidence cards.",
    palette: {
      name: "Archive Brass",
      bg: "#0a0a0b",
      surface: "#141210",
      border: "#463a2c",
      text: "#f2eadc",
      mute: "#b8aa95",
      accent: "#c9a36b",
      accent2: "#9e1b1b",
    },
    darkMode: true,
    fontPair: "editorial",
    radiusScale: "sharp",
    cardStyle: "archive-evidence",
    backgroundTreatment: "grain",
    effects: { glowIntensity: 1, edgeGlow: 3, motionLevel: "calm", marqueeSpeed: 52, hoverDepth: 2, grainIntensity: 3, glassBlur: 0 },
  },
  {
    id: "northbridge-horizon",
    label: "Northbridge Horizon",
    description: "Midnight IAM lab feel with cyan circuits and disciplined console surfaces.",
    palette: {
      name: "Horizon Cyan",
      bg: "oklch(0.12 0.025 250)",
      surface: "oklch(0.18 0.035 245)",
      border: "oklch(0.36 0.08 220)",
      text: "oklch(0.96 0.005 95)",
      mute: "oklch(0.72 0.035 225)",
      accent: "oklch(0.76 0.15 205)",
      accent2: "oklch(0.74 0.12 180)",
    },
    darkMode: true,
    fontPair: "modern",
    radiusScale: "soft",
    cardStyle: "border-line",
    backgroundTreatment: "duotone",
    effects: { glowIntensity: 2, edgeGlow: 4, motionLevel: "standard", marqueeSpeed: 30, hoverDepth: 3, grainIntensity: 1, glassBlur: 1 },
  },
  {
    id: "righteous-recon",
    label: "Righteous Recon",
    description: "Review-site energy: strong type, warm signal color, stats, and contrast.",
    palette: {
      name: "Recon Orange",
      bg: "oklch(0.12 0.015 75)",
      surface: "oklch(0.18 0.02 75)",
      border: "oklch(0.34 0.06 65)",
      text: "oklch(0.95 0.01 80)",
      mute: "oklch(0.72 0.03 78)",
      accent: "oklch(0.76 0.16 55)",
      accent2: "oklch(0.70 0.12 180)",
    },
    darkMode: true,
    fontPair: "display",
    radiusScale: "sharp",
    cardStyle: "recon-stat",
    backgroundTreatment: "grain",
    effects: { glowIntensity: 2, edgeGlow: 2, motionLevel: "standard", marqueeSpeed: 20, hoverDepth: 4, grainIntensity: 2, glassBlur: 0 },
  },
  {
    id: "quiet-studio",
    label: "Quiet Studio",
    description: "Calm ivory, charcoal, soft spacing, and minimal motion for any profession.",
    palette: {
      name: "Quiet Studio",
      bg: "oklch(0.985 0.006 95)",
      surface: "oklch(0.96 0.008 95)",
      border: "oklch(0.86 0.012 95)",
      text: "oklch(0.18 0.012 80)",
      mute: "oklch(0.48 0.015 80)",
      accent: "oklch(0.45 0.09 185)",
      accent2: "oklch(0.64 0.10 40)",
    },
    darkMode: false,
    fontPair: "editorial",
    radiusScale: "soft",
    cardStyle: "soft-bubble",
    backgroundTreatment: "soft",
    effects: { glowIntensity: 0, edgeGlow: 0, motionLevel: "calm", marqueeSpeed: 60, hoverDepth: 1, grainIntensity: 0, glassBlur: 0 },
  },
  {
    id: "terminal-minimal",
    label: "Terminal Minimal",
    description: "Dense mono layout with amber/cyan signal and very little decoration.",
    palette: {
      name: "Mono Amber",
      bg: "oklch(0.11 0 0)",
      surface: "oklch(0.16 0 0)",
      border: "oklch(0.30 0 0)",
      text: "oklch(0.94 0 0)",
      mute: "oklch(0.66 0 0)",
      accent: "oklch(0.78 0.16 70)",
      accent2: "oklch(0.75 0.15 200)",
    },
    darkMode: true,
    fontPair: "mono",
    radiusScale: "sharp",
    cardStyle: "border-line",
    backgroundTreatment: "none",
    effects: { glowIntensity: 1, edgeGlow: 1, motionLevel: "none", marqueeSpeed: 72, hoverDepth: 0, grainIntensity: 0, glassBlur: 0 },
  },
];

export const getVisualStyle = (id?: string): VisualStyle =>
  VISUAL_STYLES.find((s) => s.id === id) ?? VISUAL_STYLES[1];
