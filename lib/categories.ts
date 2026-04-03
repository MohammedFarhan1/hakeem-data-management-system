import { CategoryConfig, FormSectionConfig } from "@/lib/types";

const departmentalInputCategories: CategoryConfig[] = [
  {
    slug: "training-programs",
    label: "Training Programs",
    description: "Track faculty and student development sessions with duration, venue, and outcome.",
    dbCategoryName: "Training Programs",
    fields: [
      { id: "program_name", label: "Program Name", type: "text", required: true },
      { id: "organized_by", label: "Organized By", type: "text", required: true },
      { id: "date_conducted", label: "Date Conducted", type: "date", required: true },
      { id: "participants", label: "Participants", type: "number", required: true }
    ]
  },
  {
    slug: "functional-mou",
    label: "Functional MoU",
    description: "Capture partner details, duration, and impact of each MoU.",
    dbCategoryName: "Functional MoU",
    fields: [
      { id: "partner_name", label: "Partner Name", type: "text", required: true },
      { id: "start_date", label: "Start Date", type: "date", required: true },
      { id: "end_date", label: "End Date", type: "date" },
      { id: "mou_scope", label: "Scope", type: "textarea", required: true }
    ]
  },
  {
    slug: "mentor-details",
    label: "Mentor Details",
    description: "Maintain mentor allocation and mentoring outcomes.",
    dbCategoryName: "Mentor Details",
    fields: [
      { id: "mentor_name", label: "Mentor Name", type: "text", required: true },
      { id: "mentor_email", label: "Mentor Email", type: "email", required: true },
      { id: "mentees_count", label: "Number of Mentees", type: "number", required: true },
      { id: "meeting_frequency", label: "Meeting Frequency", type: "text", required: true }
    ]
  },
  {
    slug: "collaborative-activities",
    label: "Collaborative Activities",
    description: "Document joint programs, collaborations, and associated outputs.",
    dbCategoryName: "Collaborative Activities",
    fields: [
      { id: "collaborator", label: "Collaborator", type: "text", required: true },
      { id: "activity_date", label: "Activity Date", type: "date", required: true },
      { id: "activity_type", label: "Activity Type", type: "text", required: true },
      { id: "outcome", label: "Outcome", type: "textarea", required: true }
    ]
  },
  {
    slug: "best-practice",
    label: "Best Practice",
    description: "Store proven departmental practices and evidence of impact.",
    dbCategoryName: "Best Practice",
    fields: [
      { id: "practice_title", label: "Practice Title", type: "text", required: true },
      { id: "beneficiaries", label: "Beneficiaries", type: "text", required: true },
      { id: "implementation_date", label: "Implementation Date", type: "date" },
      { id: "impact", label: "Impact", type: "textarea", required: true }
    ]
  },
  {
    slug: "value-added-courses",
    label: "Value-added Courses",
    description: "Register short courses, credits, and learner participation.",
    dbCategoryName: "Value-added Courses",
    fields: [
      { id: "course_name", label: "Course Name", type: "text", required: true },
      { id: "duration_hours", label: "Duration (Hours)", type: "number", required: true },
      { id: "provider", label: "Provider", type: "text", required: true },
      { id: "students_enrolled", label: "Students Enrolled", type: "number", required: true }
    ]
  },
  {
    slug: "skill-enhancement",
    label: "Skill Enhancement",
    description: "Track workshops and initiatives focused on employability and skills.",
    dbCategoryName: "Skill Enhancement",
    fields: [
      { id: "initiative_name", label: "Initiative Name", type: "text", required: true },
      { id: "skill_focus", label: "Skill Focus", type: "text", required: true },
      { id: "delivery_date", label: "Delivery Date", type: "date", required: true },
      { id: "participants", label: "Participants", type: "number", required: true }
    ]
  },
  {
    slug: "infrastructure-facilities",
    label: "Infrastructure Facilities",
    description: "Capture facility enhancements, availability, and utilization evidence.",
    dbCategoryName: "Infrastructure Facilities",
    fields: [
      { id: "facility_name", label: "Facility Name", type: "text", required: true },
      { id: "upgrade_date", label: "Upgrade Date", type: "date" },
      { id: "capacity", label: "Capacity / Quantity", type: "text" },
      { id: "purpose", label: "Purpose", type: "textarea", required: true }
    ]
  },
  {
    slug: "feedback-report",
    label: "Feedback Report",
    description: "Record feedback cycles, respondents, and key actions taken.",
    dbCategoryName: "Feedback Report",
    fields: [
      { id: "feedback_cycle", label: "Feedback Cycle", type: "text", required: true },
      { id: "respondent_group", label: "Respondent Group", type: "text", required: true },
      { id: "response_count", label: "Responses", type: "number", required: true },
      { id: "action_taken", label: "Action Taken", type: "textarea", required: true }
    ]
  },
  {
    slug: "outreach-programs",
    label: "Outreach Programs",
    description: "Store extension and community engagement program records.",
    dbCategoryName: "Outreach Programs",
    fields: [
      { id: "program_title", label: "Program Title", type: "text", required: true },
      { id: "community_partner", label: "Community Partner", type: "text", required: true },
      { id: "program_date", label: "Program Date", type: "date", required: true },
      { id: "beneficiary_count", label: "Beneficiary Count", type: "number", required: true }
    ]
  },
  {
    slug: "industrial-visits-internships",
    label: "Industrial Visits / Internships",
    description: "Track experiential learning visits and internships.",
    dbCategoryName: "Industrial Visits / Internships",
    fields: [
      { id: "organization_name", label: "Organization Name", type: "text", required: true },
      { id: "visit_date", label: "Visit / Internship Date", type: "date", required: true },
      { id: "duration", label: "Duration", type: "text", required: true },
      { id: "student_count", label: "Student Count", type: "number", required: true }
    ]
  },
  {
    slug: "grievance-report",
    label: "Grievance Report",
    description: "Capture grievance cases, timelines, and resolution status.",
    dbCategoryName: "Grievance Report",
    fields: [
      { id: "grievance_type", label: "Grievance Type", type: "text", required: true },
      { id: "reported_on", label: "Reported On", type: "date", required: true },
      { id: "cases_count", label: "Cases Count", type: "number", required: true },
      { id: "resolution_summary", label: "Resolution Summary", type: "textarea", required: true }
    ]
  },
  {
    slug: "eminent-visitors",
    label: "Eminent Visitors",
    description: "Maintain talks and visits by experts, alumni, and industry leaders.",
    dbCategoryName: "Eminent Visitors",
    fields: [
      { id: "visitor_name", label: "Visitor Name", type: "text", required: true },
      { id: "designation", label: "Designation", type: "text", required: true },
      { id: "visit_date", label: "Visit Date", type: "date", required: true },
      { id: "topic", label: "Topic / Engagement", type: "textarea", required: true }
    ]
  },
  {
    slug: "consultancy-finance",
    label: "Consultancy Finance",
    description: "Track consultancy engagements and financial inflow.",
    dbCategoryName: "Consultancy Finance",
    fields: [
      { id: "client_name", label: "Client Name", type: "text", required: true },
      { id: "consultancy_value", label: "Consultancy Value", type: "number", required: true },
      { id: "engagement_date", label: "Engagement Date", type: "date", required: true },
      { id: "deliverables", label: "Deliverables", type: "textarea", required: true }
    ]
  },
  {
    slug: "career-counselling",
    label: "Career Counselling",
    description: "Store counselling sessions, speakers, and student reach.",
    dbCategoryName: "Career Counselling",
    fields: [
      { id: "session_title", label: "Session Title", type: "text", required: true },
      { id: "speaker", label: "Speaker", type: "text", required: true },
      { id: "session_date", label: "Session Date", type: "date", required: true },
      { id: "student_reach", label: "Student Reach", type: "number", required: true }
    ]
  },
  {
    slug: "activities-conducted",
    label: "Activities Conducted",
    description: "Capture regular departmental activities and participation data.",
    dbCategoryName: "Activities Conducted",
    fields: [
      { id: "activity_name", label: "Activity Name", type: "text", required: true },
      { id: "activity_date", label: "Activity Date", type: "date", required: true },
      { id: "coordinator", label: "Coordinator", type: "text", required: true },
      { id: "participants", label: "Participants", type: "number", required: true }
    ]
  }
];

const researchDetailsCategories: CategoryConfig[] = [
  {
    slug: "research-patents",
    label: "Research Patents",
    description: "Track filed and granted patents with ownership and status details.",
    dbCategoryName: "Research Patents",
    fields: [
      { id: "patent_title", label: "Patent Title", type: "text", required: true },
      { id: "inventors", label: "Inventor(s)", type: "text", required: true },
      { id: "patent_status", label: "Status", type: "text", required: true },
      { id: "application_date", label: "Application Date", type: "date" }
    ]
  },
  {
    slug: "research-books",
    label: "Research Books",
    description: "Capture authored books, publishers, and ISBN information.",
    dbCategoryName: "Research Books",
    fields: [
      { id: "book_title", label: "Book Title", type: "text", required: true },
      { id: "authors", label: "Author(s)", type: "text", required: true },
      { id: "publisher", label: "Publisher", type: "text", required: true },
      { id: "isbn", label: "ISBN", type: "text" }
    ]
  },
  {
    slug: "research-guidance",
    label: "Research Guidance",
    description: "Maintain guidance records for scholars, topics, and completion stage.",
    dbCategoryName: "Research Guidance",
    fields: [
      { id: "scholar_name", label: "Scholar Name", type: "text", required: true },
      { id: "research_topic", label: "Research Topic", type: "textarea", required: true },
      { id: "guidance_level", label: "Guidance Level", type: "text", required: true },
      { id: "progress_status", label: "Progress Status", type: "text", required: true }
    ]
  },
  {
    slug: "research-projects",
    label: "Research Projects",
    description: "Track funded and internal research projects, budgets, and timelines.",
    dbCategoryName: "Research Projects",
    fields: [
      { id: "project_title", label: "Project Title", type: "text", required: true },
      { id: "funding_agency", label: "Funding Agency", type: "text", required: true },
      { id: "sanctioned_amount", label: "Sanctioned Amount", type: "number", required: true },
      { id: "project_duration", label: "Project Duration", type: "text", required: true }
    ]
  },
  {
    slug: "research-publications",
    label: "Research Publications",
    description: "Store publication metadata including journal, indexing, and publication year.",
    dbCategoryName: "Research Publications",
    fields: [
      { id: "publication_title", label: "Publication Title", type: "text", required: true },
      { id: "authors", label: "Author(s)", type: "text", required: true },
      { id: "journal_name", label: "Journal / Conference", type: "text", required: true },
      { id: "publication_year", label: "Publication Year", type: "number", required: true }
    ]
  }
];

export const formSections: FormSectionConfig[] = [
  {
    id: "departmental-input",
    label: "Departmental Input",
    description: "Department submissions, evidence records, and operational documentation.",
    categories: departmentalInputCategories
  },
  {
    id: "research-details",
    label: "Research Details",
    description: "Research-focused records that can grow into a larger module over time.",
    categories: researchDetailsCategories
  }
];

export const categoryConfigs: CategoryConfig[] = formSections.flatMap((section) => section.categories);

export const categoryConfigMap = Object.fromEntries(
  categoryConfigs.map((config) => [config.slug, config])
);

export const categorySectionMap = Object.fromEntries(
  formSections.flatMap((section) => section.categories.map((category) => [category.slug, section]))
);

export const formSectionMap = Object.fromEntries(formSections.map((section) => [section.id, section]));
