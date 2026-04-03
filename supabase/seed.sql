insert into public.departments (name)
values
  ('Computer Science'),
  ('Information Technology'),
  ('Management Studies'),
  ('Allied Health Sciences')
on conflict (name) do nothing;

insert into public.academic_years (year)
values
  ('2023-2024'),
  ('2024-2025'),
  ('2025-2026')
on conflict (year) do nothing;

insert into public.categories (name)
values
  ('Training Programs'),
  ('Functional MoU'),
  ('Mentor Details'),
  ('Collaborative Activities'),
  ('Best Practice'),
  ('Value-added Courses'),
  ('Skill Enhancement'),
  ('Infrastructure Facilities'),
  ('Feedback Report'),
  ('Outreach Programs'),
  ('Industrial Visits / Internships'),
  ('Grievance Report'),
  ('Eminent Visitors'),
  ('Consultancy Finance'),
  ('Career Counselling'),
  ('Activities Conducted'),
  ('Research Patents'),
  ('Research Books'),
  ('Research Guidance'),
  ('Research Projects'),
  ('Research Publications')
on conflict (name) do nothing;
