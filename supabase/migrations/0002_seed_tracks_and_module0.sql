-- Seed: 8 tracks (Church Planting active; 7 coming soon) and Module 0 structure.

insert into public.track (slug, name, subtitle, description, category, status, module_count, duration_label, display_order)
values
  ('church-planting',   'Church Planting',     'From calling to launch to a multiplying church.',
     'The foundation track — the only active formation path for V1.', 'foundation', 'active', 11, '18 months', 1),
  ('licensed-minister', 'Licensed Minister',   'Preparation for licensing and ordination through our network.',
     null, 'foundation', 'coming_soon', 0, null, 2),
  ('marketplace',       'Marketplace Ministry','Apostolic formation for Kingdom influence in business, culture, and society.',
     null, 'foundation', 'coming_soon', 0, null, 3),
  ('apostle',           'Apostle',             'Building, sending, and governing with apostolic grace and authority.',
     null, 'five_fold', 'coming_soon', 0, null, 4),
  ('prophet',           'Prophet',             'Character, protocol, and the stewardship of a prophetic mandate.',
     null, 'five_fold', 'coming_soon', 0, null, 5),
  ('evangelist',        'Evangelist',          'Equipping for itinerant, crusade, and mass evangelism ministry.',
     null, 'five_fold', 'coming_soon', 0, null, 6),
  ('pastor',            'Pastor',              'Shepherding people with wisdom, care, and long-term faithfulness.',
     null, 'five_fold', 'coming_soon', 0, null, 7),
  ('teacher',           'Teacher',             'Forming disciples through sound doctrine and the ministry of the Word.',
     null, 'five_fold', 'coming_soon', 0, null, 8)
on conflict (slug) do nothing;

-- Module 0 — Before the Blueprint (anchors the Church Planting track)
with t as (select id from public.track where slug = 'church-planting')
insert into public.module (track_id, number, name, subtitle, anchor_scripture_ref, anchor_scripture_text, primary_objective, display_order)
select t.id, '0', 'Before the Blueprint',
       'The Spiritual Foundation Before the Strategy',
       'Jeremiah 1:10',
       'See, I have this day set you over nations and kingdoms, to root out and to pull down, to destroy and to throw down, to build and to plant.',
       'Pray, fast, establish covering, intercede, and spiritually map the territory before any planning begins.',
       0
from t
on conflict (track_id, number) do nothing;

-- Module 0 tasks (13 core + 1 checkpoint = 14 total, per dossier)
with m as (select id from public.module where number = '0'
             and track_id = (select id from public.track where slug='church-planting'))
insert into public.task (module_id, number, title, kind, planter_only, coach_involved, display_order)
select m.id, t.n, t.title, t.kind::task_kind, t.planter_only, t.coach_involved, t.n
from m, (values
  (1,  'Complete a personal consecration plan (fasting, devotional rhythm, tarrying)', 'spiritual_practice', true, false),
  (2,  'Secure apostolic or spiritual covering — identify your father/mother in the faith', 'milestone', true, false),
  (3,  'Document prophetic confirmations — words, dreams, scriptures, recurring themes', 'journal_record', true, false),
  (4,  'Practice prophetic listening and attunement to the Spirit', 'spiritual_practice', true, false),
  (5,  'Conduct spiritual mapping of your region (prayer walks, discernment research)', 'action', false, false),
  (6,  'Identify spiritual strongholds and resistance patterns in your target area', 'discernment', false, false),
  (7,  'Establish a household/family covenant about the assignment', 'milestone', true, false),
  (8,  'Read this Prayer Team overview (embedded lesson)', 'lesson', true, false),
  (9,  'Craft an Intercessory Prayer Cover Strategy', 'planning', false, false),
  (10, 'Brainstorm and identify Prayer Team partners (Gatekeepers)', 'action', false, false),
  (11, 'Determine Prayer Team communication methods and rhythm', 'planning', false, false),
  (12, 'Recruit and activate Prayer Team partners', 'action', false, false),
  (13, 'Initiate regular Prayer Team updates', 'ongoing', false, false),
  (14, 'Coaching Checkpoint: Covering confirmed, prayer foundation active', 'checkpoint', true, false)
) as t(n, title, kind, planter_only, coach_involved)
on conflict (module_id, number) do nothing;

-- Module 0 worksheets — WS6 Household Covenant is permanently AI-excluded.
with m as (select id from public.module where number='0'
             and track_id = (select id from public.track where slug='church-planting'))
insert into public.worksheet (module_id, code, title, purpose, visibility, ai_excluded, is_locking, display_order)
select m.id, w.code, w.title, w.purpose, w.visibility::worksheet_visibility, w.ai_excluded, w.is_locking, w.ord
from m, (values
  ('WS1', 'Personal Consecration Plan',
    'Guides planter through designing fasting and devotional rhythm.',
    'private', false, true, 1),
  ('WS2', 'Prophetic Confirmation Journal',
    'In-app record of words, dreams, scriptures, and confirmations.',
    'private', false, false, 2),
  ('WS3', 'Prophetic Listening & Attunement Guide',
    'Framework for practicing stillness and Spirit-attunement.',
    'private', false, false, 3),
  ('WS4', 'Spiritual Mapping Guide & Worksheet',
    'Framework for prayer walking and regional discernment.',
    'planter_and_team', false, false, 4),
  ('WS5', 'Intercessory Prayer Cover Strategy Template',
    'Structure for building and communicating with a prayer team.',
    'planter_and_team', false, false, 5),
  ('WS6', 'Household Covenant Template',
    'Guides planter and household through shared commitment to the assignment.',
    'household', true,  true, 6),
  ('WS7', 'Coaching Checkpoint',
    'Module-completion self-reflection. Locked until tasks 1–13 complete.',
    'private', true,  true, 7)
) as w(code, title, purpose, visibility, ai_excluded, is_locking, ord)
on conflict (module_id, code) do nothing;
