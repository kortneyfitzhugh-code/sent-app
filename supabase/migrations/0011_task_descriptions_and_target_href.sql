-- Each task gets a target URL the planter is sent to when they tap the
-- card on /tasks. Nullable so future modules can leave it null until the
-- destination ships.
alter table public.task
  add column if not exists target_href text;

-- Populate descriptions + target_href for every Module 0 task.
update public.task as t
   set description = u.description,
       target_href = u.target_href
  from (values
    ( 1, $$Design your fasting rhythm, daily devotional structure, and tarrying practice. This is the foundation that will hold you through the assignment.$$, '/worksheets/ws1'),
    ( 2, $$Identify your apostolic or spiritual covering — your father or mother in the faith. This is the most significant milestone in Module 0.$$, '/modules/0/lessons/4'),
    ( 3, $$Document every prophetic word, dream, scripture, and recurring theme that confirms this assignment. This is your evidence.$$, '/journal'),
    ( 4, $$Practice prophetic listening — intentional stillness before God to develop clarity in hearing His voice.$$, '/modules/0/lessons/2'),
    ( 5, $$Conduct prayer walks and research the spiritual history, demographics, and church landscape of your target region.$$, '/modules/0/lessons/3'),
    ( 6, $$Identify the spiritual strongholds and patterns of resistance you will encounter in your target area.$$, '/worksheets/ws4'),
    ( 7, $$Have the household covenant conversation with your spouse or household. Complete Worksheet 6 together.$$, '/worksheets/ws6'),
    ( 8, $$Read the anchor lesson: Why Churches Must Be Birthed in Prayer. Reading this lesson completes this task.$$, '/modules/0/lessons/1'),
    ( 9, $$Draft your full Intercessory Prayer Cover Strategy using Worksheet 5.$$, '/worksheets/ws5'),
    (10, $$Identify the specific people you will ask to serve as prayer gatekeepers for this assignment.$$, '/worksheets/ws5'),
    (11, $$Determine how you will communicate with your prayer team — frequency, method, and what you will share.$$, '/worksheets/ws5'),
    (12, $$Have personal conversations with each intercessor and formally recruit them to cover this assignment.$$, '/worksheets/ws5'),
    (13, $$Begin sending regular updates to your prayer team. This is an ongoing task with no single completion date.$$, '/worksheets/ws5'),
    (14, $$Complete the Coaching Checkpoint (Worksheet 7). This task is hard-gated until all other tasks are marked complete or skipped.$$, '/worksheets/ws7')
  ) as u(number, description, target_href)
 where t.number = u.number
   and t.module_id = (
     select id from public.module
       where number = '0'
         and track_id = (select id from public.track where slug = 'church-planting')
   );
