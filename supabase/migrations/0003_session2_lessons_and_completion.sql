-- Session 2: lessons (with Lesson 1 full content), task 8 rewire,
-- worksheet completion table, and WS1 field-schema registry.

-- ----- worksheet completion (one row per planter+worksheet) -----
create table if not exists public.worksheet_completion (
  id uuid primary key default gen_random_uuid(),
  planter_id uuid not null references public.profile(id) on delete cascade,
  worksheet_id uuid not null references public.worksheet(id) on delete cascade,
  completed_at timestamptz,
  unique (planter_id, worksheet_id)
);

alter table public.worksheet_completion enable row level security;

drop policy if exists worksheet_completion_self on public.worksheet_completion;
create policy worksheet_completion_self on public.worksheet_completion
  for all using (planter_id = auth.uid()) with check (planter_id = auth.uid());

-- ----- seed Module 0 lessons -----
-- Only Lesson 1 carries full body text in Session 2.
-- Others land with hook + scripture stub so the reader has structure.
with m as (
  select id from public.module
    where number = '0'
      and track_id = (select id from public.track where slug = 'church-planting')
)
insert into public.lesson (module_id, number, title, estimated_minutes, is_anchor, hook, teaching, display_order)
select m.id, l.n, l.title, l.minutes, l.anchor, l.hook, l.teaching, l.n
from m, (values
  (1,
   'Why Churches Must Be Birthed in Prayer',
   12,
   true,
   'You can build a church without prayer. Thousands of people have done it. The question is not whether you can build without it — the question is what you will have when you are done.',
$$There is a difference between a church that was built and a church that was birthed. A built church is the product of strategy, execution, and human effort applied in the right direction. It can be impressive. It can be growing. It can have all the markers of success by any measurable standard. But it carries, at its core, the DNA of what produced it — which is human will.

A birthed church is different. It comes out of something. It comes out of travail, intercession, fasting, encounter. It comes out of a planter who refused to move until heaven moved first. It carries within it a spiritual weight that strategy alone cannot produce — and that weight is what sustains it when strategy runs out.

The apostle Paul described it plainly in Galatians 4:19 when he wrote to a church he had planted: "My little children, of whom I travail in birth again until Christ be formed in you." Paul understood that church planting was not primarily a logistical enterprise. It was a spiritual one. It required the same language as childbirth — travail, labor, formation.

> A child who is not carried to term is a tragedy, not a strategy failure. And a church that is launched before it is ready will struggle with a fragility that no system can fix.

The first church did not launch with a marketing campaign. It launched after ten days of tarrying in an upper room. One hundred and twenty people, locked together in prayer, waiting for something only God could give. And when it came — when the sound of a rushing wind filled the house and tongues of fire rested on every head — three thousand people were added in a single day. Not because of a strategy. Because of a visitation.

That is not to say that strategy has no place. It does. But strategy serves what the Spirit produces. Strategy is the wineskin. Prayer is the wine. And you cannot put new wine in an old wineskin — or in no wineskin at all.

Before you build your leadership team, before you draft your budget, before you design your logo or launch your website — before any of that — this module asks you to build an altar. To get on your face before God and ask Him to birth through you what only He can build. To pray until something breaks open. To fast until your flesh stops arguing. To tarry until the word of the Lord becomes clear.

This is not a preliminary step. It is the most important step in the entire planting process. Everything else in Sent is built on what happens here.$$
  ),
  (2, 'Fasting, Prophetic Confirmation & Discerning Your Mandate', 22, false,
   'Heaviest lesson-to-task ratio in the module. UI suggests a built-in pause before advancing.',
   null),
  (3, 'Preparing for Backlash, Warfare & Resistance', 14, false,
   'Resistance is a confirmation, not a contradiction.',
   null),
  (4, 'Apostolic Covering: What It Is and Why It Cannot Be Skipped', 22, false,
   'Reading this lesson unlocks Task 02 — Secure apostolic or spiritual covering, the most significant milestone in Module 0.',
   null),
  (5, 'Prayer Altars, Intercessory Teams & Spiritual Covering', 18, false,
   'Before you build a launch team, build a prayer team.',
   null),
  (6, 'Prophetic City Mapping: Discerning the Spiritual Climate', 16, false,
   'Deepens WS4 · shared frame with Lesson 3.',
   null),
  (7, 'The Household Covenant: Aligning Your Home Before You Build', 18, false,
   'Unlocks Task 07. The covenant is a milestone, not a form.',
   null)
) as l(n, title, minutes, anchor, hook, teaching)
on conflict (module_id, number) do nothing;

-- ----- rewire task 8 to be the anchor-lesson study task -----
update public.task t
  set title = 'Study: Why Churches Must Be Birthed in Prayer',
      kind  = 'lesson',
      lesson_id = (
        select l.id from public.lesson l
          join public.module m on m.id = l.module_id
         where m.number = '0' and l.number = 1
      )
  where t.number = 8
    and t.module_id = (
      select id from public.module
        where number = '0'
          and track_id = (select id from public.track where slug = 'church-planting')
    );

-- ----- WS1 field registry (used for type-aware UI + validation) -----
-- Persisted as a curriculum reference table so the worksheet renderer
-- doesn't need code changes when WS2–WS7 are added in Session 2.5+.
create table if not exists public.worksheet_field (
  id uuid primary key default gen_random_uuid(),
  worksheet_id uuid not null references public.worksheet(id) on delete cascade,
  section_number integer not null,
  section_title text not null,
  question_number integer not null,
  field_key text not null,
  prompt text not null,
  helper text,
  kind text not null,                        -- 'longtext' | 'shorttext' | 'radio' | 'date' | 'blocks' | 'partners'
  options jsonb,                              -- for radio: array of {value,label}
  max_chars integer,
  feeds_ai boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (worksheet_id, field_key)
);

alter table public.worksheet_field enable row level security;

drop policy if exists worksheet_field_read on public.worksheet_field;
create policy worksheet_field_read on public.worksheet_field
  for select using (auth.role() = 'authenticated');

with w as (
  select id from public.worksheet where code = 'WS1'
    and module_id = (
      select id from public.module
        where number = '0'
          and track_id = (select id from public.track where slug = 'church-planting')
    )
)
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, f.opts::jsonb, f.max_c, f.ai, f.ord
from w, (values
  (1, 'The Mandate',          1, 'mandate.statement',
   'Write your assignment in two sentences.',
   'Habakkuk 2:2 — make it plain enough that someone else could run on it.',
   'longtext', null, 400, true, 1),

  (2, 'Fasting Rhythm',       2, 'fasting.kind',
   'What kind of fast will you keep?',
   null,
   'radio',
   '[{"value":"sunup_sundown","label":"Sunup → Sundown"},{"value":"daniel","label":"Daniel"},{"value":"liquid","label":"Liquid"},{"value":"absolute","label":"Absolute"},{"value":"partial","label":"Partial"},{"value":"other","label":"Other"}]',
   null, true, 2),

  (2, 'Fasting Rhythm',       3, 'fasting.frequency',
   'How often?',
   null,
   'radio',
   '[{"value":"daily","label":"Daily"},{"value":"weekly","label":"Weekly"},{"value":"monthly","label":"Monthly"},{"value":"quarterly","label":"Quarterly"},{"value":"forty_day","label":"40-Day"},{"value":"custom","label":"Custom"}]',
   null, true, 3),

  (2, 'Fasting Rhythm',       4, 'fasting.reason',
   'What are you fasting for? Be specific.',
   'Not just spiritual generalities. Name the people, the breakthroughs, the city, the assignment.',
   'longtext', null, 500, true, 4),

  (2, 'Fasting Rhythm',       5, 'fasting.first_scheduled',
   'When is your first scheduled fast?',
   null,
   'date', null, null, true, 5),

  (3, 'Devotional Structure', 6, 'devotional.blocks',
   'Write the hours, not the intention.',
   'A daily rhythm only counts if it is on the calendar. Place, posture, and length.',
   'blocks', null, null, true, 6),

  (4, 'Tarrying Practice',    7, 'tarrying.rhythm',
   'What extended seasons of prayer or fasting will you keep?',
   'Beyond daily. The monthly day apart, the quarterly 3-day fast, the annual 40-day.',
   'longtext', null, 500, true, 7),

  (5, 'Accountability Partners', 8, 'accountability.partners',
   'Who is holding this with you?',
   'At least one person. Two if one is your spouse. They will know the plan and have permission to call you on it.',
   'partners', null, null, true, 8)
) as f(s, st, q, k, p, h, kind, opts, max_c, ai, ord)
on conflict (worksheet_id, field_key) do nothing;
