---
title: How much is our Steam library worth? i had to find out
date: 2026-09-30
summary: I built SFGraphs to find out who bought what, how much our library is
  worth and how many games we bought twice in our Steam family.
categories:
  - gaming
---
My friends and I share games through a Steam Families group. One person buys, everyone plays. It works great, until someone asks: "wait, who bought this one? And didn't we already have that?"

Steam doesn't answer those questions. So I built SFGraphs.

The first time the timeline chart showed up on screen, with every purchase from every person over the years, was one of those "okay, this was worth it" moments. You can see who brought the most games to the family and how much each person's library is worth at the price they actually paid. You can also see the games we bought twice without noticing (yes, it happened more than once) and who plays whose games. It even posts to our Discord when someone buys something new or when a wishlisted game goes on sale.

Under the hood there's C# with .NET 10 and Blazor, PostgreSQL, the Steam APIs, and IsThereAnyDeal for price history. The trickiest part was figuring out what each game cost on the day it was bought, and staying within the API limits without making the site slow.

It started as curiosity among friends and turned into a project I'm really proud to show. If you share games in a Steam family too, go check out your numbers:

<https://sfgraphs.onrender.com>
