-- Session 2.5 content revision — canonical lessons + worksheets
-- Source: Sent_Module0_Lessons_Revised.docx, Sent_Module0_Worksheets_Revised.docx
-- Preserves schema, AI flags, and locking rules. Replaces content only.

-- Lesson 1: Why Churches Must Be Birthed in Prayer
update public.lesson
set title = $sent$Why Churches Must Be Birthed in Prayer$sent$,
    hook  = $sent$You can build a church without prayer. Thousands of people have done it. The question is not whether you can build without it — the question is what you will have when you are done.$sent$,
    teaching = $sent$There is a difference between a church that was built and a church that was birthed. A built church is the product of strategy, execution, and human effort applied in the right direction. It can be impressive. It can be growing. It can have all the markers of success by any measurable standard. But it carries, at its core, the DNA of what produced it — which is human will.
A birthed church is different. It comes out of something. It comes out of travail, intercession, fasting, encounter. It comes out of a planter who refused to move until heaven moved first. It carries within it a spiritual weight that strategy alone cannot produce — and that weight is what sustains it when strategy runs out.
The apostle Paul described it plainly in Galatians 4:19 when he wrote to a church he had planted: "My little children, of whom I travail in birth again until Christ be formed in you." Paul understood that church planting was not primarily a logistical enterprise. It was a spiritual one. It required the same language as childbirth — travail, labor, formation.
This is not romantic language. It is biological language. A child who is not carried to term is a tragedy, not a strategy failure. And a church that is launched before it is ready — before it has been carried in prayer, soaked in intercession, and confirmed by God — will struggle with a fragility that no system can fix.
The first church did not launch with a marketing campaign. It launched after ten days of tarrying in an upper room. One hundred and twenty people, locked together in prayer, waiting for something only God could give. And when it came — when the sound of a rushing wind filled the house and tongues of fire rested on every head — three thousand people were added in a single day. Not because of a strategy. Because of a visitation.
That is not to say that strategy has no place. It does. But strategy serves what the Spirit produces. Strategy is the wineskin. Prayer is the wine. And a wineskin is never the point.
Before you build your leadership team, before you draft your budget, before you design your logo or launch your website — before any of that — this module asks you to build an altar. To get on your face before God and ask Him to birth through you what only He can build. To pray until something breaks open. To fast until your flesh stops arguing. To tarry until the word of the Lord becomes clear.
This is not a preliminary step. It is the most important step in the entire planting process.

## Key Scriptures

### Jeremiah 1:10
> "See, I have this day set you over nations and kingdoms, to root out and to pull down, to destroy and to throw down, to build and to plant."

Notice the order: root out, pull down, destroy, throw down — before build and plant. The spiritual clearing work precedes the visible building work. Prayer is how that clearing happens.

### Acts 2:1–4
> "When the day of Pentecost came, they were all together in one place. Suddenly a sound like the blowing of a violent wind came from heaven and filled the whole house where they were sitting."

The first church was not launched. It was visited. Ten days of united prayer preceded what God did in a single day. The pattern is intentional.

### Psalm 127:1
> "Unless the Lord builds the house, the builders labor in vain. Unless the Lord watches over the city, the guards stand watch in vain."

This is not a discouragement to build. It is a command about who leads the building. If the Lord is not the builder, the planter's labor produces something — but not a house.

## Reflection Questions

1. When you imagine the church you are planting, what is the first thing you picture? Is it a vision of people, a service, a building — or a spiritual reality? What does that tell you about where your faith is resting?

2. What have you already started building for this church — in your mind, in your plans, in your conversations — before completing this module? What does that tell you about where you actually are spiritually right now?

3. What does it mean practically for you to "travail in birth" for this church? What would that look like in your daily life over the next six to twelve months?

4. Who are the people in your life who have prayed for you? Have you told them what you are building? What is keeping you from asking them to cover you?

## Activation

Before you move to the next task, do this: Set aside one uninterrupted hour this week — not a devotional, not a Bible reading, just prayer. Bring nothing to say. Arrive with only one question: God, what are You building here? Write down everything that comes.$sent$
where number = 1
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Lesson 2: Fasting, Prophetic Confirmation & Discerning Your Mandate
update public.lesson
set title = $sent$Fasting, Prophetic Confirmation & Discerning Your Mandate$sent$,
    hook  = $sent$A calling without confirmation is just ambition with religious language. The question is not whether you feel called — it is whether heaven has confirmed what you feel.$sent$,
    teaching = $sent$Fasting does not earn God's attention. He is already attentive. What fasting does is quiet the noise — the anxiety, the ambition, the fear, the flesh — so that what God has already been saying becomes audible. It is less about getting God to speak and more about finally being still enough to hear.
For a church planter, fasting is not optional. The weight of what is being built — the souls, the leaders, the families, the community — requires a level of spiritual clarity that cannot be sustained on a casual devotional rhythm. Planters who launch without fasting often find themselves building on a foundation of good ideas rather than divine instruction. And good ideas, under pressure, crack.
Alongside fasting is the matter of prophetic confirmation. In the apostolic and prophetic tradition, a mandate is rarely given to one person alone. God speaks directly to the individual, yes — but He also speaks through the community. Through the words of fathers and mothers in the faith. Through the consistent pattern of scriptures that keep appearing across different seasons. Through dreams that will not let go. Through the quiet knowing that has followed you for years.
Prophetic confirmation is not about collecting enough evidence to feel safe. It is about recognizing the thread that God has been weaving through your life and naming it clearly enough to run on it. Habakkuk 2:2 says to "write the vision and make it plain" — not because writing it makes it more true, but because the act of writing it forces the kind of clarity that is required for sustained obedience.
When collecting prophetic confirmations, be honest about what you have and what you are still waiting for. Not every planter enters this process with a long history of prophetic words. Some planters begin with a single burning conviction and nothing else. That is enough to start. But it is not enough to stay. This is why the Prophetic Confirmation Journal is one of the first worksheets in this module — it creates a record you will return to again and again when the assignment gets hard.
The goal by the end of this module is not certainty. It is clarity — clear enough to move, honest enough to hold open hands, anchored enough not to be moved by opposition.

## Key Scriptures

### Isaiah 58:6
> "Is not this the kind of fasting I have chosen: to loose the chains of injustice and untie the cords of the yoke, to set the oppressed free and break every yoke?"

The fast God honors is not primarily about personal discipline — it is connected to the liberation of others. A planter who fasts for their city is fasting exactly the kind of fast this passage describes. The burden and the fast belong together.

### Habakkuk 2:2–3
> "Write the vision and make it plain on tablets, that he may run who reads it. For the vision is yet for an appointed time... it will not delay."

The vision must be written clearly enough that someone else could run on it. That is a test of clarity, not creativity. If the mandate cannot be written in plain language, it has not yet been fully received.

### Joel 2:28
> "And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions."

God speaks in multiple registers — prophetic words, dreams, visions. Part of discerning a mandate is learning to recognize which register God has been using with you specifically, and taking it seriously.

## Reflection Questions

1. Write down every prophetic word, dream, or significant scripture you believe speaks to this assignment. What patterns appear across them? What is consistent regardless of the source or the season?

2. When was the last time you fasted with specific intentionality about this assignment? What came out of it? If you have not, be honest about what is actually in the way.

3. What is the clearest, most concise version of the mandate you believe you have received? Write it in two sentences. If you cannot, what is still unclear — and what would it take to get there?

4. Is the bar you have set for "enough confirmation" a reasonable standard of faithfulness, or is it a way of staying safe? What is the difference between waiting on God and waiting on yourself?

## Activation

Begin a 3-day fast this week or schedule one within the next 30 days. During that fast, bring only one question: What is the specific assignment You have given me for this city and this people? Document what you sense, dream, or receive on each day. This content goes directly into your Prophetic Confirmation Journal.$sent$
where number = 2
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Lesson 3: Preparing for Backlash, Warfare & Resistance
update public.lesson
set title = $sent$Preparing for Backlash, Warfare & Resistance$sent$,
    hook  = $sent$The enemy does not primarily attack what you are doing. He attacks who you are while you are doing it.$sent$,
    teaching = $sent$Spiritual warfare in church planting is not primarily dramatic. It is rarely the overt manifestations that Hollywood imagines. More often it looks like a team member who betrays trust two months before launch. A personal accusation that surfaces at the worst possible moment. An inexplicable depression that settles in just as momentum is building. A marriage that starts to crack under the weight of the assignment. Financial systems that fail suddenly. Key relationships that go cold without explanation.
None of these are coincidences. They are the enemy's preferred strategy: not to stop the work outright, but to wear down the worker. Paul called it the "schemes of the devil" in Ephesians 6:11 — schemes, not attacks. Calculated. Patient. Aimed at the planter's most vulnerable points.
This is why spiritual preparation for warfare must happen before the warfare comes. A planter who discovers they have no prayer covering in the middle of a crisis is rebuilding the foundation during a storm. The time to build the foundation is before the storm.
Preparing for spiritual warfare involves three things. First, knowledge — understanding the spiritual history and climate of the region you are entering. Every city has a spiritual character, shaped by its history, its injustices, its dominant cultures, and the principalities that have operated over it. This is not superstition. It is discernment. Daniel understood the principalities over Persia (Daniel 10). Paul evaluated the spiritual climate of every city before he preached (Acts 17). The planter who has done their spiritual homework enters the city with eyes open.
Second, intercession — having people in place who are assigned specifically to pray for you, not just for the church. The planter's personal life is the first target. The prayer team that is most critical is not the one praying for the services. It is the one praying for the planter in the secret place.
Third, accountability — having people who can speak truth to you when warfare has clouded your judgment. Every planter will, at some point, consider quitting. Some will consider it multiple times. The covering relationship exists precisely for this moment: to hold the planter to what they said when they were clear, in the seasons when clarity is hard to find.
This lesson is meant to sober, not to frighten. The God who called you is greater than any principality. But He is not naive about what you will face — and neither should you be.

## Key Scriptures

### Ephesians 6:11–12
> "Put on the full armor of God, so that you can take your stand against the devil's schemes. For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world."

The armor is put on before the battle, not during it. The planter who waits until they are under attack to establish spiritual disciplines is already operating from deficit.

### Daniel 10:12–13
> "Since the first day that you set your mind to gain understanding and to humble yourself before your God, your words were heard... But the prince of the Persian kingdom resisted me twenty-one days."

Daniel's prayers were heard immediately — the answer was delayed by territorial resistance. Delayed breakthrough is not denied breakthrough. But it requires a planter who knows how to hold their ground.

### 2 Corinthians 10:4
> "The weapons we fight with are not the weapons of the world. On the contrary, they have divine power to demolish strongholds."

Strongholds are not demolished by strategy. They are demolished by spiritual weapons used with authority. The planter must know what they are carrying before they enter the territory.

## Reflection Questions

1. What do you know about the spiritual history of the region you are entering? Where has the church been strong? Where has it failed repeatedly? What patterns suggest something more than circumstance?

2. What are your specific personal vulnerabilities — in your character, your marriage, your finances, your emotions — where the enemy is most likely to focus? Name them without softening them.

3. Do you currently have people assigned to pray specifically for you as a person — not for the church, not for the ministry, but for you? If not, what has kept you from building that covering?

4. When you have been under sustained spiritual pressure in the past, what has held you? What failed? What does your history tell you about what you need to put in place before this season begins?

## Activation

Spend time this week in spiritual mapping research — not just prayer walks, but reading. Find out what you can about the spiritual history of your city or region. What movements were born there? What injustices have marked it? What churches have risen and fallen, and why? What has the enemy used repeatedly to stall the work of God in that place? Write your findings in the Spiritual Mapping Guide.$sent$
where number = 3
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Lesson 4: Apostolic Covering: What It Is and Why It Cannot Be Skipped
update public.lesson
set title = $sent$Apostolic Covering: What It Is and Why It Cannot Be Skipped$sent$,
    hook  = $sent$Independence in ministry is not strength. It is exposure. The planter who answers to no one will eventually answer to everyone — usually at the worst possible moment.$sent$,
    teaching = $sent$Apostolic covering is one of the most misunderstood concepts in the charismatic and prophetic tradition. It has been abused by controlling leaders who used it to demand blind loyalty. It has been dismissed by independent planters who mistook accountability for weakness. Neither extreme is healthy, and both have produced real damage.
At its core, apostolic covering is this: a relationship of genuine spiritual accountability with someone who has the maturity, authority, and investment to speak truth into the planter's life and assignment. It is not a hierarchy of control. It is a network of care.
The New Testament pattern is clear. Paul covered Timothy and Titus — he wrote to them, sent for them, corrected them, and released them. Barnabas covered Paul's early ministry until the Jerusalem church was willing to receive him. Even Jesus operated under covering — submitted to His Father, submitted to John's baptism, submitted to the authority structures of His day while simultaneously subverting their abuse.
For the planter, covering serves three essential functions. First, it provides protection. A church plant that is spiritually covered is harder to pick off. The enemy knows the difference between a planter who is connected and a planter who is isolated. Isolation is one of his primary tactics because isolated leaders make the worst decisions and have no one close enough to notice.
Second, covering provides correction. The planter's blind spots will eventually become the church's blind spots — and a covering relationship is designed to catch what the planter cannot see. This requires real humility: not the performance of humility that looks accountable in public and refuses counsel in private, but the kind that is willing to be told it is wrong by someone it trusts enough to believe it.
Third, covering provides commissioning. A planter who launches with the blessing and authority of their covering carries something into the assignment that cannot be manufactured. It is the difference between a soldier who went to war with orders and one who wandered onto the battlefield alone. The orders do not make the soldier braver. They make the mission legitimate.
Choosing covering wisely matters. The right relationship is one where the person knows you personally — not just your vision — and has the courage to say hard things. It should not be a peer who is equally uncertain. It should not be a celebrity pastor who has no actual access to your life. It should be someone who has walked with God longer than you have, built something that has lasted, and genuinely cares whether you survive this.

## Key Scriptures

### Proverbs 11:14
> "Where there is no guidance, a people falls, but in an abundance of counselors there is safety."

The word translated "guidance" here is the Hebrew word for navigation — the kind used by sailors. A planter without covering is not just unsupported. They are navigating without instruments in unfamiliar water.

### 1 Timothy 1:18
> "This charge I entrust to you, Timothy, my child, in accordance with the prophecies previously made about you, that by them you may wage the good warfare."

Paul's letter to Timothy is a covering document. It connects calling, prophetic history, and active warfare into a single commission. Covering is not passive endorsement — it is active engagement in the planter's mission.

### Ecclesiastes 4:9–10
> "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up."

The stakes of planting without covering are not merely strategic — they are personal. The planter who falls alone may not get back up. This is why the relationship must be in place before the fall, not established after it.

## Reflection Questions

1. Who is currently speaking into your life with genuine authority? Not people who affirm you — people who correct you. Is there a difference between those two groups in your life right now?

2. What is your honest pattern with accountability — do you seek it or manage it? What has that pattern produced in your ministry history?

3. What would the right covering relationship look like for your specific assignment, personality, and season? Be precise — not "a mentor" but what kind of person, with what history, in what relational structure?

4. Who do you know — or know of — who could fill that role? What is the actual reason you have not yet reached out?

## Activation

This week, write a one-page summary of what you are building and why, and send it to one person whose spiritual authority you respect. Not to ask anything yet — just to begin the conversation. The covering relationship starts with visibility. Let someone who matters see what you are carrying.$sent$
where number = 4
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Lesson 5: Prayer Altars, Intercessory Teams & Spiritual Covering
update public.lesson
set title = $sent$Prayer Altars, Intercessory Teams & Spiritual Covering$sent$,
    hook  = $sent$Moses held up his arms and Israel prevailed. When his arms got tired, Israel began to lose. The battle did not change. The covering did.$sent$,
    teaching = $sent$An intercessory prayer team is not a support group. It is a spiritual weapons system. It exists to do in the invisible realm what the planter is doing in the visible one — to hold open what the enemy is trying to close, to push back what is trying to advance, and to sustain the weight of an assignment that no single person was designed to carry alone.
The distinction between a prayer team and a support team matters. A support team encourages the planter. A prayer team covers the planter. Both are valuable, but they are not the same thing. The prayer team is not primarily interested in how the planter is feeling — they are assigned to the spiritual dimension of the work. They stand in the gap before the gap opens.
Building this team requires intentionality. Random enthusiastic supporters are not the same as tested intercessors. The people who belong on the prayer team are those who have a proven prayer life — not people who are willing to pray, but people for whom prayer is already their primary ministry. They are the ones who are up before dawn before anyone asks them to be. The ones who pray through things rather than around them. The ones who have a history of intercession that has actually produced results.
A prayer altar, in the apostolic tradition, is a consistent, designated place and time of prayer that is returned to regularly. It is not a one-time event. Moses did not hold his hands up once and claim victory — the battle required sustained posture. The prayer altar functions the same way: it is the planter's commitment to return, again and again, to the place of intercession for the assignment. Before services. Before major decisions. Before team meetings. After crises. Always.
Practically, the prayer team for a church plant should have several layers. Personal intercessors — three to five people assigned specifically to cover the planter as an individual. The broader prayer cover — a larger group that receives updates and prays over the church's general direction and specific needs. And eventually, the intercessory team within the launch team itself, which becomes the altar ministry infrastructure of the church.
Communication with the prayer team is the planter's responsibility. Intercessors cannot pray specifically for what they do not know. A rhythm of regular updates — not just requests, but reports of what God is doing — keeps the team engaged, aligned, and spiritually connected to the assignment.

## Key Scriptures

### Exodus 17:11–12
> "As long as Moses held up his hands, the Israelites were winning, but whenever he lowered his hands, the Amalekites were winning. When Moses' hands grew tired, they took a stone and put it under him and he sat on it. Aaron and Hur held his hands up — one on one side, one on the other."

The battle was not lost when Moses got tired. It was only lost if no one stepped in to hold him up. The planter's weakness is not disqualifying. The absence of people willing to hold them up is.

### 1 Thessalonians 5:17
> "Pray without ceasing."

This instruction is not primarily for the individual in isolation — it is for the community in concert. The church that prays without ceasing does so because different members are praying at different times. The intercessory team makes continuous prayer structurally possible.

### Ezekiel 22:30
> "I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so I would not have to destroy it, but I found no one."

The gap is always there. The question is whether anyone is standing in it. Recruiting intercessors is not an administrative task — it is answering God's perpetual search for those willing to stand in the gap for what He is building.

## Reflection Questions

1. Who in your current relationships carries the gift and discipline of intercession? Name them specifically, not as a category.

2. Have you ever had someone assigned to pray specifically for you as a person — not for your ministry, but for you? What was the difference when that covering was present versus when it was not?

3. What would you share with a prayer team, and what would you not share? Be honest about why — is the boundary wisdom or self-protection?

4. What is your personal prayer altar right now — the place and time you return to consistently? If it does not exist, what is the real reason, and what would it take to establish it before this module is complete?

## Activation

Before completing this module, identify at least three people you will personally ask to serve as intercessors for this assignment. Not a mass message — personal conversations. Explain the assignment, explain what you are asking, and give them the freedom to say no. Then begin praying for them, because the intercessors need covering too.$sent$
where number = 5
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Lesson 6: Prophetic City Mapping: Discerning the Spiritual Climate of Your Region
update public.lesson
set title = $sent$Prophetic City Mapping: Discerning the Spiritual Climate of Your Region$sent$,
    hook  = $sent$A soldier who walks into unknown territory without intelligence is not brave. He is unprepared. Spiritual mapping is intelligence work for the Kingdom.$sent$,
    teaching = $sent$Prophetic city mapping is the practice of researching, praying over, and discerning the spiritual history and current condition of the territory where a church will be planted. It combines natural research with spiritual discernment — demographics with prayer walks, historical data with prophetic impressions.
The goal is not to produce a comprehensive academic paper. The goal is to arrive in the territory as a sent one who already knows something about what they are walking into — the historical wounds, the dominant spiritual forces, the areas of particular brokenness, and the places where God has already been moving. That knowledge shapes strategy, shapes prayer, and shapes the kind of church that will be needed.
The natural research component includes the city's history — particularly histories of violence, injustice, displacement, or exploitation that have shaped its spiritual identity — alongside current demographics, economic trends, and the existing church presence. Which churches are thriving? Which are declining? What is conspicuously absent? What kind of congregation does this community not yet have?
The spiritual discernment component is less quantifiable but equally important. It includes prayer walks through specific neighborhoods — not to be seen, but to see. To notice what rises in the spirit when moving through different areas. To pay attention to what feels heavy, what feels open, what feels resistant. Experienced intercessors often report sensing strongholds geographically — specific areas where certain kinds of bondage seem concentrated. This is worth taking seriously.
It also includes a historical spiritual perspective: where has God moved in this region before? What revivals or renewals have touched this city? What became of them? Why did they stop? Understanding the spiritual history of a place gives the planter a sense of what they are building on, what they may be called to continue, and what they may be called to break.
This is not a one-time exercise. As the plant grows, the prophetic picture of the region will sharpen. But the initial mapping, done in Module 0, establishes a baseline — a first honest look at the territory that will shape how the planter prays and plans for years to come.

## Key Scriptures

### Numbers 13:17–20
> "When Moses sent them to explore Canaan, he said, 'Go up through the Negev and on into the hill country. See what the land is like and whether the people who live there are strong or weak, few or many.'"

The spies were sent before the army moved. Reconnaissance preceded the advance. The failure of that generation was not in the mapping — it was in their response to what they found. The planter must have the courage to see clearly and still move.

### Acts 17:16
> "While Paul was waiting for them in Athens, he was greatly distressed to see that the city was full of idols."

Paul read the spiritual climate of Athens before he preached in it. His observation shaped his entire approach — he referenced their altar to the Unknown God. The planter who knows their city will address it more precisely than the one who arrives with a generic message.

### Nehemiah 2:11–13
> "I went to Jerusalem, and after staying there three days I set out during the night with a few others. I had not told anyone what my God had put in my heart to do for Jerusalem. I went out...examining the walls of Jerusalem."

Nehemiah surveyed the damage before he announced the plan. He needed to know the full weight of what he was undertaking before he asked anyone else to carry it with him. The spiritual mapping is that survey.

## Reflection Questions

1. What do you already know about the spiritual history of your region? What do you still need to research before you can say you have done the work?

2. When you drive through or walk through your target area, what do you sense? What feels open? What feels resistant? Have you taken those impressions seriously or dismissed them?

3. What does the existing church presence tell you about what is working and what is missing? What kind of church does your community genuinely not yet have?

4. What historical injustices or spiritual wounds have shaped your city? How might those realities — if you ignore them — become fault lines under the church you build?

## Activation

This week, conduct your first prayer walk. Go to the area where you believe the church will be planted or where you will begin gathering people. Walk slowly. Pray quietly. Notice what you notice. When you return, write your impressions in the Spiritual Mapping Guide before they fade.$sent$
where number = 6
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Lesson 7: The Household Covenant: Aligning Your Home Before You Build for Others
update public.lesson
set title = $sent$The Household Covenant: Aligning Your Home Before You Build for Others$sent$,
    hook  = $sent$You cannot build a healthy house for the people of God while your own house is in disorder. Not because God will not use you — He is gracious — but because the cost will be borne by the people closest to you.$sent$,
    teaching = $sent$Church planting will test a marriage in ways that almost nothing else does. It will test single planters in different but equally demanding ways. It will affect children, parents, and extended family. It will reshape social life, financial stability, available time, and emotional bandwidth. None of this is a reason not to plant. But all of it is a reason to have the hard conversations before the season begins, not during it.
A household covenant is a shared agreement about what the planting season will require, what it will cost, and what each person in the household is committing to. It is not a contract. It is a conversation that ends in clarity. It covers practical realities — finances, schedules, family rhythms — as well as spiritual ones: what each person believes about this assignment, how they will support one another, and what boundaries they will protect.
For married planters, the spouse's relationship to the assignment is one of the most critical and most underexamined factors in a church plant's long-term survival. A spouse who is dragged into a church plant they never agreed to will, at some point, express their resentment — and ministry pressure has a way of concentrating that expression at the worst possible moment. The household covenant is the planter's commitment to bring the spouse into the assignment as a partner, not a passenger.
This does not mean the spouse must be equally called. Spouses often carry the assignment differently — some are co-leaders, some are supporters, some are primarily caretakers of the home and family while the planter carries the public weight of ministry. All of these are valid. What is not valid is leaving the spouse uninformed, unsupported, or surprised by what the season demands.
For single planters, the household conversation looks different but is no less necessary. It involves family members who may carry expectations, close friends whose relational access to the planter will change, and the planter's own internal household — the relationship between calling, limits, rhythms, and health. A single planter with no accountability around personal sustainability is as exposed as a married planter with an unsupported spouse.
The household covenant is completed before moving into Module 1. It does not need to be perfect. It needs to be honest. A household that has had the real conversation — however imperfect — is far more prepared for what is coming than one where the planter carried the assignment alone and hoped the family would eventually come along.

## Key Scriptures

### 1 Timothy 3:4–5
> "He must manage his own family well and see that his children obey him, and he must do so in a manner worthy of full respect. If anyone does not know how to manage his own family, how can he take care of God's church?"

Paul's standard for leadership is not perfection at home — it is faithfulness and order. The household that is honest, mutually accountable, and spiritually aligned is the foundation from which sustainable ministry grows.

### Joshua 24:15
> "But as for me and my household, we will serve the Lord."

Joshua's declaration was not made alone. It was the culmination of a leader who had brought his household to the place of collective decision. The covenant was not his private conviction imposed on others — it was a shared posture reached together. That is what the Household Covenant in Sent is meant to produce.

### Amos 3:3
> "Do two walk together unless they have agreed to do so?"

Agreement precedes movement. The planter who launches without household alignment is not walking with their family — they are walking ahead of them. The gap between a leader and their household is one of the most common places a church plant fractures.

## Reflection Questions

1. Have you had a fully honest conversation with your spouse, family, or household about what this planting season will actually require? What have you said clearly? What have you softened or left out?

2. What does your spouse or closest household member need from you during this season that you have not yet committed to providing? What is keeping you from making that commitment now?

3. What personal rhythms — rest, time with family, relationships outside ministry — will you protect during the launch season? Who will hold you to that, and have you asked them to?

4. If the church plant ends differently than you hope — if it fails, or if it costs more than you expected — will your household be okay? If the honest answer is uncertain, what needs to change before you move to Module 1?

## Activation

Schedule a specific conversation — not a casual mention, a scheduled conversation — with your spouse or, if single, your closest family member or accountability partner. Name the assignment clearly. Name what it will cost. Ask for their honest response. Do not rescue them from the weight of what you are asking. The Household Covenant Worksheet is designed to be completed together, not by the planter alone.$sent$
where number = 7
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug = 'church-planting')
  );

-- Keep task 8 title aligned to L1
update public.task t set title = 'Study: ' || (
  select l.title from public.lesson l
    join public.module m on m.id = l.module_id
   where m.number = '0' and l.number = 1
)
where t.number = 8
  and t.module_id = (
    select id from public.module where number = '0'
      and track_id = (select id from public.track where slug='church-planting')
  );

-- ============================================================================
-- Worksheets — replace WS1–WS7 content with canonical revised text.
-- Schema preserved (worksheet, worksheet_field tables unchanged).
-- AI flags preserved: WS6 + WS7 remain ai_excluded; the rest feed Ask Sent.
-- Locking preserved: WS1, WS6, WS7 remain is_locking.
-- ============================================================================

-- Update each worksheet's title and purpose
update public.worksheet set
  title   = 'Personal Consecration Plan',
  purpose = 'Designing your fasting, devotional, and prayer rhythm for the planting season. This is not a schedule you fill out once and forget. It is a living commitment that you return to each week. Complete it now as a first draft, then revisit it at the beginning of each month. The planter who has a written consecration plan is far more likely to maintain the practices than one who relies on intention alone.'
where code = 'WS1' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

update public.worksheet set
  title   = 'Prophetic Confirmation Journal',
  purpose = 'A permanent record of the words, dreams, and scriptures that confirm this assignment. The day will come when you want to quit. The call will feel distant. The cost will feel too high. This journal exists for that day. It is not a collection of encouraging thoughts — it is a legal record of what God said. Return to it when the enemy tells you that God never spoke.'
where code = 'WS2' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

update public.worksheet set
  title   = 'Prophetic Listening & Attunement Guide',
  purpose = 'Practices and reflections for developing your spiritual hearing. Prophetic listening is not a gift reserved for prophets. Every believer has the capacity to hear the voice of God. But like any capacity, it is developed through practice — through intentional stillness, honest attention, and the discipline of writing down what comes. This worksheet guides that practice.'
where code = 'WS3' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

update public.worksheet set
  title   = 'Spiritual Mapping Guide',
  purpose = 'Research, prayer walk observations, and discernment for your target region. Complete Part 1 at a desk before going on your prayer walks. The background knowledge you gather will sharpen your discernment in the field. Context matters — what you read before you walk changes what you notice when you walk.'
where code = 'WS4' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

update public.worksheet set
  title   = 'Intercessory Prayer Cover Strategy',
  purpose = 'Building, organizing, and sustaining your prayer team.'
where code = 'WS5' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

update public.worksheet set
  title   = 'Household Covenant',
  purpose = 'A shared agreement between the planter and their household about this assignment. This worksheet is not for the planter to fill out alone and present to their household. It is meant to be completed in conversation — ideally across two or three dedicated sittings, not in one rushed meeting. The process of filling it out together is as important as the document itself.'
where code = 'WS6' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

update public.worksheet set
  title   = 'Coaching Checkpoint',
  purpose = 'Module 0 completion reflection — covering, prayer foundation, and household alignment. In Sent V1, this checkpoint is a self-reflection document. Answer each question as honestly as you would if your coach were sitting across from you. In a future version of this platform, this document will be shared directly with your coach or mentor. Write accordingly.'
where code = 'WS7' and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

-- Drop existing worksheet_field rows (WS1's 8 fields seeded in 0003) and any
-- worksheet_response rows that reference them — there are no real users yet.
delete from public.worksheet_response
  where worksheet_id in (
    select id from public.worksheet
      where code in ('WS1','WS2','WS3','WS4','WS5','WS6','WS7')
        and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'))
  );
delete from public.worksheet_field
  where worksheet_id in (
    select id from public.worksheet
      where code in ('WS1','WS2','WS3','WS4','WS5','WS6','WS7')
        and module_id in (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'))
  );


-- Helper macro: pull a worksheet id by code (module 0, church-planting track)
-- We inline this via correlated subquery below.

-- ===== WS1 — Personal Consecration Plan (locking, feeds AI) =====
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, true, f.ord
from public.worksheet w, (values
  (1, 'Your Daily Prayer Structure', 1, 'daily_prayer.time',
    'Designated prayer time (time of day and duration)',
    'What does your daily time with God look like during the planting season? Be specific — not "I will pray more" but what, when, and where.',
    'shorttext', 200, 1),
  (1, 'Your Daily Prayer Structure', 2, 'daily_prayer.location',
    'Where you will pray (physical location or space)', null,
    'shorttext', 200, 2),
  (1, 'Your Daily Prayer Structure', 3, 'daily_prayer.contents',
    'What your daily prayer time will include',
    'Scripture, intercession, silence, journaling, etc.',
    'longtext', 600, 3),
  (2, 'Fasting Commitment', 4, 'fasting.type',
    'Type of fast',
    'Full fast, partial fast, Daniel fast, media fast, other.',
    'shorttext', 200, 4),
  (2, 'Fasting Commitment', 5, 'fasting.frequency',
    'Frequency',
    'Weekly, monthly, periodic — be specific.',
    'shorttext', 200, 5),
  (2, 'Fasting Commitment', 6, 'fasting.intent',
    'What you are specifically fasting for in this season',
    'Design your fasting rhythm for this season. What kind of fast? How often? What are you fasting for specifically?',
    'longtext', 600, 6),
  (2, 'Fasting Commitment', 7, 'fasting.first_scheduled',
    'Your first scheduled fast', null, 'date', null, 7),
  (3, 'Tarrying Practice', 8, 'tarrying.frequency',
    'How often will you practice extended tarrying (beyond your daily devotional time)?',
    'Tarrying — waiting in God''s presence without an agenda — is a discipline that requires practice. Many planters know the concept but have not built the habit. Design your tarrying rhythm here.',
    'longtext', 400, 8),
  (3, 'Tarrying Practice', 9, 'tarrying.practice',
    'What does tarrying look like for you practically — what do you do, how long, what have you experienced in it previously?',
    null, 'longtext', 600, 9),
  (4, 'Accountability', 10, 'accountability.partners',
    'Who knows about this consecration commitment and will ask you about it?',
    null, 'longtext', 400, 10),
  (4, 'Accountability', 11, 'accountability.tracking',
    'How will you track whether you are keeping it?',
    null, 'longtext', 400, 11)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS1'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

-- ===== WS2 — Prophetic Confirmation Journal (recurring, feeds AI) =====
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, true, f.ord
from public.worksheet w, (values
  (1, 'Entry 1', 1, 'entry1.date', 'Date', 'Use this structure for each entry. Complete as many entries as you have material for now, and continue adding throughout Modules 0 through 2.', 'date', null, 1),
  (1, 'Entry 1', 2, 'entry1.type', 'Type', 'Prophetic word / dream / scripture / impression / other.', 'shorttext', 100, 2),
  (1, 'Entry 1', 3, 'entry1.source', 'Source', 'Who spoke it, or the context in which it came.', 'shorttext', 200, 3),
  (1, 'Entry 1', 4, 'entry1.content', 'What was said or shown', 'As close to exact as possible.', 'longtext', 1500, 4),
  (1, 'Entry 1', 5, 'entry1.connection', 'How this connects to the assignment', null, 'longtext', 1000, 5),
  (2, 'Patterns & Themes', 6, 'patterns.repeated', 'What themes or phrases appear repeatedly across your confirmations?', 'After recording at least three entries, answer the following.', 'longtext', 800, 6),
  (2, 'Patterns & Themes', 7, 'patterns.resistance', 'What has God been consistent about that you have been resistant to?', null, 'longtext', 800, 7),
  (2, 'Patterns & Themes', 8, 'patterns.clarity', 'Your current clarity level (1 = very uncertain, 10 = absolutely clear)', null, 'shorttext', 4, 8)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS2'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

-- ===== WS3 — Prophetic Listening & Attunement Guide (feeds AI) =====
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, true, f.ord
from public.worksheet w, (values
  (1, 'Assessing Your Current Hearing', 1, 'assessment.modes',
    'How does God most often speak to you?',
    'Scripture that hits differently, impressions during prayer, dreams, circumstances, the counsel of others, etc.',
    'longtext', 800, 1),
  (1, 'Assessing Your Current Hearing', 2, 'assessment.last_clear',
    'When was the last time you clearly heard God speak something specific to you? What was it?',
    null, 'longtext', 800, 2),
  (1, 'Assessing Your Current Hearing', 3, 'assessment.obstacles',
    'What, if anything, makes it hard for you to hear God right now?',
    'Noise, busyness, fear, unresolved sin, grief, etc.',
    'longtext', 600, 3),
  (2, 'A 7-Day Listening Practice', 4, 'practice.day1', 'Day 1',
    'For seven consecutive days, spend at least 20 minutes in silence before God — no agenda, no list. Then write down what comes. Not what you want to hear. What you actually sensed, saw, felt, or received. Date each entry.',
    'longtext', 1000, 4),
  (2, 'A 7-Day Listening Practice', 5, 'practice.day2', 'Day 2', null, 'longtext', 1000, 5),
  (2, 'A 7-Day Listening Practice', 6, 'practice.day3', 'Day 3', null, 'longtext', 1000, 6),
  (2, 'A 7-Day Listening Practice', 7, 'practice.day4', 'Day 4', null, 'longtext', 1000, 7),
  (2, 'A 7-Day Listening Practice', 8, 'practice.day5', 'Day 5', null, 'longtext', 1000, 8),
  (2, 'A 7-Day Listening Practice', 9, 'practice.day6', 'Day 6', null, 'longtext', 1000, 9),
  (2, 'A 7-Day Listening Practice', 10, 'practice.day7', 'Day 7', null, 'longtext', 1000, 10),
  (3, 'After the Seven Days', 11, 'after.consistent', 'What was consistent across the week? What kept coming back?', null, 'longtext', 800, 11),
  (3, 'After the Seven Days', 12, 'after.surprised', 'What surprised you?', null, 'longtext', 800, 12),
  (3, 'After the Seven Days', 13, 'after.assignment', 'What do you sense God is saying specifically about this assignment?', null, 'longtext', 1000, 13)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS3'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

-- ===== WS4 — Spiritual Mapping Guide (planter_and_team, feeds AI) =====
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, true, f.ord
from public.worksheet w, (values
  (1, 'Background Research', 1, 'research.region',
    'City / Region / Neighborhood', 'Complete Part 1 at a desk before going on your prayer walks.', 'shorttext', 200, 1),
  (1, 'Background Research', 2, 'research.history',
    'Spiritual history: What revivals, renewals, or significant spiritual movements have touched this area?',
    null, 'longtext', 1200, 2),
  (1, 'Background Research', 3, 'research.wounds',
    'Historical wounds: What injustices, tragedies, or patterns of harm have shaped this community?',
    null, 'longtext', 1200, 3),
  (1, 'Background Research', 4, 'research.landscape',
    'Current church landscape: What churches exist? What is thriving? What has failed or declined, and why? What kind of church does this community not yet have?',
    null, 'longtext', 1500, 4),
  (1, 'Background Research', 5, 'research.demographic',
    'Demographic reality: Who lives here? What are their dominant needs, concerns, and values?',
    null, 'longtext', 1200, 5),
  (2, 'Prayer Walk Observations', 6, 'walk1.where',
    'Walk 1 — Date and location',
    'Complete one entry per prayer walk. Aim for at least two walks in different areas of your target region.',
    'shorttext', 200, 6),
  (2, 'Prayer Walk Observations', 7, 'walk1.physical',
    'Walk 1 — What I observed physically',
    'What I saw, heard, noticed about the environment.',
    'longtext', 1000, 7),
  (2, 'Prayer Walk Observations', 8, 'walk1.spiritual',
    'Walk 1 — What I sensed spiritually',
    'What felt heavy, open, resistant, or significant.',
    'longtext', 1000, 8),
  (2, 'Prayer Walk Observations', 9, 'walk1.prayer',
    'Walk 1 — What I prayed for in this location', null, 'longtext', 1000, 9),
  (2, 'Prayer Walk Observations', 10, 'walk2.where',
    'Walk 2 — Date and location', null, 'shorttext', 200, 10),
  (2, 'Prayer Walk Observations', 11, 'walk2.physical',
    'Walk 2 — What I observed physically',
    'What I saw, heard, noticed about the environment.',
    'longtext', 1000, 11),
  (2, 'Prayer Walk Observations', 12, 'walk2.spiritual',
    'Walk 2 — What I sensed spiritually',
    'What felt heavy, open, resistant, or significant.',
    'longtext', 1000, 12),
  (2, 'Prayer Walk Observations', 13, 'walk2.prayer',
    'Walk 2 — What I prayed for in this location', null, 'longtext', 1000, 13),
  (3, 'Synthesis', 14, 'synthesis.need',
    'Based on your research and prayer walks, what do you sense is the primary spiritual need of this community?',
    null, 'longtext', 1200, 14),
  (3, 'Synthesis', 15, 'synthesis.strongholds',
    'What strongholds or patterns of spiritual resistance do you believe you will encounter?',
    null, 'longtext', 1200, 15),
  (3, 'Synthesis', 16, 'synthesis.movement',
    'Where do you sense God has already been moving — and what might you be called to build on?',
    null, 'longtext', 1200, 16)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS4'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));


-- ===== WS5 — Intercessory Prayer Cover Strategy (planter_and_team, feeds AI) =====
-- 5 personal intercessor blocks (Name / Why / Asked Y/N / Date) + support
-- prayer + broader cover + comm plan.
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, true, f.ord
from public.worksheet w, (values
  -- Intercessor 1
  (1, 'Personal Intercessors', 1, 'intercessor1.name',
    'Intercessor 1 — Name',
    'These are the people assigned specifically to cover you as a person — not the church, not the ministry. Your personal intercessors know your struggles, your character vulnerabilities, your marriage or household, and your spiritual history. They pray for you. Aim for 3–5 people.',
    'shorttext', 200, 1),
  (1, 'Personal Intercessors', 2, 'intercessor1.why',
    'Intercessor 1 — Why this person', null, 'longtext', 600, 2),
  (1, 'Personal Intercessors', 3, 'intercessor1.asked',
    'Intercessor 1 — Asked and confirmed? (Y / N)', null, 'shorttext', 4, 3),
  (1, 'Personal Intercessors', 4, 'intercessor1.date_asked',
    'Intercessor 1 — Date asked', null, 'date', null, 4),
  -- Intercessor 2
  (1, 'Personal Intercessors', 5, 'intercessor2.name', 'Intercessor 2 — Name', null, 'shorttext', 200, 5),
  (1, 'Personal Intercessors', 6, 'intercessor2.why',  'Intercessor 2 — Why this person', null, 'longtext', 600, 6),
  (1, 'Personal Intercessors', 7, 'intercessor2.asked','Intercessor 2 — Asked and confirmed? (Y / N)', null, 'shorttext', 4, 7),
  (1, 'Personal Intercessors', 8, 'intercessor2.date_asked', 'Intercessor 2 — Date asked', null, 'date', null, 8),
  -- Intercessor 3
  (1, 'Personal Intercessors', 9, 'intercessor3.name', 'Intercessor 3 — Name', null, 'shorttext', 200, 9),
  (1, 'Personal Intercessors', 10, 'intercessor3.why', 'Intercessor 3 — Why this person', null, 'longtext', 600, 10),
  (1, 'Personal Intercessors', 11, 'intercessor3.asked', 'Intercessor 3 — Asked and confirmed? (Y / N)', null, 'shorttext', 4, 11),
  (1, 'Personal Intercessors', 12, 'intercessor3.date_asked', 'Intercessor 3 — Date asked', null, 'date', null, 12),
  -- Intercessor 4
  (1, 'Personal Intercessors', 13, 'intercessor4.name', 'Intercessor 4 — Name (optional)', null, 'shorttext', 200, 13),
  (1, 'Personal Intercessors', 14, 'intercessor4.why', 'Intercessor 4 — Why this person', null, 'longtext', 600, 14),
  (1, 'Personal Intercessors', 15, 'intercessor4.asked', 'Intercessor 4 — Asked and confirmed? (Y / N)', null, 'shorttext', 4, 15),
  (1, 'Personal Intercessors', 16, 'intercessor4.date_asked', 'Intercessor 4 — Date asked', null, 'date', null, 16),
  -- Intercessor 5
  (1, 'Personal Intercessors', 17, 'intercessor5.name', 'Intercessor 5 — Name (optional)', null, 'shorttext', 200, 17),
  (1, 'Personal Intercessors', 18, 'intercessor5.why', 'Intercessor 5 — Why this person', null, 'longtext', 600, 18),
  (1, 'Personal Intercessors', 19, 'intercessor5.asked', 'Intercessor 5 — Asked and confirmed? (Y / N)', null, 'shorttext', 4, 19),
  (1, 'Personal Intercessors', 20, 'intercessor5.date_asked', 'Intercessor 5 — Date asked', null, 'date', null, 20),
  -- WS5 Part 1 new field (support intercessors)
  (1, 'Personal Intercessors', 21, 'intercessors.support',
    'How will you pray for and support your personal intercessors during this season?',
    'Intercessors carry spiritual weight on your behalf. They need covering too. Name specifically how you will hold them up.',
    'longtext', 1000, 21),
  -- Part 2 — Broader Prayer Cover
  (2, 'Broader Prayer Cover', 22, 'broader.target_size',
    'Target size of broader prayer cover',
    'Beyond personal intercessors, build a broader group (10–50 people) that receives regular updates and prays over the church''s general direction.',
    'shorttext', 50, 22),
  (2, 'Broader Prayer Cover', 23, 'broader.recruit',
    'How you will recruit these intercessors', null, 'longtext', 800, 23),
  (2, 'Broader Prayer Cover', 24, 'broader.comm_method',
    'Communication method', 'Email, group chat, monthly call, etc.', 'shorttext', 200, 24),
  (2, 'Broader Prayer Cover', 25, 'broader.comm_freq',
    'Communication frequency', null, 'shorttext', 100, 25),
  -- Part 3 — Prayer Team Communication Plan
  (3, 'Prayer Team Communication Plan', 26, 'comm.what_share',
    'What will you share in each update?',
    'Intercessors cannot pray specifically for what they do not know. Design your communication rhythm here. Praise reports, specific prayer requests, vision updates, personal needs.',
    'longtext', 1000, 26),
  (3, 'Prayer Team Communication Plan', 27, 'comm.frequency',
    'How often will you send updates?', null, 'shorttext', 100, 27),
  (3, 'Prayer Team Communication Plan', 28, 'comm.not_share',
    'What will you not share — and what is your reasoning?', null, 'longtext', 1000, 28),
  (3, 'Prayer Team Communication Plan', 29, 'comm.first_update',
    'First update scheduled for', null, 'date', null, 29)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS5'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

-- ===== WS6 — Household Covenant (household, AI EXCLUDED, locking) =====
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, false, f.ord
from public.worksheet w, (values
  (1, 'The Assignment', 1, 'assignment.planter',
    'Planter: Describe the assignment in plain language — what you believe you are called to do, where, and why',
    'In plain language, the planter describes the assignment to their household. Then household members respond.',
    'longtext', 2000, 1),
  (1, 'The Assignment', 2, 'assignment.household',
    'Household member(s): In your own words, what did you hear? What are you excited about? What concerns you?',
    null, 'longtext', 2000, 2),
  (2, 'What This Season Will Require', 3, 'season.timeline',
    'Estimated timeline from now to launch',
    'Be specific and honest. Vague commitments do not survive hard seasons.',
    'shorttext', 200, 3),
  (2, 'What This Season Will Require', 4, 'season.financial',
    'Financial impact this season',
    'Income changes, fundraising needs, potential reduction in household income.',
    'longtext', 1000, 4),
  (2, 'What This Season Will Require', 5, 'season.time',
    'Time demands on the planter',
    'Hours per week of ministry work, travel requirements, meeting schedules.',
    'longtext', 1000, 5),
  (2, 'What This Season Will Require', 6, 'season.rhythms',
    'What will change about our family rhythms, social life, and available time together',
    null, 'longtext', 1000, 6),
  (3, 'Commitments to Each Other', 7, 'commit.planter',
    'Planter commits to the household: What I will protect, prioritize, and not sacrifice during this season',
    null, 'longtext', 1500, 7),
  (3, 'Commitments to Each Other', 8, 'commit.household',
    'Household commits to the planter: How we will support this assignment and what we are willing to give',
    null, 'longtext', 1500, 8),
  (3, 'Commitments to Each Other', 9, 'commit.conflict',
    'What we will do when this gets hard — our agreement for how we will handle conflict, exhaustion, and doubt',
    null, 'longtext', 1500, 9),
  -- WS6 Part 3 new field (divergence)
  (3, 'Commitments to Each Other', 10, 'commit.divergence',
    'What will we do if we find ourselves no longer walking together on this — if one of us has pulled ahead or fallen behind? How will we name that and close the gap?',
    null, 'longtext', 1500, 10),
  (4, 'Signatures', 11, 'sign.planter',
    'Planter signature', 'This document is not legally binding. It is spiritually serious. Sign it as an act of mutual commitment.', 'shorttext', 200, 11),
  (4, 'Signatures', 12, 'sign.spouse',
    'Spouse / Partner signature', null, 'shorttext', 200, 12),
  (4, 'Signatures', 13, 'sign.other',
    'Other Household Member signature', null, 'shorttext', 200, 13),
  (4, 'Signatures', 14, 'sign.date',
    'Date completed', null, 'date', null, 14)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS6'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));

-- ===== WS7 — Coaching Checkpoint (private, AI EXCLUDED, locking) =====
insert into public.worksheet_field
  (worksheet_id, section_number, section_title, question_number,
   field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order)
select w.id, f.s, f.st, f.q, f.k, f.p, f.h, f.kind, null, f.max_c, false, f.ord
from public.worksheet w, (values
  (1, 'Covering', 1, 'covering.who',
    'Who is your apostolic or spiritual covering? Describe the relationship — how long you have known them, how the covering relationship was established, and what it looks like practically.',
    null, 'longtext', 1500, 1),
  (1, 'Covering', 2, 'covering.honesty',
    'Have you been fully honest with your covering about your character vulnerabilities, your household situation, and your spiritual history? If not, what are you still holding back?',
    null, 'longtext', 1500, 2),
  (2, 'Prayer Foundation', 3, 'foundation.consecration',
    'Describe your current personal consecration practice. Is it actually happening? If not, what is getting in the way?',
    null, 'longtext', 1500, 3),
  (2, 'Prayer Foundation', 4, 'foundation.intercessors',
    'Number of personal intercessors confirmed and active', null, 'shorttext', 10, 4),
  (2, 'Prayer Foundation', 5, 'foundation.mapping',
    'What has the prayer walking and spiritual mapping revealed about your region that surprised you or confirmed what you already sensed?',
    null, 'longtext', 1500, 5),
  (3, 'Household Alignment', 6, 'household.conversation',
    'Has the household covenant conversation happened? Describe how it went — what was said, what was hard, and where you landed.',
    null, 'longtext', 1500, 6),
  (3, 'Household Alignment', 7, 'household.alignment_score',
    'On a scale of 1–10, how aligned is your household with this assignment right now? What would move that number higher?',
    null, 'longtext', 800, 7),
  (4, 'Honest Self-Assessment', 8, 'self.skipped',
    'What in Module 0 did you skip, rush, or avoid? Why? What would it take to go back and complete it?',
    null, 'longtext', 1500, 8),
  (4, 'Honest Self-Assessment', 9, 'self.clearest',
    'What is the clearest thing God has said to you during this module?',
    null, 'longtext', 1000, 9),
  (4, 'Honest Self-Assessment', 10, 'self.tempted',
    'What is the thing you are most tempted to build before God has fully confirmed it?',
    null, 'longtext', 1000, 10),
  (5, 'Completion Confirmation', 11, 'completion.consecration',
    'Personal consecration plan completed and currently active', 'Check each item before considering Module 0 complete.', 'shorttext', 4, 11),
  (5, 'Completion Confirmation', 12, 'completion.covering',
    'Apostolic / spiritual covering identified and relationship established', null, 'shorttext', 4, 12),
  (5, 'Completion Confirmation', 13, 'completion.confirmations',
    'At least 3 prophetic confirmations documented in the Prophetic Confirmation Journal', null, 'shorttext', 4, 13),
  (5, 'Completion Confirmation', 14, 'completion.listening',
    'Prophetic listening practice established as a regular rhythm', null, 'shorttext', 4, 14),
  (5, 'Completion Confirmation', 15, 'completion.intercessors',
    'Prayer team strategy drafted and at least 3 intercessors recruited and confirmed', null, 'shorttext', 4, 15),
  (5, 'Completion Confirmation', 16, 'completion.mapping',
    'Spiritual mapping prayer walk completed at least once', null, 'shorttext', 4, 16),
  (5, 'Completion Confirmation', 17, 'completion.household',
    'Household covenant conversation completed', null, 'shorttext', 4, 17),
  (5, 'Completion Confirmation', 18, 'completion.checkpoint',
    'This coaching checkpoint completed honestly', null, 'shorttext', 4, 18),
  (5, 'Completion Confirmation', 19, 'completion.date_completed',
    'Date Module 0 completed', null, 'date', null, 19),
  (5, 'Completion Confirmation', 20, 'completion.signature',
    'Your signature', null, 'shorttext', 200, 20)
) as f(s, st, q, k, p, h, kind, max_c, ord)
where w.code = 'WS7'
  and w.module_id = (select id from public.module where number='0' and track_id=(select id from public.track where slug='church-planting'));
